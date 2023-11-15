import { Db } from "@rakered/mongo";
import Connection from "./Connection";
import { FieldOptions, IndexOptions } from "./types";

class Model {
    private $name: string = '';
    private $fieldOptions: FieldOptions[] = [];
    private $indexOptions: IndexOptions[] = [];

    constructor(name: string, fieldOptions: FieldOptions[], indexOptions: IndexOptions[]) {
        this.$name = String(name).toLowerCase();
        this.$fieldOptions = fieldOptions;
        this.$indexOptions = indexOptions;
    }

    private async generateIndexes() {
        this.$indexOptions.forEach(async (index) => {
            const params: { [key: string]: string | boolean } = {};
            if (index.unique) params.unique = true;
            if (index.name) params.name = index.name;
            await Connection.$mongoConnection[this.$name].createIndex(index.fields, { ...params });
        });
        console.log(`[Mongo-ORM] Generated indexes for ${this.$name}.`);
    }

    async aggregate(filter: any, options: any = {}): Promise<null | any> {
        return await Connection.$mongoConnection[this.$name].aggregate(filter, options)
    }

    async findOne(filter: any, options: any = {}): Promise<null | any> {
        return await Connection.$mongoConnection[this.$name].findOne(filter, options)
    }

    async find(query: any, options: any = {}): Promise<null | any[]> {
        return await Connection.$mongoConnection[this.$name].find(query, options)
    }

    async count(query: any): Promise<null | any> {
        return await Connection.$mongoConnection[this.$name].countDocuments(query)
    }

    async findOneAndUpdate(filter: any, update: any, upsert: boolean = false, useModifier: string = '$set'): Promise<null | any[] | any> {
        const result = await Connection.$mongoConnection[this.$name].findOneAndUpdate(filter, { [useModifier]: update }, { upsert: upsert, returnDocument: 'after' })
        if (result && result.ok) return result.value
        else return null
    }

    async updateMany(filter: any, document: any): Promise<null | any> {
        const result = await Connection.$mongoConnection[this.$name].updateMany(filter, { $set: document })
        if (result) return true
        else return null
    }

    async deleteMany(filter: any): Promise<null | any> {
        const result = await Connection.$mongoConnection[this.$name].deleteMany(filter)
        if (result) return true
        else return null
    }

    async deleteOne(filter: any): Promise<null | any> {
        const result = await Connection.$mongoConnection[this.$name].deleteOne(filter)
        if (result) return true
        else return null
    }

    async insertOne(document: any): Promise<null | any> {
        const result = await Connection.$mongoConnection[this.$name].insertOne(document)
        if (result && result.insertedCount >= 1) return result.ops[0]
        else return null
    }

     async insertMany(document: any): Promise<null | any> {
        const result = await Connection.$mongoConnection[this.$name].insertMany(document)
        if (result && result.insertedCount >= 1) return result.ops[0]
        else return null
    }

    /*
    * Custom Methods
    */
     async findOneOrCreate(filter: any, document: any | null = null): Promise<null | any> {
        const findOne = await Connection.$mongoConnection[this.$name].findOne(filter)
        if (findOne) return findOne
        else {
            const insert = await Connection.$mongoConnection[this.$name].insertOne(document)
            if (insert && insert.insertedCount >= 1) return insert.ops[0]
            else return null
        }
    }
}

export default Model;