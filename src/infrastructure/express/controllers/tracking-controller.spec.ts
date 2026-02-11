import { Request, Response } from 'express';
import { TrackingController } from './tracking-controller';
import { RegisterCargaUseCase } from '@application/use-cases/tracking/register-carga-use-case';
import { UpdateStatusUseCase } from '@application/use-cases/tracking/update-status-use-case';
import { UpdateLocalizacaoUseCase } from '@application/use-cases/tracking/update-localizacao-use-case';
import { MarcarEntregaUseCase } from '@application/use-cases/tracking/marcar-entrega-use-case';
import { TrackingUseCases } from '@application/use-cases/tracking/tracking-use-cases';

describe('TrackingController', () => {
  const makeResponse = (): Response => {
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    return res as Response;
  };

  const makeController = () => {
    const registerCargaUseCase = {
      execute: jest.fn().mockResolvedValue({ id: '1' }),
    } as unknown as RegisterCargaUseCase;
    const updateStatusUseCase = {
      execute: jest.fn().mockResolvedValue({ id: '1' }),
    } as unknown as UpdateStatusUseCase;
    const updateLocalizacaoUseCase = {
      execute: jest.fn().mockResolvedValue({ id: '1' }),
    } as unknown as UpdateLocalizacaoUseCase;
    const marcarEntregaUseCase = {
      execute: jest.fn().mockResolvedValue({ id: '1' }),
    } as unknown as MarcarEntregaUseCase;
    const trackingUseCases = {
      findAll: jest.fn().mockResolvedValue([]),
      findDetalhesPorCodigoCarga: jest.fn().mockResolvedValue({ id: '1' }),
      findByStatus: jest.fn().mockResolvedValue([]),
      delete: jest.fn().mockResolvedValue(undefined),
    } as unknown as TrackingUseCases;

    const controller = new TrackingController(
      registerCargaUseCase,
      updateStatusUseCase,
      updateLocalizacaoUseCase,
      marcarEntregaUseCase,
      trackingUseCases,
    );

    return {
      controller,
      registerCargaUseCase,
      updateStatusUseCase,
      updateLocalizacaoUseCase,
      marcarEntregaUseCase,
      trackingUseCases,
    };
  };

  it('creates a viagem with date conversion', async () => {
    const { controller, registerCargaUseCase } = makeController();
    const req = {
      body: {
        codigoCarga: 'CRG-1',
        origemTexto: 'Origem',
        destinoTexto: 'Destino',
        dataSaida: '2026-02-11T10:00:00.000Z',
        previsaoEntrega: '2026-02-13T10:00:00.000Z',
        clienteId: 'cliente-1',
        operadorId: 'operador-1',
      },
    } as Request;
    const res = makeResponse();

    await controller.create(req, res);

    expect(registerCargaUseCase.execute).toHaveBeenCalledWith({
      ...req.body,
      dataSaida: new Date(req.body.dataSaida),
      previsaoEntrega: new Date(req.body.previsaoEntrega),
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: '1' });
  });

  it('lists viagens with filters', async () => {
    const { controller, trackingUseCases } = makeController();
    const req = { query: { status: 'INICIADA', page: '1' } } as unknown as Request;
    const res = makeResponse();

    await controller.findAll(req, res);

    expect(trackingUseCases.findAll).toHaveBeenCalledWith(req.query as never);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it('finds viagem by codigoCarga', async () => {
    const { controller, trackingUseCases } = makeController();
    const req = { params: { codigoCarga: 'CRG-1' } } as unknown as Request;
    const res = makeResponse();

    await controller.findByCodigoCarga(req, res);

    expect(trackingUseCases.findDetalhesPorCodigoCarga).toHaveBeenCalledWith('CRG-1');
    expect(res.json).toHaveBeenCalledWith({ id: '1' });
  });

  it('updates status', async () => {
    const { controller, updateStatusUseCase } = makeController();
    const req = {
      params: { codigoCarga: 'CRG-1' },
      body: { status: 'ENTREGUE' },
    } as unknown as Request;
    const res = makeResponse();

    await controller.updateStatus(req, res);

    expect(updateStatusUseCase.execute).toHaveBeenCalledWith('CRG-1', req.body);
    expect(res.json).toHaveBeenCalledWith({ id: '1' });
  });

  it('updates localizacao', async () => {
    const { controller, updateLocalizacaoUseCase } = makeController();
    const req = {
      params: { codigoCarga: 'CRG-1' },
      body: { localTexto: 'Local' },
    } as unknown as Request;
    const res = makeResponse();

    await controller.updateLocalizacao(req, res);

    expect(updateLocalizacaoUseCase.execute).toHaveBeenCalledWith('CRG-1', req.body);
    expect(res.json).toHaveBeenCalledWith({ id: '1' });
  });

  it('marks entrega', async () => {
    const { controller, marcarEntregaUseCase } = makeController();
    const req = { params: { codigoCarga: 'CRG-1' } } as unknown as Request;
    const res = makeResponse();

    await controller.marcarEntrega(req, res);

    expect(marcarEntregaUseCase.execute).toHaveBeenCalledWith('CRG-1');
    expect(res.json).toHaveBeenCalledWith({ id: '1' });
  });

  it('lists viagens by status', async () => {
    const { controller, trackingUseCases } = makeController();
    const req = { params: { status: 'INICIADA' } } as unknown as Request;
    const res = makeResponse();

    await controller.findByStatus(req, res);

    expect(trackingUseCases.findByStatus).toHaveBeenCalledWith('INICIADA');
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it('deletes viagem', async () => {
    const { controller, trackingUseCases } = makeController();
    const req = { params: { codigoCarga: 'CRG-1' } } as unknown as Request;
    const res = makeResponse();

    await controller.delete(req, res);

    expect(trackingUseCases.delete).toHaveBeenCalledWith('CRG-1');
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});
