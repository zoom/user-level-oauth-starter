const winston = require('winston');
const dayjs = require('dayjs');

const IS_PROD = process.env.NODE_ENV?.toString().toLowerCase().trim() === 'production';

const logger = winston.createLogger({
  defaultMeta: { service: 'zoom-user-level-oauth-starter' },
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.printf((info) => `${info.timestamp} - ${info.level} - ${info.message}`),
  ),
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
  },
  transports: [
    new winston.transports.File({
      filename: `logs/${dayjs().format('YYYY-MM-DD')}`,
      level: 'error',
    }),
  ],
});

if (!IS_PROD) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  );
}

module.exports = logger;
