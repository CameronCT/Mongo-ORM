/**
 * Represents a MongoDB model that provides methods for interacting with a specific collection.
 *
 * @class
 */
import Message from './Message';
import QueryBuilder from './QueryBuilder';
import {
  FieldOptions,
  IndexOptions,
  OtherOptions,
  MongoAggregate,
  MongoFindOne,
  MongoFind,
  MongoCount,
  MongoFindOneAndUpdate,
  MongoUpdateOne,
  MongoUpdateMany,
  MongoInsertOne,
  MongoInsertMany,
  MongoDelete,
  MongoFindOneOrCreate,
  MongoDocument,
  MongoDispatchAction
} from './types';
import FieldTypes from './FieldTypes';

class Model {
  /**
   * The `QueryBuilder` instance
   */
  private $queryBuilder: QueryBuilder;

  /**
   * The name of the MongoDB collection associated with the model.
   * @private
   * @type {string}
   */
  private $name: string = '';

  /**
   * An array of field options specifying the schema for the MongoDB collection.
   * @private
   * @type {FieldOptions[]}
   */
  private $fieldOptions: FieldOptions[] = [];

  /**
   * An array of index options specifying the indexes to be created for the MongoDB collection.
   * @private
   * @type {IndexOptions[]}
   */
  private $indexOptions: IndexOptions[] = [];

  /**
   * Additional options for the model.
   * @private
   * @type {OtherOptions}
   */
  private $otherOptions: OtherOptions = {
    debug: false,
    log: -1
  };

  /**
   * Creates an instance of the Model class.
   *
   * @constructor
   * @param {string} collectionName - The name of the MongoDB collection.
   * @param {FieldOptions[]} [fieldOptions=[]] - An array of field options specifying the schema.
   * @param {IndexOptions[]} [indexOptions=[]] - An array of index options specifying the indexes.
   * @param {OtherOptions} [otherOptions] - Additional options for the model.
   * @throws {Error} If the provided field options include reserved names like 'createdAt' or 'updatedAt'.
   */
  constructor(collectionName: string, fieldOptions: FieldOptions[] = [], indexOptions: IndexOptions[] = [], otherOptions?: OtherOptions) {
    this.$queryBuilder = new QueryBuilder();
    this.$name = String(collectionName);
    this.$fieldOptions = fieldOptions;
    this.$indexOptions = indexOptions;
    this.$otherOptions = {
      debug: otherOptions?.debug || false,
      log: otherOptions?.log || -1
    };

    this.$fieldOptions.forEach((field) => this.processDefault(field));

    const checkBadFields = this.$fieldOptions.filter((field) => ['createdAt', 'updatedAt'].includes(field.name));
    if (checkBadFields?.length !== 0) throw new Error(`You cannot use the field names createdAt or updatedAt as they are reserved for the ORM.`);
  }

  /**
   * Generates indexes for the MongoDB collection associated with the current instance.
   *
   * @private
   * @method
   * @async
   * @throws {Error} If an error occurs during the index creation process.
   * @returns {Promise<void>} A Promise that resolves when all indexes are successfully generated.
   *
   * @example
   * // Usage within the class:
   * await this.generateIndexes();
   */
  generateIndexes = async () => {
    this.$indexOptions.forEach(async (index) => {
      const params: { [key: string]: string | boolean } = {};
      if (index.unique) params.unique = true;
      if (index.name) params.name = index.name;
      await this.$queryBuilder.createIndex(this.$name, index.fields, params);
    });
    Message(`Generated indexes for ${this.$name} (${this.$indexOptions.length} total).`);
  };

  /**
   * Dispatches an asynchronous action with optional debugging and logging.
   *
   * @private
   * @method
   * @async
   * @param {Function} fn - The function to be executed.
   * @param {MongoQuery} [query={}] - The MongoDB query associated with the action.
   * @throws {Error} If an error occurs during the action execution.
   * @returns {Promise<any>} A Promise that resolves with the result of the action.
   *
   * @example
   * // Usage within the class:
   * const result = await this.dispatchAction(async () => await someAsyncFunction(), { key: 'value' });
   */
  private dispatchAction: MongoDispatchAction = async (fn, query = {}) => {
    if (this.$otherOptions.debug) {
      const start = new Date().getTime();
      const result = await fn();
      const end = new Date().getTime();
      const total = end - start;

      if (this.$otherOptions.log !== -1 && total > this.$otherOptions.log) {
        this.$queryBuilder.insertOne('_mongoOrmDebug', {
          model: this.$name,
          query: JSON.stringify(query, null, 2),
          time: total,
          date: new Date()
        });
      }
      return result;
    } else {
      return await fn();
    }
  };

