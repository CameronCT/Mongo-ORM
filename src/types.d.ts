import { BSON, Filter, FindOptions, AggregateOptions } from 'mongodb';
import Connection from './Connection';
import QueryBuilder from './QueryBuilder';
import Model from './Model';
import FieldTypes from './FieldTypes';

export type DefaultValue = string | number | boolean | Date | object | array | null;
export type MongoQuery = Filter<BSON.Document>;
export type MongoDocument = BSON.Document;
export type MongoFindOne = (filter: Filter<BSON.Document>, options?: FindOptions) => Promise<T | null>;
export type MongoFind = (filter: Filter<BSON.Document>, options?: FindOptions) => Promise<T[]>;
export type MongoInsertOne = (doc: T) => Promise<T>;
export type MongoInsertMany = (docs: T[]) => Promise<T>;
export type MongoUpdateOne = (filter: Filter<BSON.Document>, doc: T, upsert?: boolean, useModifier?: string) => Promise<T | null>;
export type MongoUpdateMany = (filter: Filter<BSON.Document>, doc: T, useModifier?: string) => Promise<boolean>;
export type MongoDelete = (filter: Filter<BSON.Document>) => Promise<boolean>;
export type MongoCount = (filter: Filter<BSON.Document>) => Promise<number>;
export type MongoAggregate = (pipeline: BSON.Document[], options?: AggregateOptions) => Promise<T[]>;
export type MongoFindOneAndUpdate = (filter: Filter<BSON.Document>, doc: T, upsert?: boolean, useModifier?: string) => Promise<T | null>;
export type MongoFindOneOrCreate = (filter: Filter<BSON.Document>, doc: T) => Promise<T>;

export type MongoFindOneWithCollection = (collection: string, filter: Filter<BSON.Document>, options?: FindOptions) => Promise<T | null>;
export type MongoFindWithCollection = (collection: string, filter: Filter<BSON.Document>, options?: FindOptions<BSON.Document>) => Promise<T>;
export type MongoInsertOneWithCollection = (collection: string, doc: T) => Promise<T>;
export type MongoInsertManyWithCollection = (collection: string, docs: T[]) => Promise<boolean>;
export type MongoUpdateOneWithCollection = (
  collection: string,
  filter: Filter<BSON.Document>,
  doc: T,
  upsert?: boolean,
  useModifier?: string
) => Promise<T | null>;
export type MongoUpdateManyWithCollection = (collection: string, filter: Filter<BSON.Document>, doc: T, useModifier?: string) => Promise<boolean>;
export type MongoDeleteWithCollection = (collection: string, filter: Filter<BSON.Document>) => Promise<boolean>;
export type MongoCountWithCollection = (collection: string, filter: Filter<BSON.Document>) => Promise<number>;
export type MongoAggregateWithCollection = (collection: string, pipeline: BSON.Document[], options?: AggregateOptions) => Promise<BSON.Document[]>;
export type MongoFindOneAndUpdateWithCollection = (
  collection: string,
  filter: Filter<BSON.Document>,
  doc: T,
  upsert?: boolean,
  useModifier?: string
) => Promise<T | null>;
export type MongoFindOneOrCreateWithCollection = (collection: string, filter: Filter<BSON.Document>, doc: T) => Promise<T>;
export type MongoCreateIndex = (collection: string, index: BSON.Document, options?: BSON.Document) => Promise<string>;
export type MongoDispatchAction = (fn: () => Promise<any>, query?: MongoQuery) => Promise<any>;

export interface MongoODMInterface {
  Connection: typeof Connection;
  QueryBuilder: typeof QueryBuilder;
  Model: typeof Model;
  FieldTypes: FieldTypes;
  connect: typeof Connection.create;
}

export interface FieldOptions {
  name: string;
  type: string;
  default?: DefaultValue;
  required?: boolean;
}

export interface IndexOptions {
  name: string;
  fields: { [key: string]: 'text' | number };
  unique?: boolean;
}

export interface OtherOptions {
  log: number;
  debug?: boolean;
}
