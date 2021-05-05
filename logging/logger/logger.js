'use strict'

var appRoot = require('app-root-path');
var winston = require('winston');

// define the custom settings for each transport (file, console)
var options = {
  file: {
    level: 'silly',
    filename: `${appRoot}/logging/logs/server.log`,
    handleExceptions: true,
    json: true,
    maxsize: 52428800, // 50MB
    maxFiles: 50,
    colorize: false
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true
  },
};

// instantiate a new Winston Logger with the settings defined above
var logger = new winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console)
  ],
  exitOnError: false, // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function(message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    try {
      logger.info(message);
    } catch (error) {
      
    }
  },
};

module.exports = logger;