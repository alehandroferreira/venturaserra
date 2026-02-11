import { ClienteUseCases } from './cliente-use-cases';
import { ClienteRepository } from '@application/ports/repositories';
import { Logger } from '@application/ports/logger';
import { NotFoundError } from '@domain/errors';
import { Cliente } from '@domain/entities';

describe('ClienteUseCases', () => {
  let useCase: ClienteUseCases;
  let mockClienteRepo: jest.Mocked<ClienteRepository>;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(() => {
    mockClienteRepo = {
      create: jest.fn(),
      findById: jest.fn(),
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

    useCase = new ClienteUseCases(mockClienteRepo, mockLogger);
  });

  describe('create', () => {
    it('deve criar cliente com sucesso', async () => {
      const dto = {
        nome: 'Empresa XYZ',
        email: 'contato@empresa.com',
        telefone: '(11) 98765-4321',
      };

      const cliente: Cliente = {
        id: 'cliente-1',
        ...dto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockClienteRepo.create.mockResolvedValue(cliente);

      const result = await useCase.create(dto);

      expect(result).toEqual(cliente);
      expect(mockClienteRepo.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findById', () => {
    it('deve encontrar cliente por ID', async () => {
      const cliente: Cliente = {
        id: 'cliente-1',
        nome: 'Empresa XYZ',
        email: 'contato@empresa.com',
        telefone: '(11) 98765-4321',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockClienteRepo.findById.mockResolvedValue(cliente);

      const result = await useCase.findById('cliente-1');

      expect(result).toEqual(cliente);
      expect(mockClienteRepo.findById).toHaveBeenCalledWith('cliente-1');
    });

    it('deve lançar NotFoundError se cliente não existir', async () => {
      mockClienteRepo.findById.mockResolvedValue(null);

      await expect(useCase.findById('inexistente')).rejects.toThrow(NotFoundError);
    });
  });

  describe('findAll', () => {
    it('deve listar todos os clientes', async () => {
      const clientes: Cliente[] = [
        {
          id: 'cliente-1',
          nome: 'Empresa XYZ',
          email: 'contato@empresa.com',
          telefone: '(11) 98765-4321',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'cliente-2',
          nome: 'Empresa ABC',
          email: 'contato@abc.com',
          telefone: '(11) 12345-6789',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockClienteRepo.findAll.mockResolvedValue(clientes);

      const result = await useCase.findAll();

      expect(result).toEqual(clientes);
      expect(result).toHaveLength(2);
    });
  });

  describe('update', () => {
    it('deve atualizar cliente com sucesso', async () => {
      const cliente: Cliente = {
        id: 'cliente-1',
        nome: 'Empresa XYZ',
        email: 'contato@empresa.com',
        telefone: '(11) 98765-4321',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedCliente = {
        ...cliente,
        telefone: '(11) 11111-1111',
      };

      mockClienteRepo.findById.mockResolvedValue(cliente);
      mockClienteRepo.update.mockResolvedValue(updatedCliente);

      const result = await useCase.update('cliente-1', { telefone: '(11) 11111-1111' });

      expect(result.telefone).toBe('(11) 11111-1111');
      expect(mockClienteRepo.update).toHaveBeenCalledWith('cliente-1', {
        telefone: '(11) 11111-1111',
      });
    });

    it('deve lançar NotFoundError se cliente não existir', async () => {
      mockClienteRepo.findById.mockResolvedValue(null);

      await expect(useCase.update('inexistente', { telefone: '123' })).rejects.toThrow(
        NotFoundError,
      );
    });
  });

  describe('delete', () => {
    it('deve deletar cliente com sucesso', async () => {
      const cliente: Cliente = {
        id: 'cliente-1',
        nome: 'Empresa XYZ',
        email: 'contato@empresa.com',
        telefone: '(11) 98765-4321',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockClienteRepo.findById.mockResolvedValue(cliente);
      mockClienteRepo.delete.mockResolvedValue(undefined);

      await useCase.delete('cliente-1');

      expect(mockClienteRepo.delete).toHaveBeenCalledWith('cliente-1');
    });

    it('deve lançar NotFoundError se cliente não existir', async () => {
      mockClienteRepo.findById.mockResolvedValue(null);

      await expect(useCase.delete('inexistente')).rejects.toThrow(NotFoundError);
    });
  });
});
