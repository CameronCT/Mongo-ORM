import { Db } from "@rakered/mongo";
import Connection from "./Connection";
import Message from "./Message";
import { FieldOptions, IndexOptions, OtherOptions } from "./types";

class Model {
    private $name: string = '';
    private $fieldOptions: FieldOptions[] = [];
    private $indexOptions: IndexOptions[] = [];
    private $otherOptions: OtherOptions = {
        debug: false,
        log: -1
    }

    constructor(name: string, fieldOptions: FieldOptions[], indexOptions: IndexOptions[], otherOptions?: OtherOptions) {
        this.$name = String(name).toLowerCase();
        this.$fieldOptions = fieldOptions;
        this.$indexOptions = indexOptions;
        this.$otherOptions = { 
            debug: otherOptions?.debug || false,
            log: otherOptions?.log || -1
        };
    }

    private async generateIndexes() {
        this.$indexOptions.forEach(async (index) => {
            const params: { [key: string]: string | boolean } = {};
            if (index.unique) params.unique = true;
            if (index.name) params.name = index.name;
            await Connection.$mongoConnection[this.$name].createIndex(index.fields, { ...params });
        });
        Message(`Generated indexes for ${this.$name} (${this.$indexOptions.length} total).`)
    }

    private async dispatchAction(action: any, query: any = {}) {
        if (this.$otherOptions.debug) {
            const start = new Date().getTime();
            const result = await action;
            const end = new Date().getTime();
            const total = end - start;

            if (this.$otherOptions.log !== -1 && total > this.$otherOptions.log) {
                Connection.$mongoConnection['_mongoOrmDebug'].insertOne({
                    model: this.$name,
                    query: JSON.stringify(query, null, 2),
                    time: total,
                    date: new Date()
                })
            }
            Message(`Operation took ${total}ms.`);

            return result;
        } else 
            return await action();
    }

    async aggregate(query: any, options: any = {}): Promise<null | any> {
        return await this.dispatchAction(await Connection.$mongoConnection[this.$name].aggregate(query, options), query)
    }

    async findOne(query: any, options: any = {}): Promise<null | any> {
        return await this.dispatchAction(await Connection.$mongoConnection[this.$name].findOne(query, options), query)
    }

    async find(query: any, options: any = {}): Promise<null | any[]> {
        return await this.dispatchAction(await Connection.$mongoConnection[this.$name].find(query, options), query)
    }

    async count(query: any): Promise<null | any> {
        return await this.dispatchAction(await Connection.$mongoConnection[this.$name].countDocuments(query), query)
    }

    async findOneAndUpdate(query: any, update: any, upsert: boolean = false, useModifier: string = '$set'): Promise<null | any[] | any> {
        const result = await this.dispatchAction(await Connection.$mongoConnection[this.$name].findOneAndUpdate(query, { [useModifier]: update }, { upsert: upsert, returnDocument: 'after' }), query)
        if (result && result.ok) return result.value
        else return null
    }

    async updateMany(query: any, document: any): Promise<null | any> {
        const result = await this.dispatchAction(await Connection.$mongoConnection[this.$name].updateMany(query, { $set: document }), query)
        if (result) return true
        else return null
    }

    async deleteMany(query: any): Promise<null | any> {
        const result = await this.dispatchAction(await Connection.$mongoConnection[this.$name].deleteMany(query))
        if (result) return true
        else return null
    }

    async deleteOne(query: any): Promise<null | any> {
        const result = await this.dispatchAction(await Connection.$mongoConnection[this.$name].deleteOne(query))
        if (result) return true
        else return null
    }

    async insertOne(document: any): Promise<null | any> {
        const result = await this.dispatchAction(await Connection.$mongoConnection[this.$name].insertOne(document))
        if (result && result.insertedCount >= 1) return result.ops[0]
        else return null
    }

     async insertMany(document: any): Promise<null | any> {
        const result = await this.dispatchAction(await Connection.$mongoConnection[this.$name].insertMany(document))
        if (result && result.insertedCount >= 1) return result.ops[0]
        else return null
    }

    /*
    * Custom Methods
    */
     async findOneOrCreate(query: any, document: any | null = null): Promise<null | any> {
        const findOne = await this.dispatchAction(await Connection.$mongoConnection[this.$name].findOne(query), query)
        if (findOne) return findOne
        else {
            const insert = await Connection.$mongoConnection[this.$name].insertOne(document)
            if (insert && insert.insertedCount >= 1) return insert.ops[0]
            else return null
        }
    }
}

export default Model;