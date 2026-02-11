import { OperadorRepository } from '../../ports/repositories';
import { Logger } from '../../ports/logger';
import { CreateOperadorDTO, UpdateOperadorDTO } from '../../dtos';
import { Operador } from '@domain/entities';
import { NotFoundError, ConflictError } from '@domain/errors';
import { Role } from '@domain/enums';
import * as bcrypt from 'bcrypt';

export class OperadorUseCases {
  constructor(
    private readonly operadorRepository: OperadorRepository,
    private readonly logger: Logger,
  ) {}

  async create(dto: CreateOperadorDTO): Promise<Operador> {
    this.logger.info('Criando operador', { email: dto.email });

    // Verifica se email já existe
    const existing = await this.operadorRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictError(`Email ${dto.email} já está em uso`);
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(dto.password, 10);

    const operador = await this.operadorRepository.create({
      nome: dto.nome,
      email: dto.email,
      passwordHash,
      role: dto.role || Role.OPERATOR,
    });

    this.logger.info('Operador criado com sucesso', { id: operador.id });
    return operador;
  }

  async findById(id: string): Promise<Operador> {
    this.logger.debug('Buscando operador por ID', { id });
    const operador = await this.operadorRepository.findById(id);
    if (!operador) {
      throw new NotFoundError('Operador', id);
    }
    return operador;
  }

  async findAll(): Promise<Operador[]> {
    this.logger.debug('Listando todos os operadores');
    return this.operadorRepository.findAll();
  }

  async update(id: string, dto: UpdateOperadorDTO): Promise<Operador> {
    this.logger.info('Atualizando operador', { id });
    await this.findById(id); // Verifica se existe

    // Se alterando email, verifica se não está em uso
    if (dto.email) {
      const existing = await this.operadorRepository.findByEmail(dto.email);
      if (existing && existing.id !== id) {
        throw new ConflictError(`Email ${dto.email} já está em uso`);
      }
    }

    const updateData: Partial<Operador> = {
      nome: dto.nome,
      email: dto.email,
      role: dto.role,
    };

    // Se alterando senha, faz hash
    if (dto.password) {
      updateData.passwordHash = await bcrypt.hash(dto.password, 10);
    }

    const updated = await this.operadorRepository.update(id, updateData);
    this.logger.info('Operador atualizado com sucesso', { id });
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.logger.info('Removendo operador', { id });
    await this.findById(id); // Verifica se existe
    await this.operadorRepository.delete(id);
    this.logger.info('Operador removido com sucesso', { id });
  }
}
