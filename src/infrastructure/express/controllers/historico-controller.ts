import { Request, Response } from 'express';
import { HistoricoUseCases } from '@application/use-cases/historico/historico-use-cases';

export class HistoricoController {
  constructor(private readonly historicoUseCases: HistoricoUseCases) {}

  findByCodigoCarga = async (req: Request, res: Response) => {
    const historicos = await this.historicoUseCases.findByCodigoCarga(req.params.codigoCarga);
    res.json(historicos);
  };

  findAll = async (_req: Request, res: Response) => {
    const historicos = await this.historicoUseCases.findAll();
    res.json(historicos);
  };

  createManual = async (req: Request, res: Response) => {
    const historico = await this.historicoUseCases.createManual(req.params.codigoCarga, {
      ...req.body,
      ocorridoEm: req.body.ocorridoEm ? new Date(req.body.ocorridoEm) : undefined,
    });
    res.status(201).json(historico);
  };
}
