import { Db } from '@rakered/mongo';

declare class Model {
    private $name;
    private $fieldOptions;
    private $indexOptions;
    private $otherOptions;
    constructor(collectionName: string, fieldOptions?: FieldOptions[], indexOptions?: IndexOptions[], otherOptions?: OtherOptions);
    private generateIndexes;
    private dispatchAction;
    private processDefault;
    private processDocument;
    aggregate(query: any, options?: any): Promise<null | any>;
    findOne(query: any, options?: any): Promise<null | any>;
    find(query: any, options?: any): Promise<null | any[]>;
    count(query: any): Promise<null | any>;
    findOneAndUpdate(query: any, update: any, upsert?: boolean, useModifier?: string): Promise<null | any[] | any>;
    updateOne(query: any, update: any, upsert?: boolean, useModifier?: string): Promise<null | any>;
    updateMany(query: any, document: any, useModifier?: string): Promise<null | any>;
    deleteMany(query: any): Promise<null | any>;
    deleteOne(query: any): Promise<null | any>;
    insertOne(document: any): Promise<null | any>;
    insertMany(document: any): Promise<null | any>;
    findOneOrCreate(query: any, document?: any | null): Promise<null | any>;
}

declare class Connection {
    static $mongoConnection: Db;
    static $models: Model[];
    constructor(uri?: string, modelPath?: string);
    static sanitize(v: any): any;
}

declare const _default: {
    String: string;
    Number: string;
    Boolean: string;
    Date: string;
    Array: string;
    Object: string;
    ObjectId: string;
};

interface MongoORMInterface { 
    Connection: typeof Connection,
    Model: typeof Model,
    FieldTypes: typeof _default
}

interface FieldOptions {
    name: string;
    type: string;
    default?: any;
    required?: boolean;
}

interface IndexOptions {
    name: string; 
    fields: { [key: string]: "text" | number };
    unique?: boolean;
}

interface OtherOptions {
    log: number;
    debug?: boolean;
}

declare const exportData: MongoORMInterface;

export { exportData as default };
