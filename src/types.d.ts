import { BSON, Filter, FindOptions, AggregateOptions } from 'mongodb';
import Connection from './Connection';
import Model from './Model';
import FieldTypes from './FieldTypes';

export type DefaultValue = string | number | boolean | Date | object | array | null;
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
export type MongoQuery = Filter<BSON.Document>;
export type MongoDocument = BSON.Document;

export interface MongoODMInterface {
  Connection: typeof Connection;
  Model: typeof Model;
  FieldTypes: typeof FieldTypes;
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
