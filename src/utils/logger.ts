// Simple logging utility

export class Logger {
  private static log(level: string, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${level}: ${message}`;
    
    if (data) {
      console.log(logMessage, data);
    } else {
      console.log(logMessage);
    }
  }

  static info(message: string, data?: any) {
    this.log('INFO', message, data);
  }

  static error(message: string, data?: any) {
    this.log('ERROR', message, data);
  }

  static warn(message: string, data?: any) {
    this.log('WARN', message, data);
  }

  static debug(message: string, data?: any) {
    if (process.env.NODE_ENV === 'development') {
      this.log('DEBUG', message, data);
    }
  }

  static apiRequest(method: string, url: string, status?: number) {
    this.info(`API ${method} ${url}${status ? ` - ${status}` : ''}`);
  }

  static apiResponse(method: string, url: string, status: number, data?: any) {
    this.info(`API ${method} ${url} - ${status}`, data ? { responseSize: JSON.stringify(data).length } : undefined);
  }
}
