import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError, ForbiddenError } from '@domain/errors';
import { Role } from '@domain/enums';
import { AuthUseCases } from '@application/use-cases/auth/auth-use-cases';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: Role;
  };
}

export function authMiddleware(authUseCases: AuthUseCases) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        throw new UnauthorizedError('Token não fornecido');
      }

      const [bearer, token] = authHeader.split(' ');

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedError('Formato de token inválido');
      }

      const decoded = authUseCases.verifyToken(token);

      (req as AuthenticatedRequest).user = {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role as Role,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
}

export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const user = (req as AuthenticatedRequest).user;

      if (!user) {
        throw new UnauthorizedError('Usuário não autenticado');
      }

      if (!roles.includes(user.role)) {
        throw new ForbiddenError('Você não tem permissão para acessar este recurso');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
