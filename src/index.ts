/**
 * A module exporting MongoDB-related classes and types for an ORM implementation.
 *
 * @typedef {Object} MongoORMInterface
 * @property {Connection} Connection - The class representing a MongoDB connection.
 * @property {Model} Model - The class representing a MongoDB model with CRUD operations.
 * @property {Object} FieldTypes - An object defining mapping between field types and MongoDB data types.
 *
 * @namespace
 * @name MongoORM
 */
import Connection from './Connection';
import Model from './Model';
import FieldTypes from './FieldTypes';
import { MongoORMInterface } from './types';

/**
 * A module exporting MongoDB-related classes and types for an ORM implementation.
 *
 * @type {MongoORMInterface}
 */
const exportData: MongoORMInterface = {
  Connection,
  Model,
  FieldTypes
};

export default exportData;
