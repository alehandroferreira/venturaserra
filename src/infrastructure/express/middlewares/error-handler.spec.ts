import { Request, Response, NextFunction } from 'express';
import { errorHandler } from './error-handler';
import { ZodError, ZodIssue } from 'zod';
import { Logger } from '../../../application/ports/logger';
import { NotFoundError, ValidationError } from '../../../domain/errors';


describe('errorHandler', () => {
  let mockLogger: jest.Mocked<Logger>;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    };

    mockReq = {
      path: '/test-path',
      method: 'GET',
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
  });

  it('deve tratar DomainError corretamente', () => {
    const error = new NotFoundError('Recurso', 'id-123');
    const handler = errorHandler(mockLogger);

    handler(error, mockReq as Request, mockRes as Response, mockNext);

    expect(mockLogger.warn).toHaveBeenCalledWith('Erro de domínio', {
      code: error.code,
      message: error.message,
      path: '/test-path',
    });

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: {
        code: error.code,
        message: error.message,
        details: undefined,
      },
    });
  });

  it('deve tratar ValidationError com details', () => {
    const details = { campo: 'email', mensagem: 'Email inválido' };
    const error = new ValidationError('Erro de validação', details);
    const handler = errorHandler(mockLogger);

    handler(error, mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Erro de validação',
        details: details,
      },
    });
  });

  it('deve tratar ZodError corretamente', () => {
    const issues: ZodIssue[] = [
      {
        code: 'invalid_type',
        expected: 'string',
        received: 'number',
        path: ['email'],
        message: 'Expected string, received number',
      },
    ];

    const error = new ZodError(issues);
    const handler = errorHandler(mockLogger);

    handler(error, mockReq as Request, mockRes as Response, mockNext);

    expect(mockLogger.warn).toHaveBeenCalledWith('Erro de validação', {
      issues: error.issues,
      path: '/test-path',
    });

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Erro de validação',
        details: issues,
      },
    });
  });

  it('deve tratar erro genérico corretamente', () => {
    const error = new Error('Erro inesperado');
    const handler = errorHandler(mockLogger);

    handler(error, mockReq as Request, mockRes as Response, mockNext);

    expect(mockLogger.error).toHaveBeenCalledWith('Erro interno do servidor', error, {
      path: '/test-path',
      method: 'GET',
    });

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalled();
  });
});
