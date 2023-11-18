import MongoODM from "@cameronct/mongo-odm";
import { MongoClient } from "mongodb";
import mongoose from "mongoose";

const uri = 'mongodb://127.0.0.1:27017/performance_test';
new MongoODM.Connection(uri);

function generateTestData() {
    const documents = Array.from({ length: 500 }, (_, index) => ({
        name: `Student ${index}`,
        age: Math.floor(Math.random() * 100),
        courses: ["Math", "English", "Science"],
    }));

    return documents;
}

async function runMongoDBNativeTest() {
  const client = new MongoClient(uri, { });

  try {
    await client.connect();
    const database = client.db();
    const collection = database.collection('mongo-native');

    // Start measuring time
    const startTime = new Date().getTime();

    // Perform your MongoDB operations
    const documents = generateTestData();
    await collection.insertMany(documents);

    // Stop measuring time
    const endTime = new Date().getTime();
    const elapsedTime = endTime - startTime;

    console.log(`MongoDB Native Test completed in ${elapsedTime} milliseconds`);
  } finally {
    await client.close();
  }
}

async function runMongooseTest() {
  // Connect to MongoDB using Mongoose
  await mongoose.connect(uri, { });

  // Schemas
  // Define a Mongoose schema
  const MongooseSchema = new mongoose.Schema({
    name: String,
    age: Number,
    city: String,
    isStudent: Boolean,
  });

  // Create a Mongoose model
  const MongooseModel = mongoose.model('mongoose', MongooseSchema);

  // Start measuring time
  const startTime = new Date().getTime();

  // Perform your Mongoose operations
  const documents = generateTestData();
  await MongooseModel.insertMany(documents);

  // Stop measuring time
  const endTime = new Date().getTime();
  const elapsedTime = endTime - startTime;

  console.log(`Mongoose Test completed in ${elapsedTime} milliseconds`);

  // Disconnect from MongoDB
  await mongoose.disconnect();
}

async function runMeTest() {
  new MongoODM.Connection(uri); // Create a new instance of MongoODM.Connection

  // Model
  const MongoModel = new MongoODM.Model('mongoodm', [
    { name: 'name', type: MongoODM.FieldTypes.String },
    { name: 'age', type: MongoODM.FieldTypes.String },
    { name: 'city', type: MongoODM.FieldTypes.String },
    { name: 'isStudent', type: MongoODM.FieldTypes.Boolean },
  ])

  // Start measuring time
  const startTime = new Date().getTime();

  // Perform your MongoODM operations
  const documents = generateTestData();
  await MongoModel.insertMany(documents);

  // Stop measuring time
  const endTime = new Date().getTime();
  const elapsedTime = endTime - startTime;

  console.log(`MongoODM Test completed in ${elapsedTime} milliseconds`);

}

async function main() {
  await runMongoDBNativeTest();
  await runMongooseTest();
  await runMeTest();
}

main();