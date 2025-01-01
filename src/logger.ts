import { createLogger, format, transports } from 'winston';
import * as fs from 'fs';
import * as path from 'path';

// Create the log directory if it does not exist
const logDir = path.join(__dirname, '../log');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Function to get log file name with current date
const getLogFileName = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}.log`;
};

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level}: ${message}`)
  ),
  transports: [
    new transports.File({ filename: path.join(logDir, getLogFileName()), level: 'info' }),
  ],
});

export default logger;
