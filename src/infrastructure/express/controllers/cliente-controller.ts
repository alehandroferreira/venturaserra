import { Request, Response } from 'express';
import { ClienteUseCases } from '@application/use-cases/clientes/cliente-use-cases';

export class ClienteController {
  constructor(private readonly clienteUseCases: ClienteUseCases) {}

  create = async (req: Request, res: Response) => {
    const cliente = await this.clienteUseCases.create(req.body);
    res.status(201).json(cliente);
  };

  findAll = async (_req: Request, res: Response) => {
    const clientes = await this.clienteUseCases.findAll();
    res.json(clientes);
  };

  findById = async (req: Request, res: Response) => {
    const cliente = await this.clienteUseCases.findById(req.params.id);
    res.json(cliente);
  };

  update = async (req: Request, res: Response) => {
    const cliente = await this.clienteUseCases.update(req.params.id, req.body);
    res.json(cliente);
  };

  delete = async (req: Request, res: Response) => {
    await this.clienteUseCases.delete(req.params.id);
    res.status(204).send();
  };
}
