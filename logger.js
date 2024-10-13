const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const rotateTransport = new DailyRotateFile({
  filename: 'logs/api-%DATE%.log', // File pattern
  datePattern: 'YYYY-MM-DD', // Rotate daily
  maxSize: '20m', // Maximum size per file (20MB)
  maxFiles: '14d', // Keep logs for 14 days
  zippedArchive: true // Compress old logs
});

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    rotateTransport, // Rotate log files
    new transports.Console() // Log to console as well
  ]
});

module.exports = logger;
