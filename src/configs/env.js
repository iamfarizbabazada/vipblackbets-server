const Joi = require('celebrate').Joi
const dotenv = require('dotenv')
dotenv.config()

const envValidationSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid('production', 'development', 'test')
      .default('development')
      .description('Specifies the environment in which the application is running. Valid values are: "production" (for live production), "development" (for development purposes), and "test" (for running tests). Default value is "development".'),

    BASE_URL: Joi.string()
      .default('http://localhost:8080')
      .description('The base URL of the application, including the protocol, host, and port. Default value is "http://localhost:8080".'),
    
    HOST: Joi.string()
      .default('0.0.0.0')
      .description('The IP address on which the application will listen. Default value is "0.0.0.0", which means it will accept connections from all network interfaces.'),

    PORT: Joi.number()
      .integer()
      .positive()
      .default(8080)
      .description('The port number on which the application will listen. Default value is 8080.'),

    // MONGO
    MONGODB_CONNECTION_STRING: Joi.string()
      .required()
      .description('The connection string for connecting to the MongoDB database. This typically includes the MongoDB server URL and is used for configuring the database connection.'),

    DB_NAME: Joi.string()
      .required()
      .description('The name of the MongoDB database. Specifies which database operations will be performed against.'),

    // REDIS
    REDIS_HOST: Joi.string()
      .default('localhost')
      .description('The IP address or hostname of the Redis server. Default value is "localhost", meaning the Redis server is expected to run on the same machine.'),

    REDIS_PORT: Joi.number()
      .default(6379)
      .description('The port number on which the Redis server is running. Default value is 6379, which is the default port for Redis.'),
    REDIS_USERNAME: Joi.string()
      .required()
      .description('The username of the Redis server.'),
    REDIS_PASSWORD: Joi.string()
      .required()
      .description('The password of the Redis server.'),
    // SESSION
    SESSION_SECRET: Joi.string()
      .required()
      .description('A secret key used to encrypt session data. It should be secure and unpredictable to ensure session security.'),

    COOKIE_MAX_AGE: Joi.number()
      .integer()
      .positive()
      .default(14 * 24 * 60 * 60 * 1000)
      .description('The maximum age of the session cookie, in milliseconds. Default value is 14 days. This determines how long the cookie remains valid before expiring.'),

    // EMAIL
    MAIL_FROM_ADDRESS: Joi.string()
      .email()
      .required()
      .description('The "from" address used for sending emails. This specifies the sender of the emails and is often used for email verification purposes.'),

    MAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('The expiration time for email verification tokens, in minutes. Default value is 10 minutes. After this period, the token becomes invalid if not used.'),

    // MAILER
    MAILER_HOST: Joi.string()
      .required()
      .description('The hostname or IP address of the mail server used for sending emails.'),

    MAILER_USER: Joi.string()
      .required()
      .description('The username for the mail server account used for sending emails.'),

    MAILER_PASSWORD: Joi.string()
      .required()
      .description('The password for the mail server account used for sending emails. This credential allows authentication for sending emails.'),
    SWAGGER: Joi.string().default('true'),
    ALLOWED_ORIGINS: Joi.string()
      .custom((value, helpers) => {
        try {
          return value.split(','); // Split the string by commas into an array
        } catch (err) {
          return helpers.error('any.invalid');
        }
      })
      .default('http://localhost:3000,http://localhost:8080')
      .description('Comma-separated list of allowed origins for CORS. Default includes localhost:3000 and localhost:8080.'),
  }).unknown()


const { value: environment, error } = envValidationSchema.prefs({ errors: { label: 'key' } }).validate(process.env)

if (error) {
  throw new Error(`Env validation failed: ${error.message}`)
}

environment.IS_PRODUCTION = environment.NODE_ENV === 'production'
environment.IS_TEST = environment.NODE_ENV === 'test'

module.exports = environment
