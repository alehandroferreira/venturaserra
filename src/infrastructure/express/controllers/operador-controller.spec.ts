import { Request, Response } from 'express';
import { OperadorController } from './operador-controller';
import { OperadorUseCases } from '@application/use-cases/operadores/operador-use-cases';

describe('OperadorController', () => {
  const makeResponse = (): Response => {
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    return res as Response;
  };

  it('creates operador without passwordHash', async () => {
    const operadorUseCases = {
      create: jest
        .fn()
        .mockResolvedValue({ id: '1', nome: 'Op', email: 'op@local', passwordHash: 'hash' }),
    } as unknown as OperadorUseCases;

    const controller = new OperadorController(operadorUseCases);
    const req = { body: { nome: 'Op', email: 'op@local', password: '123456' } } as Request;
    const res = makeResponse();

    await controller.create(req, res);

    expect(operadorUseCases.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: '1', nome: 'Op', email: 'op@local' });
  });

  it('lists operadores without passwordHash', async () => {
    const operadorUseCases = {
      findAll: jest.fn().mockResolvedValue([
        { id: '1', nome: 'Op1', email: 'op1@local', passwordHash: 'hash1' },
        { id: '2', nome: 'Op2', email: 'op2@local', passwordHash: 'hash2' },
      ]),
    } as unknown as OperadorUseCases;

    const controller = new OperadorController(operadorUseCases);
    const req = {} as Request;
    const res = makeResponse();

    await controller.findAll(req, res);

    expect(operadorUseCases.findAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith([
      { id: '1', nome: 'Op1', email: 'op1@local' },
      { id: '2', nome: 'Op2', email: 'op2@local' },
    ]);
  });

  it('finds operador by id without passwordHash', async () => {
    const operadorUseCases = {
      findById: jest
        .fn()
        .mockResolvedValue({ id: '1', nome: 'Op1', email: 'op1@local', passwordHash: 'hash1' }),
    } as unknown as OperadorUseCases;

    const controller = new OperadorController(operadorUseCases);
    const req = { params: { id: '1' } } as unknown as Request;
    const res = makeResponse();

    await controller.findById(req, res);

    expect(operadorUseCases.findById).toHaveBeenCalledWith('1');
    expect(res.json).toHaveBeenCalledWith({ id: '1', nome: 'Op1', email: 'op1@local' });
  });

  it('updates operador without passwordHash', async () => {
    const operadorUseCases = {
      update: jest
        .fn()
        .mockResolvedValue({ id: '1', nome: 'Op1', email: 'op1@local', passwordHash: 'hash1' }),
    } as unknown as OperadorUseCases;

    const controller = new OperadorController(operadorUseCases);
    const req = { params: { id: '1' }, body: { nome: 'Op1' } } as unknown as Request;
    const res = makeResponse();

    await controller.update(req, res);

    expect(operadorUseCases.update).toHaveBeenCalledWith('1', req.body);
    expect(res.json).toHaveBeenCalledWith({ id: '1', nome: 'Op1', email: 'op1@local' });
  });

  it('deletes operador by id', async () => {
    const operadorUseCases = {
      delete: jest.fn().mockResolvedValue(undefined),
    } as unknown as OperadorUseCases;

    const controller = new OperadorController(operadorUseCases);
    const req = { params: { id: '1' } } as unknown as Request;
    const res = makeResponse();

    await controller.delete(req, res);

    expect(operadorUseCases.delete).toHaveBeenCalledWith('1');
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});