  /**
   * Processes the default values for fields with default values defined in the schema.
   *
   * @private
   * @method
   * @param {FieldOptions} field - The field options for a specific field.
   * @throws {Error} If a default value is incompatible with the field type.
   */
  private processDefault = (field: FieldOptions) => {
    if (typeof field.default === 'undefined') return;

    if (field.type === FieldTypes.String && typeof field.default !== 'string' && field.default !== null)
      throw new Error(`Field is of type string but the default value is not a string or null.`);
    else if (field.type === FieldTypes.Number && typeof field.default !== 'number' && field.default !== null)
      throw new Error(`Field is of type number but the default value is not a number or null.`);
    else if (field.type === FieldTypes.Boolean && typeof field.default !== 'boolean')
      throw new Error(`Field is of type boolean but the default value is not a boolean.`);
    else if (field.type === FieldTypes.Date && !(field.default instanceof Date)) throw new Error(`Field is of type date but the default value is not a date.`);
    else if (field.type === FieldTypes.Array && !Array.isArray(field.default)) throw new Error(`Field is of type array but the default value is not an array.`);
    else if (field.type === FieldTypes.Object && typeof field.default !== 'object' && field.default !== null)
      throw new Error(`Field is of type object but the default value is not an object or null.`);
    else if (field.type === FieldTypes.ObjectId && typeof field.default !== 'string' && field.default !== null)
      throw new Error(`Field is of type objectId but the default value is not a string or null.`);
  };

  /**
   * Processes a document before insertion or update, applying default values and type conversions.
   *
   * @private
   * @method
   * @param {MongoDocument} document - The document to be processed.
   * @param {boolean} [isUpdate=false] - Indicates whether the document is being updated.
   * @returns {MongoDocument} The processed document.
   */
  private processDocument = (document: MongoDocument, isUpdate: boolean = false) => {
    const processedDocument: MongoDocument = {};
    const fieldLength = this.$fieldOptions.length;

    for (let i = 0; i < fieldLength; i++) {
      const field = this.$fieldOptions[i];
      if (document[field.name]) {
        if (field.type === FieldTypes.Date) processedDocument[field.name] = new Date(document[field.name]);
        else if (field.type === FieldTypes.Number) processedDocument[field.name] = Number(document[field.name]);
        else if (field.type === FieldTypes.Boolean) processedDocument[field.name] = Boolean(document[field.name]);
        else if (field.type === FieldTypes.ObjectId) processedDocument[field.name] = String(document[field.name]);
        else if (field.type === FieldTypes.Array && !Array.isArray(document[field.name])) processedDocument[field.name] = Array(document[field.name]);
        else if (field.type === FieldTypes.Object) processedDocument[field.name] = Object(document[field.name]);
        else processedDocument[field.name] = document[field.name];
      } else if (typeof field.default !== 'undefined') {
        if (field.type === FieldTypes.Date) processedDocument[field.name] = new Date(field.default);
        else if (field.type === FieldTypes.Number) processedDocument[field.name] = Number(field.default);
        else if (field.type === FieldTypes.Boolean) processedDocument[field.name] = Boolean(field.default);
        else if (field.type === FieldTypes.ObjectId) processedDocument[field.name] = String(field.default);
        else if (field.type === FieldTypes.Array && !Array.isArray(field.default)) processedDocument[field.name] = Array(field.default);
        else if (field.type === FieldTypes.Object) processedDocument[field.name] = Object(field.default);
        else processedDocument[field.name] = field.default;
      } else if (!isUpdate && field.required)
        throw new Error(`Field ${field.name} is required but was not provided a value and does not have a default value to back up off.`);
    }

    processedDocument[isUpdate ? 'updatedAt' : 'createdAt'] = Math.ceil(new Date().getTime() / 1000);
    return processedDocument;
  };

  /**
   * Performs an aggregation operation on the MongoDB collection associated with the current instance.
   *
   * @async
   * @method
   * @memberof MongoODM.Model
   * @param {Object[]} query - The aggregation pipeline stages.
   * @param {Object} options - Additional options for the aggregation.
   * @throws {Error} If an error occurs during the aggregation process.
   * @returns {Promise<any>} A Promise that resolves with the result of the aggregation.
   *
   * @example
   * // Usage within the class:
   * const aggregationResult = await this.aggregate([{ $match: { status: 'active' } }]);
   */
  aggregate: MongoAggregate = async (query, options) => {
    return await this.dispatchAction(async () => await this.$queryBuilder.aggregate(this.$name, query, options), query);
  };

