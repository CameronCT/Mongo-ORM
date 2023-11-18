# @cameronct/mongo-orm
![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

An insanely basic implementation of some form of Object Document Mapping (not ORM) for MongoDB. This was not really made to be used as a widely available package, it does not contain severely insane levels of logging. 

## Getting Started

To get started you must install the package via your dependency manager (you can use yarn as well)

`npm install @cameronct/mongo-orm`

### Initiating the Connection

```js
import MongoORM from "@cameronct/mongo-orm";

// Basic
new MongoORM.Connection();

// With Connection URI
new MongoORM.Connection("mongodb://localhost:27017/my-app");

// With Custom Models Folder
new MongoORM.Connection("mongodb://localhost:27017/my-app", path.join(__dirname, "path/to/models"));
```

### Creating a Model

Here is an example Model that can be found in `/models/User.js`
```js
import MongoORM from "@cameronct/mongo-orm";

const User = new MongoORM.Model("users", [
    { name: "name", type: MongoORM.FieldTypes.String, required: true },
    { name: "email", type: MongoORM.FieldTypes.String, required: true },
    { name: "password", type: MongoORM.FieldTypes.String, required: true },
    { name: "type", type: MongoORM.FieldTypes.String, default: "basic" },
], [ 
    { name: "uniqueEmail", fields: { email: "text" } },
])
```

### Using a Model

Some examples, most native functionality from MongoDB will work here.
```js
import User from "./models/User";

await User.count({ email: "@example.com" });
await User.findOne({ email: "@example.com" });
await User.findOneOrCreate({ email: "@example.com" }, { name: "test", email: "@example.com" });
await User.findOneAndUpdate({ email: "@example.com" }, { name: "test", email: "new@example.com" }, "$set");
await User.insertOne({ name: "test", email: "@example.com" });
await User.updateOne({ email: "@example.com" }, { name: "test", email: "new@example.com" }, "$set");
await User.removeOne({ email: "@example.com" });
```

### Documents
When a document is inserted into the collection, we specifically add `createdAt` field for new documents using `insertOne`, `insertMany` and `findOneOrCreate`. 
We also add an `updatedAt` field for new documents using `updateOne`, `updateMany` and `findOneAndUpdate`

These parameters **cannot** be overridden inside of the Model. I may change this functionality later, but for now it is what it is.

## Tests

Current list of tests I want to do in the future.
- Mongoose
- Sequelize
- Native
