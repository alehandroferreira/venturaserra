import { ClienteRepository } from '../../ports/repositories';
import { Logger } from '../../ports/logger';
import { CreateClienteDTO, UpdateClienteDTO } from '../../dtos';
import { Cliente } from '@domain/entities';
import { NotFoundError } from '@domain/errors';

export class ClienteUseCases {
  constructor(
    private readonly clienteRepository: ClienteRepository,
    private readonly logger: Logger,
  ) {}

  async create(dto: CreateClienteDTO): Promise<Cliente> {
    this.logger.info('Criando cliente', { nome: dto.nome });
    const cliente = await this.clienteRepository.create(dto);
    this.logger.info('Cliente criado com sucesso', { id: cliente.id });
    return cliente;
  }

  async findById(id: string): Promise<Cliente> {
    this.logger.debug('Buscando cliente por ID', { id });
    const cliente = await this.clienteRepository.findById(id);
    if (!cliente) {
      throw new NotFoundError('Cliente', id);
    }
    return cliente;
  }

  async findAll(): Promise<Cliente[]> {
    this.logger.debug('Listando todos os clientes');
    return this.clienteRepository.findAll();
  }

  async update(id: string, dto: UpdateClienteDTO): Promise<Cliente> {
    this.logger.info('Atualizando cliente', { id });
    await this.findById(id); // Verifica se existe
    const updated = await this.clienteRepository.update(id, dto);
    this.logger.info('Cliente atualizado com sucesso', { id });
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.logger.info('Removendo cliente', { id });
    await this.findById(id); // Verifica se existe
    await this.clienteRepository.delete(id);
    this.logger.info('Cliente removido com sucesso', { id });
  }
}
