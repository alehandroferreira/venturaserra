import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

export function validateRequest(schema: AnyZodObject) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Parse o schema que tem estrutura { body?: ..., params?: ..., query?: ... }
      const parsed = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      // Atualiza request com valores parseados e validados
      if (parsed.body !== undefined) {
        req.body = parsed.body;
      }
      if (parsed.params !== undefined) {
        req.params = parsed.params as typeof req.params;
      }
      if (parsed.query !== undefined) {
        req.query = parsed.query as typeof req.query;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
