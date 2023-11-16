import express from 'express';
import MongoORM from '@cameronct/mongo-orm';
import User from './models/User';

const app = express();
const port = 3000;

new MongoORM.Connection();

app.get('/test-db', async (req, res) => {
  
  const getTimestamp = Math.round(new Date().getTime() / 1000);
  const getRandom = Math.round(Math.random() * 9999 + 1);
  const useEmail = `t2${getTimestamp}.${getRandom}@example.com`;
  console.log(`Attempting creation with email ${useEmail}`)
  
  const createUser = await User.insertOne({ name: "Test User", email: useEmail, password: "test123" });
  const countUsers = await User.count({ email: { $regex: "@example.com", $options: "i" } });
  res.send(`Hello, welcome to the Express TypeScript app! We have generated ${countUsers} users in the database! Most recent one has email ${createUser.email}!`);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});