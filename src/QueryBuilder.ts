/**
 * Represents a MongoDB model that provides methods for interacting with a specific collection.
 *
 * @class
 */
import Connection from './Connection';
import {
  MongoInsertOneWithCollection,
  MongoInsertManyWithCollection,
  MongoDeleteWithCollection,
  MongoFindOneOrCreateWithCollection,
  MongoAggregateWithCollection,
  MongoCountWithCollection,
  MongoFindOneAndUpdateWithCollection,
  MongoFindOneWithCollection,
  MongoFindWithCollection,
  MongoUpdateManyWithCollection,
  MongoUpdateOneWithCollection,
  MongoCreateIndex
} from './types';

class QueryBuilder {
  /**
   * Creates an index for the MongoDB collection associated with the current instance.
   *
   * @private
   * @method
   * @async
   * @throws {Error} If an error occurs during the index creation process.
   * @returns {Promise<void>} A Promise that resolves when all indexes are successfully generated.
   *
   * @example
   * // Usage within the class:
   * await this.createIndex("users", { userId: 1 }, { unique: true })
   */
  createIndex: MongoCreateIndex = async (collection, fields, options) => {
    return await Connection.$mongoConnection.collection(collection).createIndex(fields, options);
  };

  /**
   * Performs an aggregation operation on the MongoDB collection associated with the current instance.
   *
   * @async
   * @method
   * @memberof MongoODM.QueryBuilder
   * @param {String} collection - The name of the collection to count documents from.
   * @param {Object[]} query - The aggregation pipeline stages.
   * @param {Object} options - Additional options for the aggregation.
   * @throws {Error} If an error occurs during the aggregation process.
   * @returns {Promise<any>} A Promise that resolves with the result of the aggregation.
   *
   * @example
   * // Usage within the class:
   * const aggregationResult = await this.aggregate([{ $match: { status: 'active' } }]);
   */
  aggregate: MongoAggregateWithCollection = async (collection, query, options) => {
    const aggregateQuery = await Connection.$mongoConnection.collection(collection).aggregate(query, options);
    return await aggregateQuery?.toArray() || [];
  };

  /**
   * Performs a find operation on the MongoDB collection associated with the current instance,
   * returning the first document that matches the specified query.
   *
   * @async
   * @method
   * @memberof MongoODM.QueryBuilder
   * @param {String} collection - The name of the collection to count documents from.
   * @param {Object} query - The query criteria.
   * @param {Object} options - Additional options for the find operation.
   * @throws {Error} If an error occurs during the find operation.
   * @returns {Promise<any | null>} A Promise that resolves with the found document or null if not found.
   *
   * @example
   * // Usage within the class:
   * const foundDocument = await this.findOne({ username: 'john_doe' });
   */
  findOne: MongoFindOneWithCollection = async (collection, query, options) => {
    return await Connection.$mongoConnection.collection(collection).findOne(query, options);
  };

  /**
   * Performs a find operation on the MongoDB collection associated with the current instance,
   * returning a cursor to the documents that match the specified query.
   *
   * @async
   * @method
   * @memberof MongoODM.QueryBuilder
   * @param {String} collection - The name of the collection to count documents from.
   * @param {Object} query - The query criteria.
   * @param {Object} options - Additional options for the find operation.
   * @throws {Error} If an error occurs during the find operation.
   * @returns {Promise<any>} A Promise that resolves with the cursor to the found documents.
   *
   * @example
   * // Usage within the class:
   * const cursor = await this.find({ status: 'active' });
   */
  find: MongoFindWithCollection = async (collection, query, options) => {
    return await Connection.$mongoConnection.collection(collection).find(query, options);
  };

  /**
   * Counts the number of documents in the MongoDB collection associated with the current instance
   * that match the specified query.
   *
   * @async
   * @method
   * @memberof MongoODM.QueryBuilder
   * @param {String} collection - The name of the collection to count documents from.
   * @param {Object} query - The query criteria.
   * @throws {Error} If an error occurs during the count operation.
   * @returns {Promise<number>} A Promise that resolves with the count of matching documents.
   *
   * @example
   * // Usage within the class:
   * const documentCount = await this.count({ status: 'active' });
   */
  count: MongoCountWithCollection = async (collection, query) => {
    return await Connection.$mongoConnection.collection(collection).countDocuments(query);
  };

