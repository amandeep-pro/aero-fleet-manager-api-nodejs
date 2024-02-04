import winston from 'winston';
import path from 'path';

const { combine, timestamp, printf, errors } = winston.format;

const customFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    errors({ stack: true }),
    customFormat
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.join('logs', 'combined.log') }),
    new winston.transports.File({ filename: path.join('logs', 'error.log'), level: 'error' })
  ],
});

export default logger;
