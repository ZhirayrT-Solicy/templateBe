import { createLogger, format, transports } from 'winston';
import configsEnv from '../configs/configs.env';

const logger = createLogger({
  level: configsEnv.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [new transports.Console()],
});

export default logger;
