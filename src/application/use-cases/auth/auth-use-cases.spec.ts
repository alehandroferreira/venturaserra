import { AuthUseCases } from './auth-use-cases';
import { OperadorRepository } from '@application/ports/repositories';
import { Logger } from '@application/ports/logger';
import { UnauthorizedError } from '@domain/errors';
import { Role } from '@domain/enums';
import { Operador } from '@domain/entities';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthUseCases', () => {
  let useCase: AuthUseCases;
  let mockOperadorRepo: jest.Mocked<OperadorRepository>;
  let mockLogger: jest.Mocked<Logger>;
  const jwtSecret = 'test-secret';

  beforeEach(() => {
    mockOperadorRepo = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    };

    useCase = new AuthUseCases(mockOperadorRepo, mockLogger, jwtSecret, '24h');
  });

  describe('login', () => {
    it('deve fazer login com sucesso', async () => {
      const operador: Operador = {
        id: 'operador-1',
        nome: 'João Silva',
        email: 'joao@example.com',
        passwordHash: 'hashed-password',
        role: Role.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockOperadorRepo.findByEmail.mockResolvedValue(operador);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('fake-token');

      const result = await useCase.login({
        email: 'joao@example.com',
        password: 'password123',
      });

      expect(result.token).toBe('fake-token');
      expect(result.expiresIn).toBe('24h');
      expect(result.operador.id).toBe(operador.id);
      expect(result.operador.email).toBe(operador.email);
      expect(mockOperadorRepo.findByEmail).toHaveBeenCalledWith('joao@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed-password');
    });

    it('deve lançar UnauthorizedError se operador não existir', async () => {
      mockOperadorRepo.findByEmail.mockResolvedValue(null);

      await expect(
        useCase.login({
          email: 'inexistente@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(new UnauthorizedError('Credenciais inválidas'));
    });

    it('deve lançar UnauthorizedError se senha estiver incorreta', async () => {
      const operador: Operador = {
        id: 'operador-1',
        nome: 'João Silva',
        email: 'joao@example.com',
        passwordHash: 'hashed-password',
        role: Role.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockOperadorRepo.findByEmail.mockResolvedValue(operador);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        useCase.login({
          email: 'joao@example.com',
          password: 'senha-errada',
        }),
      ).rejects.toThrow(new UnauthorizedError('Credenciais inválidas'));
    });
  });

  describe('verifyToken', () => {
    it('deve verificar token válido com sucesso', () => {
      const decoded = {
        sub: 'operador-1',
        email: 'joao@example.com',
        role: Role.ADMIN,
      };

      (jwt.verify as jest.Mock).mockReturnValue(decoded);

      const result = useCase.verifyToken('valid-token');

      expect(result.sub).toBe('operador-1');
      expect(result.email).toBe('joao@example.com');
      expect(result.role).toBe(Role.ADMIN);
      expect(jwt.verify).toHaveBeenCalledWith('valid-token', jwtSecret);
    });

    it('deve lançar UnauthorizedError para token inválido', () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Token inválido');
      });

      expect(() => useCase.verifyToken('invalid-token')).toThrow(
        new UnauthorizedError('Token inválido ou expirado'),
      );
    });
  });
});