  /**
   * Performs a find operation on the MongoDB collection associated with the current instance,
   * returning the first document that matches the specified query.
   *
   * @async
   * @method
   * @memberof MongoODM.Model
   * @param {Object} query - The query criteria.
   * @param {Object} options - Additional options for the find operation.
   * @throws {Error} If an error occurs during the find operation.
   * @returns {Promise<any | null>} A Promise that resolves with the found document or null if not found.
   *
   * @example
   * // Usage within the class:
   * const foundDocument = await this.findOne({ username: 'john_doe' });
   */
  findOne: MongoFindOne = async (query, options) => {
    return await this.dispatchAction(async () => await this.$queryBuilder.findOne(this.$name, query, options), query);
  };

  /**
   * Performs a find operation on the MongoDB collection associated with the current instance,
   * returning a cursor to the documents that match the specified query.
   *
   * @async
   * @method
   * @memberof MongoODM.Model
   * @param {Object} query - The query criteria.
   * @param {Object} options - Additional options for the find operation.
   * @throws {Error} If an error occurs during the find operation.
   * @returns {Promise<any>} A Promise that resolves with the cursor to the found documents.
   *
   * @example
   * // Usage within the class:
   * const cursor = await this.find({ status: 'active' });
   */
  find: MongoFind = async (query, options) => {
    return await this.dispatchAction(async () => await this.$queryBuilder.find(this.$name, query, options), query);
  };

  /**
   * Counts the number of documents in the MongoDB collection associated with the current instance
   * that match the specified query.
   *
   * @async
   * @method
   * @memberof MongoODM.Model
   * @param {Object} query - The query criteria.
   * @throws {Error} If an error occurs during the count operation.
   * @returns {Promise<number>} A Promise that resolves with the count of matching documents.
   *
   * @example
   * // Usage within the class:
   * const documentCount = await this.count({ status: 'active' });
   */
  count: MongoCount = async (query) => {
    return await this.dispatchAction(async () => await this.$queryBuilder.count(this.$name, query), query);
  };

  /**
   * Performs a find-and-modify operation on the MongoDB collection associated with the current instance,
   * returning the modified document.
   *
   * @async
   * @method
   * @memberof MongoODM.Model
   * @param {Object} query - The query criteria for finding the document to update.
   * @param {Object} update - The update operation to apply to the found document.
   * @param {boolean} [upsert=false] - If true, creates a new document when no document matches the query criteria.
   * @param {string} [useModifier='$set'] - The modifier to use for the update operation.
   * @throws {Error} If an error occurs during the update operation.
   * @returns {Promise<any | null>} A Promise that resolves with the modified document or null if not found.
   *
   * @example
   * // Usage within the class:
   * const updatedDocument = await this.findOneAndUpdate({ username: 'john_doe' }, { $set: { status: 'inactive' } });
   */
  findOneAndUpdate: MongoFindOneAndUpdate = async (query, update, upsert = false, useModifier = '$set') => {
    const result = await this.dispatchAction(
      async () => await this.$queryBuilder.findOneAndUpdate(this.$name, query, this.processDocument(update, true), upsert, useModifier),
      query
    );

    return result?.acknowledged ? await this.findOne({ ...query }) : null;
  };

  /**
   * Updates a single document in the MongoDB collection associated with the current instance.
   *
   * @async
   * @method
   * @memberof MongoODM.Model
   * @param {Object} query - The query criteria for finding the document to update.
   * @param {Object} update - The update operation to apply to the found document.
   * @param {boolean} [upsert=false] - If true, creates a new document when no document matches the query criteria.
   * @param {string} [useModifier='$set'] - The modifier to use for the update operation.
   * @throws {Error} If an error occurs during the update operation.
   * @returns {Promise<boolean>} A Promise that resolves with a boolean indicating the success of the update operation.
   *
   * @example
   * // Usage within the class:
   * const isUpdated = await this.updateOne({ username: 'john_doe' }, { status: 'inactive' }, '$set');
   */
  updateOne: MongoUpdateOne = async (query, update, upsert = false, useModifier = '$set') => {
    const result = await this.dispatchAction(
      async () => await this.$queryBuilder.updateOne(this.$name, query, this.processDocument(update, true), upsert, useModifier),
      query
    );
    return !!result?.acknowledged;
  };

