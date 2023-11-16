import Connection from "./Connection";
import Message from "./Message";
import { FieldOptions, IndexOptions, OtherOptions } from "./types";
import FieldTypes from "./FieldTypes";

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

        this.$fieldOptions.forEach((field) => this.processDefault(field));
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
            return result;
        } else 
            return await action();
    }

    private processDefault = (field: FieldOptions) => {
        if (typeof field.default === 'undefined') return;

        if (field.type === FieldTypes.String && typeof field.default !== 'string') throw new Error(`Field is of type string but the default value is not a string.`);
        else if (field.type === FieldTypes.Number && typeof field.default !== 'number') throw new Error(`Field is of type number but the default value is not a number.`);
        else if (field.type === FieldTypes.Boolean && typeof field.default !== 'boolean') throw new Error(`Field is of type boolean but the default value is not a boolean.`);
        else if (field.type === FieldTypes.Date && !(field.default instanceof Date)) throw new Error(`Field is of type date but the default value is not a date.`);
        else if (field.type === FieldTypes.Array && !Array.isArray(field.default)) throw new Error(`Field is of type array but the default value is not an array.`);
        else if (field.type === FieldTypes.Object && typeof field.default !== 'object') throw new Error(`Field is of type object but the default value is not an object.`);
        else if (field.type === FieldTypes.ObjectId && typeof field.default !== 'string') throw new Error(`Field is of type objectId but the default value is not a string.`);
    }   

    private processDocument = (document: any, isUpdate: boolean = false) => {
        const processedDocument: any = {};
        const fieldLength = this.$fieldOptions.length;

        for (let i = 0; i < fieldLength; i++) {
            const field = this.$fieldOptions[i];
            if (document[field.name]) {
                if (field.type === FieldTypes.Date) processedDocument[field.name] = new Date(document[field.name]);
                else if (field.type === FieldTypes.Number) processedDocument[field.name] = Number(document[field.name]);
                else if (field.type === FieldTypes.Boolean) processedDocument[field.name] = Boolean(document[field.name]);
                else if (field.type === FieldTypes.ObjectId) processedDocument[field.name] = String(document[field.name]);
                else if (field.type === FieldTypes.Array && !Array.isArray(document[field.name])) processedDocument[field.name] = Array(document[field.name]);
                else if (field.type === FieldTypes.Object) processedDocument[field.name] = Object(document[field.name]);
                else processedDocument[field.name] = document[field.name];
            } else if (field.default) {
                if (field.type === FieldTypes.Date) processedDocument[field.name] = new Date(field.default);
                else if (field.type === FieldTypes.Number) processedDocument[field.name] = Number(field.default);
                else if (field.type === FieldTypes.Boolean) processedDocument[field.name] = Boolean(field.default);
                else if (field.type === FieldTypes.ObjectId) processedDocument[field.name] = String(field.default);
                else if (field.type === FieldTypes.Array && !Array.isArray(field.default)) processedDocument[field.name] = Array(field.default);
                else if (field.type === FieldTypes.Object) processedDocument[field.name] = Object(field.default);
                else processedDocument[field.name] = field.default;
            } else if (!isUpdate && field.required) 
                throw new Error(`Field ${field.name} is required but was not provided a value and does not have a default value to back up off.`);
        };

        processedDocument[isUpdate ? 'updatedAt' : 'createdAt'] = Math.ceil(new Date().getTime() / 1000);

        return processedDocument;
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
        const result = await this.dispatchAction(await Connection.$mongoConnection[this.$name].findOneAndUpdate(query, { [useModifier]: this.processDocument(update, true) }, { upsert: upsert, returnDocument: 'after' }), query)
        if (result && result.ok) return result.value
        else return null
    }

    async updateOne(query: any, update: any, upsert: boolean = false, useModifier: string = '$set'): Promise<null | any> {
        const result = await this.dispatchAction(await Connection.$mongoConnection[this.$name].updateOne(query, { [useModifier]: this.processDocument(update, true) }, { upsert: upsert, returnDocument: 'after' }), query)
        if (result && result.ok) return result.value
        else return null
    };

    async updateMany(query: any, document: any, useModifier: string = '$set'): Promise<null | any> {
        const result = await this.dispatchAction(await Connection.$mongoConnection[this.$name].updateMany(query, { [useModifier]: this.processDocument(document, true) }), query)
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
        const result = await this.dispatchAction(await Connection.$mongoConnection[this.$name].insertOne(this.processDocument(document)))
        if (result && result.insertedCount >= 1) return result.ops[0]
        else return null
    }

     async insertMany(document: any): Promise<null | any> {
        const result = await this.dispatchAction(await Connection.$mongoConnection[this.$name].insertMany(this.processDocument(document)))
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
            const insert = await Connection.$mongoConnection[this.$name].insertOne(this.processDocument(document))
            if (insert && insert.insertedCount >= 1) return insert.ops[0]
            else return null
        }
    }
}

export default Model;