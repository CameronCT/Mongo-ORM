/**
 * Represents a MongoDB connection and manages models associated with the connection.
 *
 * @class
 * @name Connection
 */
import { Db, MongoClient } from 'mongodb';
import Model from './Model';
import Message from './Message';
import fs from 'fs';
import path from 'path';
import { DefaultValue } from './types';

class Connection {
  /**
   * The MongoDB connection instance.
   *
   * @static
   * @member {Db}
   */
  static $mongoConnection: Db;

  /**
   * An array containing instances of the Model class associated with the connection.
   *
   * @static
   * @member {Model[]}
   */
  static $models: Model[] = [];

  /**
   * Creates an instance of the Connection class and establishes a connection to the MongoDB database.
   *
   * @constructor
   * @param {string} [uri] - The URI of the MongoDB database. Defaults to 'mongodb://127.0.0.1:27017/newapp'.
   * @param {string} [modelPath] - The path to the folder containing model files. Defaults to './src/models'.
   * @throws {Error} If unable to connect to MongoDB or encounter errors while initializing models.
   */
  constructor(uri?: string, modelPath?: string, onConnect?: (models: number) => void) {
    const useModelPath = modelPath || path.join(process.cwd(), './src/models');
    const client = new MongoClient(!uri ? 'mongodb://127.0.0.1:27017/newapp' : uri);
    client.connect().then(() => {
      Connection.$mongoConnection = client.db();

      if (Connection.$mongoConnection) {
        // Get all Models in Models Folder and Initialize Class
        try {
          const getModelsFromFolder = fs.readdirSync(useModelPath);
          getModelsFromFolder.forEach((model) => {
            const modelPath = path.join(useModelPath, model);
            const ModelClass = require(modelPath).default;
            if (typeof ModelClass.generateIndexes !== 'undefined') ModelClass.generateIndexes();
            Connection.$models.push(ModelClass);
          });
        } catch (e) {
          Message(String(e).toString(), true);
        }
        if (typeof onConnect !== 'undefined')  
          onConnect(Connection.$models.length);
        else 
          Message(`Connection Initialized (${Connection.$models.length} models)!`);
        
        return Connection.$mongoConnection;
      } else Message('Unable to connect to MongoDB!', true);
    });
  }

  /**
   * Static method to sanitize an object by removing properties with keys starting with '$'.
   *
   * @static
   * @method
   * @memberof Connection
   * @param {DefaultValue} v - The value to sanitize.
   * @returns {DefaultValue} The sanitized value.
   *
   * @example
   * // Usage:
   * const sanitizedValue = Connection.sanitize({ $key: 'value', nested: { $property: 'nestedValue' } });
   */
  public static sanitize(v: DefaultValue) {
    if (v instanceof Object) {
      for (const key in v) {
        if (/^\$/.test(key)) {
          delete v[key];
        } else {
          Connection.sanitize(v[key]);
        }
      }
    }
    return v;
  }
}

export default Connection;
