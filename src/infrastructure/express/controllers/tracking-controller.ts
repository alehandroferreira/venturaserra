import { Request, Response } from 'express';
import { RegisterCargaUseCase } from '@application/use-cases/tracking/register-carga-use-case';
import { UpdateStatusUseCase } from '@application/use-cases/tracking/update-status-use-case';
import { UpdateLocalizacaoUseCase } from '@application/use-cases/tracking/update-localizacao-use-case';
import { MarcarEntregaUseCase } from '@application/use-cases/tracking/marcar-entrega-use-case';
import { TrackingUseCases } from '@application/use-cases/tracking/tracking-use-cases';
import { ViagemFiltersDTO } from '@application/dtos';

export class TrackingController {
  constructor(
    private readonly registerCargaUseCase: RegisterCargaUseCase,
    private readonly updateStatusUseCase: UpdateStatusUseCase,
    private readonly updateLocalizacaoUseCase: UpdateLocalizacaoUseCase,
    private readonly marcarEntregaUseCase: MarcarEntregaUseCase,
    private readonly trackingUseCases: TrackingUseCases,
  ) {}

  create = async (req: Request, res: Response) => {
    const viagem = await this.registerCargaUseCase.execute({
      ...req.body,
      dataSaida: new Date(req.body.dataSaida),
      previsaoEntrega: new Date(req.body.previsaoEntrega),
    });
    res.status(201).json(viagem);
  };

  findAll = async (req: Request, res: Response) => {
    const result = await this.trackingUseCases.findAll(req.query as unknown as ViagemFiltersDTO);
    res.json(result);
  };

  findByCodigoCarga = async (req: Request, res: Response) => {
    const detalhes = await this.trackingUseCases.findDetalhesPorCodigoCarga(req.params.codigoCarga);
    res.json(detalhes);
  };

  updateStatus = async (req: Request, res: Response) => {
    const viagem = await this.updateStatusUseCase.execute(req.params.codigoCarga, req.body);
    res.json(viagem);
  };

  updateLocalizacao = async (req: Request, res: Response) => {
    const viagem = await this.updateLocalizacaoUseCase.execute(req.params.codigoCarga, req.body);
    res.json(viagem);
  };

  marcarEntrega = async (req: Request, res: Response) => {
    const viagem = await this.marcarEntregaUseCase.execute(req.params.codigoCarga);
    res.json(viagem);
  };

  findByStatus = async (req: Request, res: Response) => {
    const viagens = await this.trackingUseCases.findByStatus(req.params.status);
    res.json(viagens);
  };

  delete = async (req: Request, res: Response) => {
    await this.trackingUseCases.delete(req.params.codigoCarga);
    res.status(204).send();
  };
}
