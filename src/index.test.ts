import path from 'path';
import MongoODM from './index';

new MongoODM.Connection('', path.join(process.cwd(), './test/src/models'), () => false);

/*
const delayAsync = (ms: number) => {
  const start = new Date().getTime();
  let end = start;
  while(end < start + ms) {
    end = new Date().getTime();
  }

  return true;
}
*/

describe('MongoODM', () => {
  test('MongoODM is an exported object', () => {
    expect(typeof MongoODM).toBe('object');
  });

  test('MongoODM has a Connection property', () => {
    expect(typeof MongoODM.Connection).toBe('function');
  });

  test('MongoODM has a QueryBuilder property', () => {
    expect(typeof MongoODM.QueryBuilder).toBe('function');
  });

  test('MongoODM has a Model property', () => {
    expect(typeof MongoODM.Model).toBe('function');
  });

  test('Can create a Model and initiate it', async () => {
    const TestModel = new MongoODM.Model('test', [{ name: 'name', type: MongoODM.FieldTypes.String }]);

    expect(TestModel).toBeTruthy();
  });
});
