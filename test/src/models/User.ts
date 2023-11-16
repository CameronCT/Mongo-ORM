import MongoORM from '@cameronct/mongo-orm';

const User = new MongoORM.Model(
  'users',
  [
    { name: 'name', type: MongoORM.FieldTypes.String, required: true },
    { name: 'email', type: MongoORM.FieldTypes.String, required: true },
    { name: 'password', type: MongoORM.FieldTypes.String, required: true },
    { name: 'type', type: MongoORM.FieldTypes.String, default: 'basic' }
  ],
  [{ name: 'uniqueEmail', fields: { email: 'text' } }],
  {
    debug: true,
    log: 0
  }
);

export default User;
