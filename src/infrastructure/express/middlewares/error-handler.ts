import { Request, Response, NextFunction } from 'express';
import { DomainError } from '@domain/errors';
import { ZodError } from 'zod';
import { Logger } from '@application/ports/logger';

export function errorHandler(logger: Logger) {
  return (err: Error, req: Request, res: Response, _next: NextFunction) => {
    // Erro de domínio
    if (err instanceof DomainError) {
      logger.warn('Erro de domínio', {
        code: err.code,
        message: err.message,
        path: req.path,
      });

      return res.status(err.statusCode).json({
        error: {
          code: err.code,
          message: err.message,
          details: 'details' in err ? (err as DomainError & { details?: unknown }).details : undefined,
        },
      });
    }

    // Erro de validação Zod
    if (err instanceof ZodError) {
      logger.warn('Erro de validação', {
        issues: err.issues,
        path: req.path,
      });

      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Erro de validação',
          details: err.issues,
        },
      });
    }

    // Erro genérico
    logger.error('Erro interno do servidor', err, {
      path: req.path,
      method: req.method,
    });

    return res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro interno do servidor',
      },
    });
  };
}
