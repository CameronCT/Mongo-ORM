/**
 * Defines mapping between field types and their corresponding MongoDB data types.
 *
 * @typedef {Object} FieldTypes
 * @property {string} String - The MongoDB data type for a string field.
 * @property {string} Number - The MongoDB data type for a number field.
 * @property {string} Boolean - The MongoDB data type for a boolean field.
 * @property {string} Date - The MongoDB data type for a date field.
 * @property {string} Array - The MongoDB data type for an array field.
 * @property {string} Object - The MongoDB data type for an object field.
 * @property {string} ObjectId - The MongoDB data type for an ObjectId field.
 */
export default {
  String: 'string',
  Number: 'number',
  Boolean: 'boolean',
  Date: 'date',
  Array: 'array',
  Object: 'object',
  ObjectId: 'objectId'
};
