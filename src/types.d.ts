import Connection from './Connection';
import Model from './Model';
import FieldTypes from './FieldTypes';

export interface MongoORMInterface {
  Connection: typeof Connection;
  Model: typeof Model;
  FieldTypes: typeof FieldTypes;
}

export interface FieldOptions {
  name: string;
  type: string;
  default?: any;
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
