import { MarcarEntregaUseCase } from './marcar-entrega-use-case';
import { ViagemRepository } from '@application/ports/repositories';
import { Logger } from '@application/ports/logger';
import { CreateHistoricoUseCase } from '../historico/create-historico-use-case';
import {
  NotFoundError,
  UnprocessableEntityError,
  InvalidStatusTransitionError,
} from '@domain/errors';
import { StatusViagem } from '@domain/enums';
import { Viagem } from '@domain/entities';

describe('MarcarEntregaUseCase', () => {
  let useCase: MarcarEntregaUseCase;
  let mockViagemRepo: jest.Mocked<ViagemRepository>;
  let mockCreateHistoricoUseCase: jest.Mocked<Pick<CreateHistoricoUseCase, 'execute'>>;
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

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    };

    mockCreateHistoricoUseCase = {
      execute: jest.fn(),
    } as any;

    useCase = new MarcarEntregaUseCase(
      mockViagemRepo,
      mockCreateHistoricoUseCase as any,
      mockLogger,
    );
  });

  it('deve marcar carga como entregue com sucesso', async () => {
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

    const updatedViagem = { ...viagem, statusAtual: StatusViagem.ENTREGUE };

    mockViagemRepo.findByCodigoCarga.mockResolvedValue(viagem);
    mockViagemRepo.update.mockResolvedValue(updatedViagem);
    mockCreateHistoricoUseCase.execute.mockResolvedValue({} as any);

    const result = await useCase.execute('CRG-001');

    expect(result.statusAtual).toBe(StatusViagem.ENTREGUE);
    expect(mockViagemRepo.update).toHaveBeenCalledWith(viagem.id, {
      statusAtual: StatusViagem.ENTREGUE,
      localAtual: {
        texto: viagem.destino.texto,
        cidade: viagem.destino.cidade,
        pais: viagem.destino.pais,
        lat: viagem.destino.lat,
        lng: viagem.destino.lng,
      },
    });
    expect(mockCreateHistoricoUseCase.execute).toHaveBeenCalledWith({
      viagemId: viagem.id,
      status: StatusViagem.ENTREGUE,
      localTexto: viagem.destino.texto,
      lat: viagem.destino.lat,
      lng: viagem.destino.lng,
      observacoes: 'Carga entregue no destino',
    });
  });

  it('deve lançar NotFoundError se viagem não existir', async () => {
    mockViagemRepo.findByCodigoCarga.mockResolvedValue(null);

    await expect(useCase.execute('CRG-INEXISTENTE')).rejects.toThrow(NotFoundError);
  });

  it('deve lançar UnprocessableEntityError se carga já está entregue', async () => {
    const viagem: Viagem = {
      id: 'viagem-1',
      codigoCarga: 'CRG-001',
      statusAtual: StatusViagem.ENTREGUE,
      origem: { texto: 'São Paulo', lat: -23.5, lng: -46.6 },
      destino: { texto: 'Rio de Janeiro', lat: -22.9, lng: -43.2 },
      localAtual: { texto: 'Rio de Janeiro', lat: -22.9, lng: -43.2 },
      dataSaida: new Date('2024-01-01'),
      previsaoEntrega: new Date('2024-01-05'),
      clienteId: 'cliente-1',
      operadorId: 'operador-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockViagemRepo.findByCodigoCarga.mockResolvedValue(viagem);

    await expect(useCase.execute('CRG-001')).rejects.toThrow(
      new UnprocessableEntityError('Carga já foi entregue'),
    );
  });

  it('deve lançar UnprocessableEntityError se carga está cancelada', async () => {
    const viagem: Viagem = {
      id: 'viagem-1',
      codigoCarga: 'CRG-001',
      statusAtual: StatusViagem.CANCELADA,
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

    mockViagemRepo.findByCodigoCarga.mockResolvedValue(viagem);

    await expect(useCase.execute('CRG-001')).rejects.toThrow(
      new UnprocessableEntityError('Não é possível entregar uma carga cancelada'),
    );
  });

  it('deve lançar InvalidStatusTransitionError para transição inválida', async () => {
    const viagem: Viagem = {
      id: 'viagem-1',
      codigoCarga: 'CRG-001',
      statusAtual: StatusViagem.INICIADA,
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

    mockViagemRepo.findByCodigoCarga.mockResolvedValue(viagem);

    await expect(useCase.execute('CRG-001')).rejects.toThrow(InvalidStatusTransitionError);
  });
});
