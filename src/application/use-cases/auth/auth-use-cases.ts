import { OperadorRepository } from '../../ports/repositories';
import { Logger } from '../../ports/logger';
import { LoginDTO, AuthTokenDTO } from '../../dtos';
import { UnauthorizedError } from '@domain/errors';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

export class AuthUseCases {
  constructor(
    private readonly operadorRepository: OperadorRepository,
    private readonly logger: Logger,
    private readonly jwtSecret: string,
    private readonly jwtExpiresIn: string = '24h',
  ) {}

  async login(dto: LoginDTO): Promise<AuthTokenDTO> {
    this.logger.info('Tentativa de login', { email: dto.email });

    const operador = await this.operadorRepository.findByEmail(dto.email);
    if (!operador) {
      this.logger.warn('Login falhou: usuário não encontrado', { email: dto.email });
      throw new UnauthorizedError('Credenciais inválidas');
    }

    const passwordMatch = await bcrypt.compare(dto.password, operador.passwordHash);
    if (!passwordMatch) {
      this.logger.warn('Login falhou: senha incorreta', { email: dto.email });
      throw new UnauthorizedError('Credenciais inválidas');
    }

    const token = jwt.sign(
      {
        sub: operador.id,
        email: operador.email,
        role: operador.role,
      },
      this.jwtSecret,
      { expiresIn: this.jwtExpiresIn } as jwt.SignOptions,
    );

    this.logger.info('Login bem-sucedido', { operadorId: operador.id });

    return {
      token,
      expiresIn: this.jwtExpiresIn,
      operador: {
        id: operador.id,
        nome: operador.nome,
        email: operador.email,
        role: operador.role,
      },
    };
  }

  verifyToken(token: string): { sub: string; email: string; role: string } {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as {
        sub: string;
        email: string;
        role: string;
      };
      return decoded;
    } catch (error) {
      this.logger.warn('Token inválido', { error: (error as Error).message });
      throw new UnauthorizedError('Token inválido ou expirado');
    }
  }
}
