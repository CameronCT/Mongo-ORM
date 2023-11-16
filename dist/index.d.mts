import { Db, Filter, BSON, FindOptions, AggregateOptions } from 'mongodb';

declare class Model {
    private $name;
    private $fieldOptions;
    private $indexOptions;
    private $otherOptions;
    constructor(collectionName: string, fieldOptions?: FieldOptions[], indexOptions?: IndexOptions[], otherOptions?: OtherOptions);
    private generateIndexes;
    private dispatchAction;
    private processDefault;
    private processDocument;
    aggregate: MongoAggregate;
    findOne: MongoFindOne;
    find: MongoFind;
    count: MongoCount;
    findOneAndUpdate: MongoFindOneAndUpdate;
    updateOne: MongoUpdateOne;
    updateMany: MongoUpdateMany;
    deleteMany: MongoDelete;
    deleteOne: MongoDelete;
    insertOne: MongoInsertOne;
    insertMany: MongoInsertMany;
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
