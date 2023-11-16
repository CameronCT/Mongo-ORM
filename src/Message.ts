const Message = (message: string, error: boolean = false) => {
  const blueColor = '\x1b[36m';
  const redColor = '\x1b[31m';
  const resetColor = '\x1b[0m';
  const boldFont = '\x1b[1m';
  console.log(`${boldFont}${error ? redColor : blueColor}>> MongoORM: ${message}${resetColor}`);
};

export default Message;
