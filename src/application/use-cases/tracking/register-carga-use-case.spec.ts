import { RegisterCargaUseCase } from './register-carga-use-case';
import { ViagemRepository, ClienteRepository, OperadorRepository } from '@application/ports/repositories';
import { GeocodingService } from '@application/ports/geocoding-service';
import { Logger } from '@application/ports/logger';
import { CreateHistoricoUseCase } from '../historico/create-historico-use-case';
import { ConflictError, NotFoundError } from '@domain/errors';
import { StatusViagem, Role } from '@domain/enums';
import { Viagem, Cliente, HistoricoMovimentacao } from '@domain/entities';

describe('RegisterCargaUseCase', () => {
  let useCase: RegisterCargaUseCase;
  let mockViagemRepo: jest.Mocked<ViagemRepository>;
  let mockClienteRepo: jest.Mocked<ClienteRepository>;
  let mockOperadorRepo: jest.Mocked<OperadorRepository>;
  let mockGeocodingService: jest.Mocked<GeocodingService>;
  let mockLogger: jest.Mocked<Logger>;
  let mockCreateHistoricoUseCase: jest.Mocked<Pick<CreateHistoricoUseCase, 'execute'>>;

  beforeEach(() => {
    mockViagemRepo = {
      create: jest.fn(),
      findByCodigoCarga: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByStatus: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockClienteRepo = {
      findById: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockOperadorRepo = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockGeocodingService = {
      geocode: jest.fn(),
    };

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    };

    mockCreateHistoricoUseCase = {
      execute: jest.fn(),
    } as any;

    useCase = new RegisterCargaUseCase(
      mockViagemRepo,
      mockClienteRepo,
      mockOperadorRepo,
      mockGeocodingService,
      mockCreateHistoricoUseCase as any,
      mockLogger,
    );
  });

  it('deve registrar uma nova carga com sucesso', async () => {
    const dto = {
      codigoCarga: 'CRG-001',
      origemTexto: 'São Paulo',
      destinoTexto: 'Rio de Janeiro',
      dataSaida: new Date('2024-01-01'),
      previsaoEntrega: new Date('2024-01-05'),
      clienteId: 'cliente-123',
      operadorId: 'operador-123',
    };

    mockViagemRepo.findByCodigoCarga.mockResolvedValue(null);
    mockClienteRepo.findById.mockResolvedValue({
      id: 'cliente-123',
      nome: 'Cliente Teste',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    mockOperadorRepo.findById.mockResolvedValue({
      id: 'operador-123',
      nome: 'Operador Teste',
      email: 'op@test.com',
      passwordHash: 'hash',
      role: Role.OPERATOR,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockGeocodingService.geocode.mockResolvedValue({
      lat: -23.5505,
      lng: -46.6333,
      displayName: 'São Paulo',
      cidade: 'São Paulo',
      pais: 'Brasil',
    });

    const mockViagem: Partial<Viagem> = {
      id: 'viagem-123',
      codigoCarga: dto.codigoCarga,
      statusAtual: StatusViagem.INICIADA,
      origem: { texto: dto.origemTexto },
      destino: { texto: dto.destinoTexto },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockViagemRepo.create.mockResolvedValue(mockViagem as Viagem);
    mockCreateHistoricoUseCase.execute.mockResolvedValue({} as HistoricoMovimentacao);

    const result = await useCase.execute(dto);

    expect(result).toEqual(mockViagem);
    expect(mockViagemRepo.findByCodigoCarga).toHaveBeenCalledWith('CRG-001');
    expect(mockClienteRepo.findById).toHaveBeenCalledWith('cliente-123');
    expect(mockOperadorRepo.findById).toHaveBeenCalledWith('operador-123');
    expect(mockGeocodingService.geocode).toHaveBeenCalledTimes(2);
    expect(mockViagemRepo.create).toHaveBeenCalled();
    expect(mockCreateHistoricoUseCase.execute).toHaveBeenCalled();
  });

  it('deve lançar ConflictError se código de carga já existir', async () => {
    const dto = {
      codigoCarga: 'CRG-001',
      origemTexto: 'São Paulo',
      destinoTexto: 'Rio de Janeiro',
      dataSaida: new Date('2024-01-01'),
      previsaoEntrega: new Date('2024-01-05'),
      clienteId: 'cliente-123',
      operadorId: 'operador-123',
    };

    mockViagemRepo.findByCodigoCarga.mockResolvedValue({} as Viagem);

    await expect(useCase.execute(dto)).rejects.toThrow(ConflictError);
  });

  it('deve lançar NotFoundError se cliente não existir', async () => {
    const dto = {
      codigoCarga: 'CRG-001',
      origemTexto: 'São Paulo',
      destinoTexto: 'Rio de Janeiro',
      dataSaida: new Date('2024-01-01'),
      previsaoEntrega: new Date('2024-01-05'),
      clienteId: 'cliente-inexistente',
      operadorId: 'operador-123',
    };

    mockViagemRepo.findByCodigoCarga.mockResolvedValue(null);
    mockClienteRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(dto)).rejects.toThrow(NotFoundError);
  });

  it('deve lançar NotFoundError se operador não existir', async () => {
    const dto = {
      codigoCarga: 'CRG-001',
      origemTexto: 'São Paulo',
      destinoTexto: 'Rio de Janeiro',
      dataSaida: new Date('2024-01-01'),
      previsaoEntrega: new Date('2024-01-05'),
      clienteId: 'cliente-123',
      operadorId: 'operador-inexistente',
    };

    mockViagemRepo.findByCodigoCarga.mockResolvedValue(null);
    mockClienteRepo.findById.mockResolvedValue({} as Cliente);
    mockOperadorRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(dto)).rejects.toThrow(NotFoundError);
  });
});