  /**
   * Updates multiple documents in the MongoDB collection associated with the current instance.
   *
   * @async
   * @method
   * @memberof MongoODM.Model
   * @param {Object} query - The query criteria for finding the documents to update.
   * @param {Object} document - The update operation to apply to the found documents.
   * @param {string} [useModifier='$set'] - The modifier to use for the update operation.
   * @throws {Error} If an error occurs during the update operation.
   * @returns {Promise<boolean>} A Promise that resolves with a boolean indicating the success of the update operation.
   *
   * @example
   * // Usage within the class:
   * const areUpdated = await this.updateMany({ status: 'active' }, { status: 'inactive' }, '$set');
   */
  updateMany: MongoUpdateMany = async (query, document, useModifier = '$set') => {
    const result = await this.dispatchAction(
      async () => await this.$queryBuilder.updateMany(this.$name, query, { [useModifier]: this.processDocument(document, true) }),
      query
    );
    return !!result?.acknowledged;
  };

  /**
   * Deletes multiple documents in the MongoDB collection associated with the current instance.
   *
   * @async
   * @method
   * @memberof MongoODM.Model
   * @param {Object} query - The query criteria for finding the documents to delete.
   * @throws {Error} If an error occurs during the delete operation.
   * @returns {Promise<boolean>} A Promise that resolves with a boolean indicating the success of the delete operation.
   *
   * @example
   * // Usage within the class:
   * const areDeleted = await this.deleteMany({ status: 'inactive' });
   */
  deleteMany: MongoDelete = async (query) => {
    const result = await this.dispatchAction(async () => await this.$queryBuilder.deleteMany(this.$name, query));
    return !!result?.acknowledged;
  };

  /**
   * Deletes a single document in the MongoDB collection associated with the current instance.
   *
   * @async
   * @method
   * @memberof MongoODM.Model
   * @param {Object} query - The query criteria for finding the document to delete.
   * @throws {Error} If an error occurs during the delete operation.
   * @returns {Promise<boolean>} A Promise that resolves with a boolean indicating the success of the delete operation.
   *
   * @example
   * // Usage within the class:
   * const isDeleted = await this.deleteOne({ status: 'inactive' });
   */
  deleteOne: MongoDelete = async (query) => {
    const result = await this.dispatchAction(async () => await this.$queryBuilder.deleteOne(this.$name, query));
    return !!result?.acknowledged;
  };

  /**
   * Inserts a single document into the MongoDB collection associated with the current instance.
   *
   * @async
   * @method
   * @memberof MongoODM.Model
   * @param {Object} document - The document to be inserted.
   * @throws {Error} If an error occurs during the insert operation.
   * @returns {Promise<any | null>} A Promise that resolves with the inserted document or null if insertion fails.
   *
   * @example
   * // Usage within the class:
   * const insertedDocument = await this.insertOne({ username: 'john_doe', status: 'active' });
   */
  insertOne: MongoInsertOne = async (document) => {
    const result = await this.dispatchAction(async () => await this.$queryBuilder.insertOne(this.$name, this.processDocument(document)));
    return !!result?.acknowledged;
  };

  /**
   * Inserts multiple documents into the MongoDB collection associated with the current instance.
   *
   * @async
   * @method
   * @memberof MongoODM.Model
   * @param {Object[]} documents - An array of documents to be inserted.
   * @throws {Error} If an error occurs during the insert operation.
   * @returns {Promise<any | null>} A Promise that resolves with the inserted documents or null if insertion fails.
   *
   * @example
   * // Usage within the class:
   * const insertedDocuments = await this.insertMany([{ username: 'john_doe', status: 'active' }, { username: 'jane_doe', status: 'inactive' }]);
   */
  insertMany: MongoInsertMany = async (documents) => {
    const result = await this.dispatchAction(
      async () =>
        await this.$queryBuilder.insertMany(
          this.$name,
          documents.map((doc) => this.processDocument(doc))
        )
    );
    return !!result?.acknowledged;
  };

  /**
   * Finds a document in the MongoDB collection associated with the current instance based on the provided query.
   * If no document is found, a new document is inserted into the collection using the provided document.
   *
   * @async
   * @method
   * @memberof Model
   * @param {MongoQuery} query - The query criteria to find an existing document.
   * @param {MongoDocument} document - The document to insert if no existing document is found.
   * @throws {Error} If an error occurs during the find or insert operation.
   * @returns {Promise<MongoDocument | null>} A Promise that resolves with the found or inserted document, or null if an error occurs.
   *
   * @example
   * // Usage within the class:
   * const query = { username: 'john_doe' };
   * const newDocument = { username: 'john_doe', email: 'john@example.com' };
   * const result = await this.findOneOrCreate(query, newDocument);
   */
  findOneOrCreate: MongoFindOneOrCreate = async (query, document) => {
    const findOne = await this.dispatchAction(async () => await this.$queryBuilder.findOne(this.$name, query), query);
    if (findOne) return findOne;
    else return await this.insertOne(this.processDocument(document));
  };
}

export default Model;
