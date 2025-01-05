import express from 'express';
import MongoODM from '@cameronct/mongo-odm';
import User from './models/User';

const app = express();
const port = 5000;

MongoODM.connect("mongodb://127.0.0.1:27017/mongoodm").then();

app.get('/test-db', async (req, res) => {
  let responseString = '';

  const queryBuilder = new MongoODM.QueryBuilder();
  const getTimestamp = Math.round(new Date().getTime() / 1000);
  const getRandom = Math.round(Math.random() * 9999 + 1);
  const useEmail = `t2${getTimestamp}.${getRandom}@example.com`;
  const qbUseEmail = `qb${getTimestamp}.${getRandom}@qb_example.com`;
  console.log(`Attempting creation with email ${useEmail}`);

  // Query Builder
  const qbCreateUser = await queryBuilder
    .insertOne('users', {
      name: 'QB Test User',
      email: qbUseEmail,
      password: 'test123',
      courses: ['Math', 'Geometry'],
      mixed: ['test', 'array', 'mixed']
    })
    .catch((e: string) => console.log(e));
  if (qbCreateUser) responseString += `QueryBuilder: Created user with email ${qbUseEmail}! <br/>`;

  const qbFindAndUpdateUser = await queryBuilder
    .findOneAndUpdate('users', { email: qbUseEmail }, { name: 'QB Test User (updated1)' })
    .catch((e: string) => console.log(e));
  if (qbFindAndUpdateUser) responseString += `QueryBuilder: Found and updated user with email ${qbUseEmail} (response: ${qbFindAndUpdateUser?.name})! <br/>`;

  const qbUpdateUser = await queryBuilder.updateOne('users', { email: qbUseEmail }, { name: 'QB Test User (updated2)' }).catch((e: string) => console.log(e));
  if (qbUpdateUser) responseString += `QueryBuilder: Updated user with email ${qbUseEmail} (response: ${qbUpdateUser})! <br/>`;

  const qbCountUsers = await queryBuilder.count('users', { email: { $regex: '@qb_example.com', $options: 'i' } }).catch((e: string) => console.log(e));
  if (qbCountUsers) responseString += `QueryBuilder: Counted ${qbCountUsers} users with email @qb_example.com! <br/>`;

  const qbFindUser = await queryBuilder.findOne('users', { email: { $regex: '@qb_example.com', $options: 'i' } }).catch((e: string) => console.log(e));
  if (qbFindUser) responseString += `QueryBuilder: Found user with email @qb_example.com (response: ${qbFindUser?.email})! <br/>`;

  const qbFindUsers = await queryBuilder.find('users', { email: { $regex: '@qb_example.com', $options: 'i' } }).catch((e: string) => console.log(e));
  if (qbFindUsers) responseString += `QueryBuilder: Found ${qbFindUsers.length} users with email @qb_example.com (response: ${qbFindUsers?.[0]?.email})! <br/>`;

  const qbAggregateUsers = await queryBuilder
    .aggregate('users', [{ $match: { email: { $regex: '@qb_example.com', $options: 'i' } } }])
    .catch((e: string) => console.log(e));
  if (qbAggregateUsers)
    responseString += `QueryBuilder: Aggregated ${qbAggregateUsers.length} users with email @qb_example.com (response: ${qbAggregateUsers?.[0]?.email})! <br/>`;

  // Model
  const createUser = await User.findOneOrCreate(
    { email: useEmail },
    { name: 'Test User', email: useEmail, password: 'test123', courses: ['Math', 'Geometry'], mixed: ['test', 'array', 'mixed'] }
  ).catch((e: string) => console.log(e));
  if (createUser) responseString += `<br/>Model: Created user with email ${useEmail}! <br/>`;

  const findAndUpdateUser = await User.findOneAndUpdate({ email: useEmail }, { name: 'Test User (updated1)' }).catch((e: string) => console.log(e));
  if (findAndUpdateUser) responseString += `Model: Found and updated user with email ${useEmail} (response: ${findAndUpdateUser?.name})! <br/>`;

  const updateUser = await User.updateOne({ email: useEmail }, { name: 'Test User (updated2)' }).catch((e: string) => console.log(e));
  if (updateUser) responseString += `Model: Updated user with email ${useEmail} (response: ${updateUser})! <br/>`;

  const countUsers = await User.count({ email: { $regex: '@example.com', $options: 'i' } }).catch((e: string) => console.log(e));
  if (countUsers) responseString += `Model: Counted ${countUsers} users with email @example.com! <br/>`;

  const findUser = await User.findOne({ email: { $regex: '@example.com', $options: 'i' } }).catch((e: string) => console.log(e));
  if (findUser) responseString += `Model: Found user with email @example.com (response: ${findUser?.email})! <br/>`;

  const findUsers = await User.find({ email: { $regex: '@example.com', $options: 'i' } }).catch((e: string) => console.log(e));
  if (findUsers) responseString += `Model: Found ${findUsers.length} users with email @example.com (response: ${findUsers?.[0]?.email})! <br/>`;

  const aggregateUsers = await User.aggregate([{ $match: { email: { $regex: '@example.com', $options: 'i' } } }]).catch((e: string) => console.log(e));
  if (aggregateUsers)
    responseString += `Model: Aggregated ${aggregateUsers.length} users with email @example.com (response: ${aggregateUsers?.[0]?.email})! <br/>`;
  res.send(responseString);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
