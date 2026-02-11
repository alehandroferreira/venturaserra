import { UpdateLocalizacaoUseCase } from './update-localizacao-use-case';
import { ViagemRepository } from '@application/ports/repositories';
import { GeocodingService } from '@application/ports/geocoding-service';
import { Logger } from '@application/ports/logger';
import { NotFoundError } from '@domain/errors';
import { StatusViagem } from '@domain/enums';
import { Viagem } from '@domain/entities';

describe('UpdateLocalizacaoUseCase', () => {
  let useCase: UpdateLocalizacaoUseCase;
  let mockViagemRepo: jest.Mocked<ViagemRepository>;
  let mockGeocodingService: jest.Mocked<GeocodingService>;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(() => {
    mockViagemRepo = {
      create: jest.fn(),
      findById: jest.fn(),
      findByCodigoCarga: jest.fn(),
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

    useCase = new UpdateLocalizacaoUseCase(
      mockViagemRepo,
      mockGeocodingService,
      mockLogger,
    );
  });

  it('deve atualizar localização com sucesso', async () => {
    const viagem: Viagem = {
      id: 'viagem-1',
      codigoCarga: 'CRG-001',
      statusAtual: StatusViagem.EM_TRANSITO,
      origem: { texto: 'São Paulo', lat: -23.5, lng: -46.6 },
      destino: { texto: 'Rio de Janeiro', lat: -22.9, lng: -43.2 },
      localAtual: { texto: 'São Paulo', lat: -23.5, lng: -46.6 },
      dataSaida: new Date('2024-01-01'),
      previsaoEntrega: new Date('2024-01-05'),
      clienteId: 'cliente-1',
      operadorId: 'operador-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const geoData = {
      displayName: 'Campinas, São Paulo, Brasil',
      cidade: 'Campinas',
      pais: 'Brasil',
      lat: -22.9,
      lng: -47.1,
    };

    const updatedViagem = {
      ...viagem,
      localAtual: {
        texto: 'Campinas, SP',
        cidade: 'Campinas',
        pais: 'Brasil',
        lat: -22.9,
        lng: -47.1,
      },
    };

    mockViagemRepo.findByCodigoCarga.mockResolvedValue(viagem);
    mockGeocodingService.geocode.mockResolvedValue(geoData);
    mockViagemRepo.update.mockResolvedValue(updatedViagem);

    const result = await useCase.execute('CRG-001', { localTexto: 'Campinas, SP' });

    expect(result.localAtual?.texto).toBe('Campinas, SP');
    expect(result.localAtual?.cidade).toBe('Campinas');
    expect(mockGeocodingService.geocode).toHaveBeenCalledWith('Campinas, SP');
    expect(mockViagemRepo.update).toHaveBeenCalledWith(viagem.id, {
      localAtual: {
        texto: 'Campinas, SP',
        cidade: 'Campinas',
        pais: 'Brasil',
        lat: -22.9,
        lng: -47.1,
      },
    });
  });

  it('deve lançar NotFoundError se viagem não existir', async () => {
    mockViagemRepo.findByCodigoCarga.mockResolvedValue(null);

    await expect(
      useCase.execute('CRG-INEXISTENTE', { localTexto: 'Campinas' }),
    ).rejects.toThrow(NotFoundError);
  });

  it('deve atualizar localização mesmo se geocoding não retornar dados', async () => {
    const viagem: Viagem = {
      id: 'viagem-1',
      codigoCarga: 'CRG-001',
      statusAtual: StatusViagem.EM_TRANSITO,
      origem: { texto: 'São Paulo', lat: -23.5, lng: -46.6 },
      destino: { texto: 'Rio de Janeiro', lat: -22.9, lng: -43.2 },
      localAtual: { texto: 'São Paulo', lat: -23.5, lng: -46.6 },
      dataSaida: new Date('2024-01-01'),
      previsaoEntrega: new Date('2024-01-05'),
      clienteId: 'cliente-1',
      operadorId: 'operador-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedViagem = {
      ...viagem,
      localAtual: {
        texto: 'Local Desconhecido',
      },
    };

    mockViagemRepo.findByCodigoCarga.mockResolvedValue(viagem);
    mockGeocodingService.geocode.mockResolvedValue(null);
    mockViagemRepo.update.mockResolvedValue(updatedViagem);

    const result = await useCase.execute('CRG-001', { localTexto: 'Local Desconhecido' });

    expect(result.localAtual?.texto).toBe('Local Desconhecido');
    expect(mockViagemRepo.update).toHaveBeenCalledWith(viagem.id, {
      localAtual: {
        texto: 'Local Desconhecido',
        cidade: undefined,
        pais: undefined,
        lat: undefined,
        lng: undefined,
      },
    });
  });
});
