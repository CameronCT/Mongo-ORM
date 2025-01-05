import MongoODM from '@cameronct/mongo-odm';

const User = new MongoODM.Model(
  'users',
  [
    { name: 'name', type: MongoODM.FieldTypes.String, required: true },
    { name: 'email', type: MongoODM.FieldTypes.String, required: true },
    { name: 'password', type: MongoODM.FieldTypes.String, required: true },
    { name: 'courses', type: MongoODM.FieldTypes.Array, default: [] },
    { name: 'mixed', type: MongoODM.FieldTypes.Mixed, default: null },
    { name: 'type', type: MongoODM.FieldTypes.String, default: 'basic' }
  ],
  [
    { name: 'uniqueEmail', fields: { email: 'text' } },
    { name: "courses", fields: { courses: -1 } }
  ],
  {
    debug: true,
    log: 0
  }
);

export default User;