  /**
   * Performs a find-and-modify operation on the MongoDB collection associated with the current instance,
   * returning the modified document.
   *
   * @async
   * @method
   * @memberof MongoODM.QueryBuilder
   * @param {String} collection - The name of the collection to count documents from.
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
  findOneAndUpdate: MongoFindOneAndUpdateWithCollection = async (collection, query, update, upsert = false, useModifier = '$set') => {
    const result = await Connection.$mongoConnection
      .collection(collection)
      .findOneAndUpdate(query, { [useModifier]: update }, { upsert: upsert, returnDocument: 'after' });
    return result?.acknowledged ? await this.findOne(collection, { ...query }) : null;
  };

  /**
   * Updates a single document in the MongoDB collection associated with the current instance.
   *
   * @async
   * @method
   * @memberof MongoODM.QueryBuilder
   * @param {String} collection - The name of the collection to count documents from.
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
  updateOne: MongoUpdateOneWithCollection = async (collection, query, update, upsert = false, useModifier = '$set') => {
    const result = await Connection.$mongoConnection.collection(collection).updateOne(query, { [useModifier]: update }, { upsert });
    return !!result?.acknowledged;
  };

  /**
   * Updates multiple documents in the MongoDB collection associated with the current instance.
   *
   * @async
   * @method
   * @memberof MongoODM.QueryBuilder
   * @param {String} collection - The name of the collection to count documents from.
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
  updateMany: MongoUpdateManyWithCollection = async (collection, query, document, useModifier = '$set') => {
    const result = await Connection.$mongoConnection.collection(collection).updateMany(query, { [useModifier]: document });
    return !!result?.acknowledged;
  };

  /**
   * Deletes multiple documents in the MongoDB collection associated with the current instance.
   *
   * @async
   * @method
   * @memberof MongoODM.QueryBuilder
   * @param {String} collection - The name of the collection to count documents from.
   * @param {Object} query - The query criteria for finding the documents to delete.
   * @throws {Error} If an error occurs during the delete operation.
   * @returns {Promise<boolean>} A Promise that resolves with a boolean indicating the success of the delete operation.
   *
   * @example
   * // Usage within the class:
   * const areDeleted = await this.deleteMany({ status: 'inactive' });
   */
  deleteMany: MongoDeleteWithCollection = async (collection, query) => {
    const result = await Connection.$mongoConnection.collection(collection).deleteMany(query);
    return !!result?.acknowledged;
  };

  /**
   * Deletes a single document in the MongoDB collection associated with the current instance.
   *
   * @async
   * @method
   * @memberof MongoODM.QueryBuilder
   * @param {String} collection - The name of the collection to count documents from.
   * @param {Object} query - The query criteria for finding the document to delete.
   * @throws {Error} If an error occurs during the delete operation.
   * @returns {Promise<boolean>} A Promise that resolves with a boolean indicating the success of the delete operation.
   *
   * @example
   * // Usage within the class:
   * const isDeleted = await this.deleteOne({ status: 'inactive' });
   */
  deleteOne: MongoDeleteWithCollection = async (collection, query) => {
    const result = await Connection.$mongoConnection.collection(collection).deleteOne(query);
    return !!result?.acknowledged;
  };

  /**
   * Inserts a single document into the MongoDB collection associated with the current instance.
   *
   * @async
   * @method
   * @memberof MongoODM.QueryBuilder
   * @param {String} collection - The name of the collection to count documents from.
   * @param {Object} document - The document to be inserted.
   * @throws {Error} If an error occurs during the insert operation.
   * @returns {Promise<any | null>} A Promise that resolves with the inserted document or null if insertion fails.
   *
   * @example
   * // Usage within the class:
   * const insertedDocument = await this.insertOne({ username: 'john_doe', status: 'active' });
   */
  insertOne: MongoInsertOneWithCollection = async (collection, document) => {
    const result = await Connection.$mongoConnection.collection(collection).insertOne(document);
    return {
      _id: result?.insertedId,
      ...document
    };
  };

  /**
   * Inserts multiple documents into the MongoDB collection associated with the current instance.
   *
   * @async
   * @method
   * @memberof MongoODM.QueryBuilder
   * @param {String} collection - The name of the collection to count documents from.
   * @param {Object[]} documents - An array of documents to be inserted.
   * @throws {Error} If an error occurs during the insert operation.
   * @returns {Promise<any | null>} A Promise that resolves with the inserted documents or null if insertion fails.
   *
   * @example
   * // Usage within the class:
   * const insertedDocuments = await this.insertMany([{ username: 'john_doe', status: 'active' }, { username: 'jane_doe', status: 'inactive' }]);
   */
  insertMany: MongoInsertManyWithCollection = async (collection, documents) => {
    const result = await Connection.$mongoConnection.collection(collection).insertMany(documents.map((doc) => doc));
    return !!result?.acknowledged;
  };

  /**
   * Finds a document in the MongoDB collection associated with the current instance based on the provided query.
   * If no document is found, a new document is inserted into the collection using the provided document.
   *
   * @async
   * @method
   * @memberof MongoODM.QueryBuilder
   * @param {String} collection - The name of the collection to count documents from.
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
  findOneOrCreate: MongoFindOneOrCreateWithCollection = async (collection, query, document) => {
    const findOne = await Connection.$mongoConnection.collection(collection).findOne(query);
    if (findOne) return findOne;
    else return await this.insertOne(collection, document);
  };
}

export default QueryBuilder;
