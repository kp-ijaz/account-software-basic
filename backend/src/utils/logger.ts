import fs from 'fs';
import path from 'path';

const logsDir = path.join(process.cwd(), 'logs');

class Logger {
  private ensureLogsDir() {
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
  }

  info(message: string) {
    const timestamp = new Date().toISOString();
    console.log(`[INFO] ${timestamp} - ${message}`);
    this.logToFile(`[INFO] ${timestamp} - ${message}`);
  }

  error(message: string, err?: Error | unknown) {
    const timestamp = new Date().toISOString();
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[ERROR] ${timestamp} - ${message}`, errorMsg);
    this.logToFile(`[ERROR] ${timestamp} - ${message} ${errorMsg}`);
  }

  warn(message: string) {
    const timestamp = new Date().toISOString();
    console.warn(`[WARN] ${timestamp} - ${message}`);
    this.logToFile(`[WARN] ${timestamp} - ${message}`);
  }

  debug(message: string) {
    const timestamp = new Date().toISOString();
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${timestamp} - ${message}`);
    }
    this.logToFile(`[DEBUG] ${timestamp} - ${message}`);
  }

  private logToFile(message: string) {
    this.ensureLogsDir();
    const date = new Date().toISOString().split('T')[0];
    const logFile = path.join(logsDir, `${date}.log`);
    fs.appendFileSync(logFile, message + '\n');
  }
}

export default new Logger();
