import { create as MongoCreate, Db } from '@rakered/mongo'
import Model from './Model'
import Message from './Message'
import fs from 'fs'
import path from 'path';

class Connection {
    static $mongoConnection: Db
    static $models: Model[] = [];

    constructor(uri?: string, modelPath?: string) {
        const useModelPath = modelPath || path.join(process.cwd(), './src/models');
        Connection.$mongoConnection = MongoCreate(!uri ? 'mongodb://127.0.0.1:27017/newapp' : uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        if (Connection.$mongoConnection) {
            // Get all Models in Models Folder and Initialize Class
            try {
                const getModelsFromFolder = fs.readdirSync(useModelPath);
                getModelsFromFolder.forEach((model) => {
                    const modelPath = path.join(useModelPath, model);
                    const ModelClass = require(modelPath).default;
                    ModelClass.generateIndexes();
                    Connection.$models.push(ModelClass);
                })
            } catch (e) {
                Message(String(e).toString(), true);
            }
            Message(`Connection Initialized (${Connection.$models.length} models)!`);
            return Connection.$mongoConnection
        } else
            Message("Unable to connect to MongoDB!", true);
    }

    public static sanitize(v: any) {
        if (v instanceof Object) {
            for (const key in v) {
                if (/^\$/.test(key)) {
                    delete v[key]
                } else {
                    Connection.sanitize(v[key])
                }
            }
        }
        return v
    }
}

export default Connection