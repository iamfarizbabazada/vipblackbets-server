const winston = require('winston')
require('winston-daily-rotate-file')
const { IS_PRODUCTION } = require('../configs/env')

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'white',
  http: 'blue',
  verbose: 'cyan',
  debug: 'purple',
  silly: 'magenta'
}

winston.addColors(colors)

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.prettyPrint(),
    winston.format.json(),
    winston.format.colorize({ all: true }),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      silent: IS_PRODUCTION
    }),
    new winston.transports.Console({
      handleExceptions: true,
      silent: IS_PRODUCTION
    })
  ].filter(Boolean)
})

module.exports = logger