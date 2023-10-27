import winston from 'winston';
import config from  './config.js';

const logLevels = {
  fatal: 0,
  error: 1,
  warning: 2,
  info: 3,
  http: 4,
  debug: 5,
};

winston.addColors({
  fatal: 'red',
  error: 'red',
  warning: 'yellow',
  info: 'blue',
  http: 'orange',
  debug: 'green',
});

export let logger;

if (config.NODE_ENV === 'production') {
  logger = winston.createLogger({
    levels: logLevels,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level}: ${message}`;
      })
    ),
    transports: [
      new winston.transports.Console({ level: 'info' }),
      new winston.transports.File({ filename: './errors.log', level: 'error' }), 
    ],
  });
} else {
  logger = winston.createLogger({
    levels: logLevels,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level}: ${message}`;
      })
    ),
    transports: [
      new winston.transports.Console({ level: 'debug' }), 
    ],
  });
}

export default logger;
