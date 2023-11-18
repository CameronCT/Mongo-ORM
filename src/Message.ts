/**
 * Logs a message to the console with optional color formatting.
 *
 * @function
 * @name Message
 * @param {string} message - The message to be logged.
 * @param {boolean} [error=false] - A flag indicating whether the message represents an error. If true, the message is printed in red; otherwise, it's printed in blue.
 * @returns {void} This function does not return a value.
 *
 * @example
 * // Usage:
 * Message('Connection Initialized'); // Logs a regular message in blue.
 * Message('Error connecting to MongoDB!', true); // Logs an error message in red.
 */
const Message = (message: string, error: boolean = false) => {
  const blueColor: string = '\x1b[36m';
  const redColor: string = '\x1b[31m';
  const resetColor: string = '\x1b[0m';
  const boldFont: string = '\x1b[1m';

  console.log(`${boldFont}${error ? redColor : blueColor}>> MongoODM: ${message}${resetColor}`);
};

export default Message;
