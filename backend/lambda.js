const serverlessExpress = require('@vendia/serverless-express');
const app = require('./app');

exports.handler = async (event, context) => {
  console.log('EVENT:', JSON.stringify(event, null, 2));
  return serverlessExpress({ app })(event, context);
};
