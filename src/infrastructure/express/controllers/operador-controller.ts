import { Request, Response } from 'express';
import { OperadorUseCases } from '@application/use-cases/operadores/operador-use-cases';
import { Operador } from '@domain/entities';

type OperadorSemSenha = Omit<Operador, 'passwordHash'>;

export class OperadorController {
  constructor(private readonly operadorUseCases: OperadorUseCases) {}

  create = async (req: Request, res: Response) => {
    const operador = await this.operadorUseCases.create(req.body);
    // Não retornar passwordHash
    const { passwordHash: _passwordHash, ...operadorSemSenha } = operador;
    res.status(201).json(operadorSemSenha as OperadorSemSenha);
  };

  findAll = async (_req: Request, res: Response) => {
    const operadores = await this.operadorUseCases.findAll();
    // Não retornar passwordHash
    const operadoresSemSenha = operadores.map((op) => {
      const { passwordHash: _passwordHash, ...rest } = op;
      return rest as OperadorSemSenha;
    });
    res.json(operadoresSemSenha);
  };

  findById = async (req: Request, res: Response) => {
    const operador = await this.operadorUseCases.findById(req.params.id);
    const { passwordHash: _passwordHash, ...operadorSemSenha } = operador;
    res.json(operadorSemSenha as OperadorSemSenha);
  };

  update = async (req: Request, res: Response) => {
    const operador = await this.operadorUseCases.update(req.params.id, req.body);
    const { passwordHash: _passwordHash, ...operadorSemSenha } = operador;
    res.json(operadorSemSenha as OperadorSemSenha);
  };

  delete = async (req: Request, res: Response) => {
    await this.operadorUseCases.delete(req.params.id);
    res.status(204).send();
  };
}
