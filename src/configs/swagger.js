const path = require('path');

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'A simple API',
    },
    servers: [
      {
        url: 'http://localhost:8080',
      },
      {
        url: 'https://vipblackbets.ozzo.az'
      }
    ],
  },
  // Paths to files containing JSDoc comments
  apis: [path.join(__dirname, '../docs/*.js')],
};
const specs = swaggerJsdoc(options);

module.exports = specs;
