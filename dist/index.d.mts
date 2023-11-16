import { Db, Filter, BSON, FindOptions, AggregateOptions } from 'mongodb';

declare class Model {
    /**
     * The name of the MongoDB collection associated with the model.
     * @private
     * @type {string}
     */
    private $name;
    /**
     * An array of field options specifying the schema for the MongoDB collection.
     * @private
     * @type {FieldOptions[]}
     */
    private $fieldOptions;
    /**
     * An array of index options specifying the indexes to be created for the MongoDB collection.
     * @private
     * @type {IndexOptions[]}
     */
    private $indexOptions;
    /**
     * Additional options for the model.
     * @private
     * @type {OtherOptions}
     */
    private $otherOptions;
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
    constructor(collectionName: string, fieldOptions?: FieldOptions[], indexOptions?: IndexOptions[], otherOptions?: OtherOptions);
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
    private generateIndexes;
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
    private dispatchAction;
    /**
     * Processes the default values for fields with default values defined in the schema.
     *
     * @private
     * @method
     * @param {FieldOptions} field - The field options for a specific field.
     * @throws {Error} If a default value is incompatible with the field type.
     */
    private processDefault;
    /**
     * Processes a document before insertion or update, applying default values and type conversions.
     *
     * @private
     * @method
     * @param {MongoDocument} document - The document to be processed.
     * @param {boolean} [isUpdate=false] - Indicates whether the document is being updated.
     * @returns {MongoDocument} The processed document.
     */
    private processDocument;
    /**
     * Performs an aggregation operation on the MongoDB collection associated with the current instance.
     *
     * @async
     * @method
     * @memberof YourNamespace.Model
     * @param {Object[]} query - The aggregation pipeline stages.
     * @param {Object} options - Additional options for the aggregation.
     * @throws {Error} If an error occurs during the aggregation process.
     * @returns {Promise<any>} A Promise that resolves with the result of the aggregation.
     *
     * @example
     * // Usage within the class:
     * const aggregationResult = await this.aggregate([{ $match: { status: 'active' } }]);
     */
    aggregate: MongoAggregate;
    /**
     * Performs a find operation on the MongoDB collection associated with the current instance,
     * returning the first document that matches the specified query.
     *
     * @async
     * @method
     * @memberof YourNamespace.Model
     * @param {Object} query - The query criteria.
     * @param {Object} options - Additional options for the find operation.
     * @throws {Error} If an error occurs during the find operation.
     * @returns {Promise<any | null>} A Promise that resolves with the found document or null if not found.
     *
     * @example
     * // Usage within the class:
     * const foundDocument = await this.findOne({ username: 'john_doe' });
     */
    findOne: MongoFindOne;
    /**
     * Performs a find operation on the MongoDB collection associated with the current instance,
     * returning a cursor to the documents that match the specified query.
     *
     * @async
     * @method
     * @memberof YourNamespace.Model
     * @param {Object} query - The query criteria.
     * @param {Object} options - Additional options for the find operation.
     * @throws {Error} If an error occurs during the find operation.
     * @returns {Promise<any>} A Promise that resolves with the cursor to the found documents.
     *
     * @example
     * // Usage within the class:
     * const cursor = await this.find({ status: 'active' });
     */
    find: MongoFind;
    /**
     * Counts the number of documents in the MongoDB collection associated with the current instance
     * that match the specified query.
     *
     * @async
     * @method
     * @memberof YourNamespace.Model
     * @param {Object} query - The query criteria.
     * @throws {Error} If an error occurs during the count operation.
     * @returns {Promise<number>} A Promise that resolves with the count of matching documents.
     *
     * @example
     * // Usage within the class:
     * const documentCount = await this.count({ status: 'active' });
     */
    count: MongoCount;
    /**
     * Performs a find-and-modify operation on the MongoDB collection associated with the current instance,
     * returning the modified document.
     *
     * @async
     * @method
     * @memberof YourNamespace.Model
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
    findOneAndUpdate: MongoFindOneAndUpdate;
    /**
     * Updates a single document in the MongoDB collection associated with the current instance.
     *
     * @async
     * @method
     * @memberof YourNamespace.Model
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
    updateOne: MongoUpdateOne;
    /**
     * Updates multiple documents in the MongoDB collection associated with the current instance.
     *
     * @async
     * @method
     * @memberof YourNamespace.Model
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
    updateMany: MongoUpdateMany;
    /**
     * Deletes multiple documents in the MongoDB collection associated with the current instance.
     *
     * @async
     * @method
     * @memberof YourNamespace.Model
     * @param {Object} query - The query criteria for finding the documents to delete.
     * @throws {Error} If an error occurs during the delete operation.
     * @returns {Promise<boolean>} A Promise that resolves with a boolean indicating the success of the delete operation.
     *
     * @example
     * // Usage within the class:
     * const areDeleted = await this.deleteMany({ status: 'inactive' });
     */
    deleteMany: MongoDelete;
    /**
     * Deletes a single document in the MongoDB collection associated with the current instance.
     *
     * @async
     * @method
     * @memberof YourNamespace.Model
     * @param {Object} query - The query criteria for finding the document to delete.
     * @throws {Error} If an error occurs during the delete operation.
     * @returns {Promise<boolean>} A Promise that resolves with a boolean indicating the success of the delete operation.
     *
     * @example
     * // Usage within the class:
     * const isDeleted = await this.deleteOne({ status: 'inactive' });
     */
    deleteOne: MongoDelete;
    /**
     * Inserts a single document into the MongoDB collection associated with the current instance.
     *
     * @async
     * @method
     * @memberof YourNamespace.Model
     * @param {Object} document - The document to be inserted.
     * @throws {Error} If an error occurs during the insert operation.
     * @returns {Promise<any | null>} A Promise that resolves with the inserted document or null if insertion fails.
     *
     * @example
     * // Usage within the class:
     * const insertedDocument = await this.insertOne({ username: 'john_doe', status: 'active' });
     */
    insertOne: MongoInsertOne;
    /**
     * Inserts multiple documents into the MongoDB collection associated with the current instance.
     *
     * @async
     * @method
     * @memberof YourNamespace.Model
     * @param {Object[]} documents - An array of documents to be inserted.
     * @throws {Error} If an error occurs during the insert operation.
     * @returns {Promise<any | null>} A Promise that resolves with the inserted documents or null if insertion fails.
     *
     * @example
     * // Usage within the class:
     * const insertedDocuments = await this.insertMany([{ username: 'john_doe', status: 'active' }, { username: 'jane_doe', status: 'inactive' }]);
     */
    insertMany: MongoInsertMany;
    /**
     * Finds a document in the MongoDB collection associated with the current instance based on the provided query.
     * If no document is found, a new document is inserted into the collection using the provided document.
     *
     * @async
     * @method
     * @memberof YourClassName
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
    findOneOrCreate: MongoFindOneOrCreate;
}

declare class Connection {
    static $mongoConnection: Db;
    static $models: Model[];
    constructor(uri?: string, modelPath?: string);
    static sanitize(v: DefaultValue): any;
}

declare const _default: {
    String: string;
    Number: string;
    Boolean: string;
    Date: string;
    Array: string;
    Object: string;
    ObjectId: string;
};

type DefaultValue = string | number | boolean | Date | object | array | null;
type MongoFindOne = (filter: Filter<BSON.Document>, options?: FindOptions) => Promise<T | null>;
type MongoFind = (filter: Filter<BSON.Document>, options?: FindOptions) => Promise<T[]>;
type MongoInsertOne = (doc: T) => Promise<T>;
type MongoInsertMany = (docs: T[]) => Promise<T[]>;
type MongoUpdateOne = (filter: Filter<BSON.Document>, doc: T, upsert?: boolean, useModifier?: string) => Promise<T | null>;
type MongoUpdateMany = (filter: Filter<BSON.Document>, doc: T, useModifier?: string) => Promise<boolean>;
type MongoDelete = (filter: Filter<BSON.Document>) => Promise<boolean>;
type MongoCount = (filter: Filter<BSON.Document>) => Promise<number>;
type MongoAggregate = (pipeline: BSON.Document[], options?: AggregateOptions) => Promise<T[]>;
type MongoFindOneAndUpdate = (filter: Filter<BSON.Document>, doc: T, upsert?: boolean, useModifier?: string) => Promise<T | null>;
type MongoFindOneOrCreate = (filter: Filter<BSON.Document>, doc: T) => Promise<T>;

interface MongoORMInterface {
  Connection: typeof Connection;
  Model: typeof Model;
  FieldTypes: typeof _default;
}

interface FieldOptions {
  name: string;
  type: string;
  default?: DefaultValue;
  required?: boolean;
}

interface IndexOptions {
  name: string;
  fields: { [key: string]: 'text' | number };
  unique?: boolean;
}

interface OtherOptions {
  log: number;
  debug?: boolean;
}

declare const exportData: MongoORMInterface;

export { exportData as default };
