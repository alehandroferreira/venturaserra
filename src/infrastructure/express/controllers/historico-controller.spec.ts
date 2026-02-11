import { Request, Response } from 'express';
import { HistoricoController } from './historico-controller';
import { HistoricoUseCases } from '@application/use-cases/historico/historico-use-cases';

describe('HistoricoController', () => {
  const makeResponse = (): Response => {
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    return res as Response;
  };

  it('lists historico by codigoCarga', async () => {
    const historicoUseCases = {
      findByCodigoCarga: jest.fn().mockResolvedValue([{ id: '1' }]),
    } as unknown as HistoricoUseCases;

    const controller = new HistoricoController(historicoUseCases);
    const req = { params: { codigoCarga: 'CRG-1' } } as unknown as Request;
    const res = makeResponse();

    await controller.findByCodigoCarga(req, res);

    expect(historicoUseCases.findByCodigoCarga).toHaveBeenCalledWith('CRG-1');
    expect(res.json).toHaveBeenCalledWith([{ id: '1' }]);
  });

  it('lists all historicos', async () => {
    const historicoUseCases = {
      findAll: jest.fn().mockResolvedValue([{ id: '1' }]),
    } as unknown as HistoricoUseCases;

    const controller = new HistoricoController(historicoUseCases);
    const req = {} as Request;
    const res = makeResponse();

    await controller.findAll(req, res);

    expect(historicoUseCases.findAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith([{ id: '1' }]);
  });

  it('creates historico manual with date parsing', async () => {
    const historicoUseCases = {
      createManual: jest.fn().mockResolvedValue({ id: '1' }),
    } as unknown as HistoricoUseCases;

    const controller = new HistoricoController(historicoUseCases);
    const req = {
      params: { codigoCarga: 'CRG-1' },
      body: { status: 'INICIADA', localTexto: 'Local', ocorridoEm: '2026-02-11T12:00:00.000Z' },
    } as unknown as Request;
    const res = makeResponse();

    await controller.createManual(req, res);

    expect(historicoUseCases.createManual).toHaveBeenCalledWith('CRG-1', {
      status: 'INICIADA',
      localTexto: 'Local',
      ocorridoEm: new Date('2026-02-11T12:00:00.000Z'),
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: '1' });
  });

  it('creates historico manual without ocorridoEm', async () => {
    const historicoUseCases = {
      createManual: jest.fn().mockResolvedValue({ id: '1' }),
    } as unknown as HistoricoUseCases;

    const controller = new HistoricoController(historicoUseCases);
    const req = {
      params: { codigoCarga: 'CRG-1' },
      body: { status: 'INICIADA', localTexto: 'Local' },
    } as unknown as Request;
    const res = makeResponse();

    await controller.createManual(req, res);

    expect(historicoUseCases.createManual).toHaveBeenCalledWith('CRG-1', {
      status: 'INICIADA',
      localTexto: 'Local',
      ocorridoEm: undefined,
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: '1' });
  });
});
