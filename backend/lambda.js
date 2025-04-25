const serverlessExpress = require('@vendia/serverless-express');
const app = require('./app'); // your express app

exports.handler = serverlessExpress({ app });
