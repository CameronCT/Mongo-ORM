# MongoORM

An insanely basic implementation of some form of Object Relational Mapping for MongoDB. This was not really made to be used as a widely available package, it does not contain severely insane levels of logging. 

## Getting Started

To get started you must install the package via your dependency manager (you can use yarn as well)

`npm install mongo-orm`

### Initiating the Connection

```js
import MongoORM from "mongo-orm";

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
import MongoORM from "mongo-orm";

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

await User.findOne({ email: "@example.com" });
await User.findOneOrCreate({ email: "@example.com" }, { name: "test", email: "@example.com" });
await User.findOneAndUpdate({ email: "@example.com" }, { name: "test", email: "new@example.com" }, "$set");
await User.insertOne({ name: "test", email: "@example.com" });
await User.updateOne({ email: "@example.com" }, { name: "test", email: "new@example.com" }, "$set");
await User.removeOne({ email: "@example.com" });
```

## Tests

Current list of tests I want to do in the future.
- Mongoose
- Sequelize
- Native