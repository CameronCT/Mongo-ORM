import { create as MongoCreate, Db } from '@rakered/mongo'
import Model from './Model'
import fs from 'fs'
import path from 'path';

class Connection {
    static $mongoConnection: Db
    static $models: Model[] = [];

    constructor(uri: string | null, modelFolder: string = '') {
        const useModelPath = modelFolder || path.join(process.cwd(), './src/models');
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
                console.log(e);
                throw Error(`Unable to load models folder!`);
            }
            console.log('Connected to DB');
            return Connection.$mongoConnection
        } else
            throw Error('Unable to connect to MongoDB from MongoSQL!')
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