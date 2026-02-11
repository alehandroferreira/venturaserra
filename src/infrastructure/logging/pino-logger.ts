import { Logger } from '@application/ports/logger';
import pino from 'pino';

export class PinoLogger implements Logger {
  private readonly logger: pino.Logger;

  constructor() {
    const isDev = process.env.NODE_ENV === 'development';

    this.logger = pino({
      level: process.env.LOG_LEVEL || 'info',
      transport: isDev
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'SYS:standard',
              ignore: 'pid,hostname',
            },
          }
        : undefined,
    });
  }

  info(message: string, meta?: Record<string, unknown>): void {
    this.logger.info(meta, message);
  }

  error(message: string, error?: Error, meta?: Record<string, unknown>): void {
    this.logger.error(
      {
        ...meta,
        error: error
          ? { message: error.message, stack: error.stack, name: error.name }
          : undefined,
      },
      message,
    );
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    this.logger.warn(meta, message);
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    this.logger.debug(meta, message);
  }

  getHttpLogger() {
    return this.logger;
  }
}
