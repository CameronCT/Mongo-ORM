/**
 * A module exporting MongoDB-related classes and types for an ORM implementation.
 *
 * @typedef {Object} MongoODMInterface
 * @property {Connection} Connection - The class representing a MongoDB connection.
 * @property {Model} Model - The class representing a MongoDB model with CRUD operations.
 * @property {QueryBuilder} QueryBuilder - The class representing a MongoDB query builder.
 * @property {Object} FieldTypes - An object defining mapping between field types and MongoDB data types.
 * @property {Function} connect - A function to establish a connection to the MongoDB database.
 *
 * @namespace
 * @name MongoODM
 */
import Connection from './Connection';
import QueryBuilder from './QueryBuilder';
import Model from './Model';
import FieldTypes from './FieldTypes';
import { MongoODMInterface } from './types';

/**
 * A module exporting MongoDB-related classes and types for an ORM implementation.
 *
 * @type {MongoODMInterface}
 */
const exportData: MongoODMInterface = {
  Connection,
  QueryBuilder,
  Model,
  FieldTypes,
  connect: Connection.create
};

export default exportData;
