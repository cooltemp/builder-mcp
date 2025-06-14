// Simple logging utility

import fs from 'fs';
import path from 'path';

export class Logger {
  // Check if we're running as an MCP server (stdio transport)
  private static get isMcpMode(): boolean {
    return process.env.MCP_MODE === 'true' || process.argv.includes('--mcp');
  }

  private static get debugMode(): boolean {
    return process.env.DEBUG_MCP === 'true';
  }

  private static logToFile(level: string, message: string, data?: any) {
    if (!this.debugMode) return;

    try {
      const timestamp = new Date().toISOString();
      const logMessage = `[${timestamp}] ${level}: ${message}`;
      const logEntry = data ? `${logMessage}\n${JSON.stringify(data, null, 2)}\n` : `${logMessage}\n`;

      const logFile = path.join(process.cwd(), 'mcp-debug.log');
      fs.appendFileSync(logFile, logEntry);
    } catch (error) {
      // Silently fail if we can't write to log file
    }
  }

  private static log(level: string, message: string, data?: any) {
    // In MCP mode, log to file if debug is enabled, otherwise skip
    if (this.isMcpMode) {
      this.logToFile(level, message, data);
      return;
    }

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

  // Special debug function for MCP operations
  static mcpDebug(operation: string, data: any) {
    if (this.isMcpMode && this.debugMode) {
      this.logToFile('MCP_DEBUG', `${operation}`, data);
    } else if (!this.isMcpMode) {
      this.debug(`MCP_DEBUG: ${operation}`, data);
    }
  }

  // Log detailed API request/response for debugging
  static apiDebug(method: string, url: string, requestData?: any, responseData?: any, status?: number) {
    const debugData = {
      method,
      url,
      status,
      request: requestData,
      response: responseData
    };

    if (this.isMcpMode && this.debugMode) {
      this.logToFile('API_DEBUG', `${method} ${url}`, debugData);
    } else if (!this.isMcpMode) {
      this.debug(`API_DEBUG: ${method} ${url}`, debugData);
    }
  }
}
