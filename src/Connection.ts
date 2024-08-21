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
   * The URI of the MongoDB database.
   *
   * @member {string}
   * @private
   */
  private uri: string;

  /**
   * The path to the folder containing model files.
   *
   * @member {string}
   * @private
   */
  private modelPath: string;

  private constructor(uri: string, modelPath?: string) {
    this.uri = uri;
    this.modelPath = modelPath;
  }

  /**
   * Static method to establish a connection to the MongoDB database.
   *
   * @param {string} [uri] - The URI of the MongoDB database.
   * @param {string} [modelPath] - The path to the folder containing model files.
   * @param {Function} [onConnect] - Callback function to be called after connection.
   * @returns {Promise<Connection>} - A promise that resolves to an instance of the Connection class.
   */
  static async create(
    uri: string = 'mongodb://127.0.0.1:27017/newapp',
    modelPath: string = Connection.checkAndReturnModelPath(),
    onConnect?: (models: number) => void
  ): Promise<Connection> {
    const connection = new Connection(uri, modelPath);
    await connection.initialize(uri, onConnect);
    return connection;
  }

  private async initialize(uri: string, onConnect?: (models: number) => void): Promise<void> {
    const client = new MongoClient(uri || 'mongodb://127.0.0.1:27017/newapp');

    try {
      await client.connect();
      Connection.$mongoConnection = client.db();

      if (Connection.$mongoConnection) {
        const getModelsFromFolder = fs.readdirSync(this.modelPath);
        if (typeof onConnect !== 'undefined') {
          onConnect(getModelsFromFolder?.length);
        } else {
          Message(`Connection Initialized (${getModelsFromFolder?.length} models)!`);
        }
      } else {
        Message('Unable to connect to MongoDB!', true);
      }
    } catch (e) {
      Message(`Error: ${e.message}`, true);
    }
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

  /**
   * Static method to find and return the proper path to the models folder.
   *
   * @static
   * @method
   * @memberof Connection
   * @returns {string} The path to the models folder.
   *
   * @example
   * // Usage:
   * const modelPath = Connection.checkAndReturnModelPath();
   **/
  private static checkAndReturnModelPath() {
    const paths = [path.join(process.cwd(), './src/models'), path.join(process.cwd(), './dist/models'), path.join(process.cwd(), './models')];

    let modelPath = '';
    paths.forEach((p) => {
      if (fs.existsSync(p)) {
        modelPath = p;
      }
    });

    return modelPath;
  }
}

export default Connection;
