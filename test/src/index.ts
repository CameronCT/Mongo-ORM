import express from 'express';
import MongoORM from '@cameronct/mongo-orm';
import User from './models/User';

const app = express();
const port = 5000;

new MongoORM.Connection();

app.get('/test-db', async (req, res) => {
  const getTimestamp = Math.round(new Date().getTime() / 1000);
  const getRandom = Math.round(Math.random() * 9999 + 1);
  const useEmail = `t2${getTimestamp}.${getRandom}@example.com`;
  console.log(`Attempting creation with email ${useEmail}`);

  const createUser = await User.findOneOrCreate({ email: useEmail }, { name: 'Test User', email: useEmail, password: 'test123' }).catch((e: string) =>
    console.log(e)
  );
  const countUsers = await User.count({ email: { $regex: '@example.com', $options: 'i' } }).catch((e: string) => console.log(e));
  res.send(
    `Hello, welcome to the Express TypeScript app! We have generated ${countUsers} users in the database! Most recent one has email ${createUser?.email}!`
  );
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
