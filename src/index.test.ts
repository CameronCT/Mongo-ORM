import path from 'path';
import MongoODM from './index';

describe('MongoODM', () => {
  test('MongoODM is correctly typed', () => {
    expect(typeof MongoODM).toBe('object');
    expect(typeof MongoODM.Connection).toBe('function');
    expect(typeof MongoODM.QueryBuilder).toBe('function');
    expect(typeof MongoODM.Model).toBe('function');
  });

  test('MongoODM can create a connection', async () => {
    await MongoODM.connect('', path.join(process.cwd(), './test/src/models'));
    expect(MongoODM.Connection.$mongoConnection).toBeTruthy();
  });

  test('MongoODM can create a Model and initiate it', async () => {
    await MongoODM.connect('', path.join(process.cwd(), './test/src/models'));
    const TestModel = new MongoODM.Model('test', [{ name: 'name', type: MongoODM.FieldTypes.String }]);
    expect(TestModel).toBeTruthy();
  });

  test('MongoODM can create a Model and query it', async () => {
    await MongoODM.connect('', path.join(process.cwd(), './test/src/models'));

    const randomId = Math.random().toString(36).substring(7);
    const TestModel = new MongoODM.Model('test', [{ name: 'name', type: MongoODM.FieldTypes.String }]);
    await TestModel.insertOne({ name: randomId });

    const query = await TestModel.findOne({ name: randomId });
    expect(query.name).toBe(randomId);
  });

  test('MongoODM can query via QueryBuilder', async () => {
    await MongoODM.connect('', path.join(process.cwd(), './test/src/models'));

    const queryBuilder = new MongoODM.QueryBuilder();
    const data = await queryBuilder.find('test', {});

    console.log(data);
    expect(typeof data).toBe('object');
  });
});
