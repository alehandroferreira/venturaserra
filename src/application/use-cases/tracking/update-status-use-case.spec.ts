import { UpdateStatusUseCase } from './update-status-use-case';
import { ViagemRepository } from '@application/ports/repositories';
import { GeocodingService } from '@application/ports/geocoding-service';
import { Logger } from '@application/ports/logger';
import { CreateHistoricoUseCase } from '../historico/create-historico-use-case';
import { NotFoundError, InvalidStatusTransitionError } from '@domain/errors';
import { StatusViagem } from '@domain/enums';
import { Viagem, HistoricoMovimentacao } from '@domain/entities';

describe('UpdateStatusUseCase', () => {
  let useCase: UpdateStatusUseCase;
  let mockViagemRepo: jest.Mocked<ViagemRepository>;
  let mockGeocodingService: jest.Mocked<GeocodingService>;
  let mockCreateHistoricoUseCase: jest.Mocked<Pick<CreateHistoricoUseCase, 'execute'>>;
  let mockLogger: jest.Mocked<Logger>;

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

    useCase = new UpdateStatusUseCase(
      mockViagemRepo,
      mockGeocodingService,
      mockCreateHistoricoUseCase as any,
      mockLogger,
    );
  });

  it('deve atualizar status com sucesso', async () => {
    const viagem: Partial<Viagem> = {
      id: 'viagem-123',
      codigoCarga: 'CRG-001',
      statusAtual: StatusViagem.INICIADA,
      origem: { texto: 'São Paulo' },
      destino: { texto: 'Rio de Janeiro' },
    };

    mockViagemRepo.findByCodigoCarga.mockResolvedValue(viagem as Viagem);
    mockGeocodingService.geocode.mockResolvedValue({
      lat: -22.9068,
      lng: -43.1729,
      displayName: 'Rio de Janeiro',
      cidade: 'Rio de Janeiro',
      pais: 'Brasil',
    });

    const viagemAtualizada: Partial<Viagem> = {
      ...viagem,
      statusAtual: StatusViagem.EM_TRANSITO,
    };

    mockViagemRepo.update.mockResolvedValue(viagemAtualizada as Viagem);
    mockCreateHistoricoUseCase.execute.mockResolvedValue({} as HistoricoMovimentacao);

    const result = await useCase.execute('CRG-001', {
      status: 'EM_TRANSITO',
      localTexto: 'Rod. Presidente Dutra, km 200',
    });

    expect(result.statusAtual).toBe(StatusViagem.EM_TRANSITO);
    expect(mockViagemRepo.update).toHaveBeenCalledWith(
      'viagem-123',
      expect.objectContaining({
        statusAtual: StatusViagem.EM_TRANSITO,
      }),
    );
    expect(mockCreateHistoricoUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        viagemId: 'viagem-123',
        status: StatusViagem.EM_TRANSITO,
      }),
    );
  });

  it('deve lançar NotFoundError se viagem não existir', async () => {
    mockViagemRepo.findByCodigoCarga.mockResolvedValue(null);

    await expect(
      useCase.execute('CRG-INEXISTENTE', {
        status: 'EM_TRANSITO',
        localTexto: 'Local',
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it('deve lançar InvalidStatusTransitionError para transição inválida', async () => {
    const viagem: Partial<Viagem> = {
      id: 'viagem-123',
      codigoCarga: 'CRG-001',
      statusAtual: StatusViagem.ENTREGUE,
    };

    mockViagemRepo.findByCodigoCarga.mockResolvedValue(viagem as Viagem);

    await expect(
      useCase.execute('CRG-001', {
        status: 'EM_TRANSITO',
        localTexto: 'Local',
      }),
    ).rejects.toThrow(InvalidStatusTransitionError);
  });

  it('deve normalizar status antes de validar', async () => {
    const viagem: Partial<Viagem> = {
      id: 'viagem-123',
      codigoCarga: 'CRG-001',
      statusAtual: StatusViagem.INICIADA,
    };

    mockViagemRepo.findByCodigoCarga.mockResolvedValue(viagem as Viagem);
    mockGeocodingService.geocode.mockResolvedValue({
      lat: -22.9068,
      lng: -43.1729,
      displayName: 'Rio de Janeiro',
    });

    mockViagemRepo.update.mockResolvedValue({ ...viagem, statusAtual: StatusViagem.EM_TRANSITO } as Viagem);
    mockCreateHistoricoUseCase.execute.mockResolvedValue({} as HistoricoMovimentacao);

    // Status em minúsculas e com espaço
    await useCase.execute('CRG-001', {
      status: 'em transito',
      localTexto: 'Local',
    });

    expect(mockViagemRepo.update).toHaveBeenCalledWith(
      'viagem-123',
      expect.objectContaining({
        statusAtual: StatusViagem.EM_TRANSITO,
      }),
    );
  });

  it('deve registrar automaticamente no histórico', async () => {
    const viagem: Partial<Viagem> = {
      id: 'viagem-123',
      codigoCarga: 'CRG-001',
      statusAtual: StatusViagem.EM_TRANSITO,
    };

    mockViagemRepo.findByCodigoCarga.mockResolvedValue(viagem as Viagem);
    mockGeocodingService.geocode.mockResolvedValue({
      lat: -22.9068,
      lng: -43.1729,
      displayName: 'Rio de Janeiro',
    });

    mockViagemRepo.update.mockResolvedValue({ ...viagem, statusAtual: StatusViagem.ENTREGUE } as Viagem);
    mockCreateHistoricoUseCase.execute.mockResolvedValue({} as HistoricoMovimentacao);

    await useCase.execute('CRG-001', {
      status: 'ENTREGUE',
      localTexto: 'Rio de Janeiro',
      observacoes: 'Entregue no destino',
    });

    expect(mockCreateHistoricoUseCase.execute).toHaveBeenCalledWith({
      viagemId: 'viagem-123',
      status: StatusViagem.ENTREGUE,
      localTexto: 'Rio de Janeiro',
      lat: -22.9068,
      lng: -43.1729,
      observacoes: 'Entregue no destino',
    });
  });
});
