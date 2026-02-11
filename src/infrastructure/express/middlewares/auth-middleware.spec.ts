import { Request, Response, NextFunction } from 'express';
import { authMiddleware, requireRole, AuthenticatedRequest } from './auth-middleware';
import { AuthUseCases } from '../../../application/use-cases/auth/auth-use-cases';
import { Role } from '../../../domain/enums';
import { ForbiddenError, UnauthorizedError } from '../../../domain/errors';


describe('authMiddleware', () => {
  let mockAuthUseCases: jest.Mocked<Pick<AuthUseCases, 'verifyToken'>>;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    mockAuthUseCases = {
      verifyToken: jest.fn(),
    } as any;

    mockReq = {
      headers: {},
    };

    mockRes = {};

    mockNext = jest.fn();
  });

  it('deve autenticar usuário com token válido', () => {
    mockReq.headers = {
      authorization: 'Bearer valid-token',
    };

    mockAuthUseCases.verifyToken.mockReturnValue({
      sub: 'user-1',
      email: 'user@example.com',
      role: Role.ADMIN,
    });

    const middleware = authMiddleware(mockAuthUseCases as any);
    middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockAuthUseCases.verifyToken).toHaveBeenCalledWith('valid-token');
    expect((mockReq as AuthenticatedRequest).user).toEqual({
      id: 'user-1',
      email: 'user@example.com',
      role: Role.ADMIN,
    });
    expect(mockNext).toHaveBeenCalledWith();
  });

  it('deve chamar next com erro se não houver header de autorização', () => {
    mockReq.headers = {};

    const middleware = authMiddleware(mockAuthUseCases as any);
    middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    const error = mockNext.mock.calls[0][0] as unknown as UnauthorizedError;
    expect(error.message).toBe('Token não fornecido');
  });

  it('deve chamar next com erro se formato do token for inválido', () => {
    mockReq.headers = {
      authorization: 'InvalidFormat',
    };

    const middleware = authMiddleware(mockAuthUseCases as any);
    middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    const error = mockNext.mock.calls[0][0] as unknown as UnauthorizedError;
    expect(error.message).toBe('Formato de token inválido');
  });

  it('deve chamar next com erro se o token for inválido', () => {
    mockReq.headers = {
      authorization: 'Bearer invalid-token',
    };

    mockAuthUseCases.verifyToken.mockImplementation(() => {
      throw new UnauthorizedError('Token inválido ou expirado');
    });

    const middleware = authMiddleware(mockAuthUseCases as any);
    middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });
});

describe('requireRole', () => {
  let mockReq: Partial<AuthenticatedRequest>;
  let mockRes: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    mockReq = {};
    mockRes = {};
    mockNext = jest.fn();
  });

  it('deve permitir acesso para usuário com role autorizada', () => {
    mockReq.user = {
      id: 'user-1',
      email: 'user@example.com',
      role: Role.ADMIN,
    };

    const middleware = requireRole(Role.ADMIN, Role.OPERATOR);
    middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith();
  });

  it('deve bloquear acesso se usuário não tiver role autorizada', () => {
    mockReq.user = {
      id: 'user-1',
      email: 'user@example.com',
      role: Role.OPERATOR,
    };

    const middleware = requireRole(Role.ADMIN);
    middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(ForbiddenError));
    const error = mockNext.mock.calls[0][0] as unknown as ForbiddenError;
    expect(error.message).toBe(
      'Você não tem permissão para acessar este recurso',
    );
  });

  it('deve bloquear acesso se usuário não estiver autenticado', () => {
    mockReq.user = undefined;

    const middleware = requireRole(Role.ADMIN);
    middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    const error = mockNext.mock.calls[0][0] as unknown as UnauthorizedError;
    expect(error.message).toBe('Usuário não autenticado');
  });
});
