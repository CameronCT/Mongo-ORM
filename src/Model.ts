import Connection from './Connection';
import Message from './Message';
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
  MongoQuery,
  MongoDocument
} from './types';
import FieldTypes from './FieldTypes';

class Model {
  private $name: string = '';
  private $fieldOptions: FieldOptions[] = [];
  private $indexOptions: IndexOptions[] = [];
  private $otherOptions: OtherOptions = {
    debug: false,
    log: -1
  };

  constructor(collectionName: string, fieldOptions: FieldOptions[] = [], indexOptions: IndexOptions[] = [], otherOptions?: OtherOptions) {
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

  private async generateIndexes() {
    this.$indexOptions.forEach(async (index) => {
      const params: { [key: string]: string | boolean } = {};
      if (index.unique) params.unique = true;
      if (index.name) params.name = index.name;
      await Connection.$mongoConnection[this.$name].createIndex(index.fields, { ...params });
    });
    Message(`Generated indexes for ${this.$name} (${this.$indexOptions.length} total).`);
  }

  private async dispatchAction(fn: () => Promise<any>, query: MongoQuery = {}) {
    if (this.$otherOptions.debug) {
      const start = new Date().getTime();
      const result = await fn();
      const end = new Date().getTime();
      const total = end - start;

      if (this.$otherOptions.log !== -1 && total > this.$otherOptions.log) {
        Connection.$mongoConnection['_mongoOrmDebug'].insertOne({
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
  }

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

  aggregate: MongoAggregate = async (query, options) => {
    return await this.dispatchAction(async () => await Connection.$mongoConnection[this.$name].aggregate(query, options), query);
  };

  findOne: MongoFindOne = async (query, options) => {
    return await this.dispatchAction(async () => await Connection.$mongoConnection[this.$name].findOne(query, options), query);
  };

  find: MongoFind = async (query, options) => {
    return await this.dispatchAction(async () => await Connection.$mongoConnection[this.$name].find(query, options), query);
  };

  count: MongoCount = async (query) => {
    return await this.dispatchAction(async () => await Connection.$mongoConnection[this.$name].countDocuments(query), query);
  };

  findOneAndUpdate: MongoFindOneAndUpdate = async (query, update, upsert = false, useModifier = '$set') => {
    const result = await this.dispatchAction(
      async () =>
        await Connection.$mongoConnection[this.$name].findOneAndUpdate(
          query,
          { [useModifier]: this.processDocument(update, true) },
          { upsert: upsert, returnDocument: 'after' }
        ),
      query
    );
    if (result && result.ok) return result.value;
    else return null;
  };

  updateOne: MongoUpdateOne = async (query, update, upsert = false, useModifier = '$set') => {
    const result = await this.dispatchAction(
      async () =>
        await Connection.$mongoConnection[this.$name].updateOne(
          query,
          { [useModifier]: this.processDocument(update, true) },
          // @ts-expect-error - Legacy option using @rakered
          { upsert: upsert, returnDocument: 'after' }
        ),
      query
    );
    if (result && result.ok) return result.value;
    else return null;
  };

  updateMany: MongoUpdateMany = async (query, document, useModifier = '$set') => {
    const result = await this.dispatchAction(
      async () => await Connection.$mongoConnection[this.$name].updateMany(query, { [useModifier]: this.processDocument(document, true) }),
      query
    );
    if (result) return true;
    else return null;
  };

  deleteMany: MongoDelete = async (query) => {
    const result = await this.dispatchAction(async () => await Connection.$mongoConnection[this.$name].deleteMany(query));
    return result ? true : null;
  };

  deleteOne: MongoDelete = async (query) => {
    const result = await this.dispatchAction(async () => await Connection.$mongoConnection[this.$name].deleteOne(query));
    return result ? true : null;
  };

  insertOne: MongoInsertOne = async (document) => {
    const result = await this.dispatchAction(async () => await Connection.$mongoConnection[this.$name].insertOne(this.processDocument(document)));
    return result && result.insertedCount >= 1 ? result.ops[0] : null;
  };

  insertMany: MongoInsertMany = async (documents) => {
    const result = await this.dispatchAction(
      async () => await Connection.$mongoConnection[this.$name].insertMany(documents.map((doc) => this.processDocument(doc)))
    );
    return result && result.insertedCount >= 1 ? result.ops[0] : null;
  };

  findOneOrCreate: MongoFindOneOrCreate = async (query, document) => {
    const findOne = await this.dispatchAction(async () => await Connection.$mongoConnection[this.$name].findOne(query), query);
    if (findOne) return findOne;
    else {
      const insert = await Connection.$mongoConnection[this.$name].insertOne(this.processDocument(document));
      // @ts-expect-error - Legacy option using @rakered
      if (insert && insert.insertedCount >= 1) return insert.ops[0];
      else return null;
    }
  };
}

export default Model;
