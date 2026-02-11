import { Request, Response } from 'express';
import { ClienteController } from './cliente-controller';
import { ClienteUseCases } from '@application/use-cases/clientes/cliente-use-cases';

describe('ClienteController', () => {
  const makeResponse = (): Response => {
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    return res as Response;
  };

  it('creates a cliente', async () => {
    const clienteUseCases = {
      create: jest.fn().mockResolvedValue({ id: '1', nome: 'Cliente' }),
    } as unknown as ClienteUseCases;

    const controller = new ClienteController(clienteUseCases);
    const req = { body: { nome: 'Cliente' } } as Request;
    const res = makeResponse();

    await controller.create(req, res);

    expect(clienteUseCases.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: '1', nome: 'Cliente' });
  });

  it('lists clientes', async () => {
    const clienteUseCases = {
      findAll: jest.fn().mockResolvedValue([{ id: '1', nome: 'Cliente' }]),
    } as unknown as ClienteUseCases;

    const controller = new ClienteController(clienteUseCases);
    const req = {} as Request;
    const res = makeResponse();

    await controller.findAll(req, res);

    expect(clienteUseCases.findAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith([{ id: '1', nome: 'Cliente' }]);
  });

  it('finds cliente by id', async () => {
    const clienteUseCases = {
      findById: jest.fn().mockResolvedValue({ id: '1', nome: 'Cliente' }),
    } as unknown as ClienteUseCases;

    const controller = new ClienteController(clienteUseCases);
    const req = { params: { id: '1' } } as unknown as Request;
    const res = makeResponse();

    await controller.findById(req, res);

    expect(clienteUseCases.findById).toHaveBeenCalledWith('1');
    expect(res.json).toHaveBeenCalledWith({ id: '1', nome: 'Cliente' });
  });

  it('updates cliente by id', async () => {
    const clienteUseCases = {
      update: jest.fn().mockResolvedValue({ id: '1', nome: 'Cliente Atualizado' }),
    } as unknown as ClienteUseCases;

    const controller = new ClienteController(clienteUseCases);
    const req = { params: { id: '1' }, body: { nome: 'Cliente Atualizado' } } as unknown as Request;
    const res = makeResponse();

    await controller.update(req, res);

    expect(clienteUseCases.update).toHaveBeenCalledWith('1', req.body);
    expect(res.json).toHaveBeenCalledWith({ id: '1', nome: 'Cliente Atualizado' });
  });

  it('deletes cliente by id', async () => {
    const clienteUseCases = {
      delete: jest.fn().mockResolvedValue(undefined),
    } as unknown as ClienteUseCases;

    const controller = new ClienteController(clienteUseCases);
    const req = { params: { id: '1' } } as unknown as Request;
    const res = makeResponse();

    await controller.delete(req, res);

    expect(clienteUseCases.delete).toHaveBeenCalledWith('1');
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});
