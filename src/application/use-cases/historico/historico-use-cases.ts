import { HistoricoMovimentacaoRepository, ViagemRepository } from '../../ports/repositories';
import { Logger } from '../../ports/logger';
import { CreateHistoricoManualDTO } from '../../dtos';
import { HistoricoMovimentacao } from '@domain/entities';
import { NotFoundError } from '@domain/errors';
import { StatusFlow } from '@domain/status-flow';

export class HistoricoUseCases {
  constructor(
    private readonly historicoRepository: HistoricoMovimentacaoRepository,
    private readonly viagemRepository: ViagemRepository,
    private readonly logger: Logger,
  ) {}

  async findByCodigoCarga(codigoCarga: string): Promise<HistoricoMovimentacao[]> {
    this.logger.debug('Buscando histórico por código de carga', { codigoCarga });

    const viagem = await this.viagemRepository.findByCodigoCarga(codigoCarga);
    if (!viagem) {
      throw new NotFoundError('Viagem', codigoCarga);
    }

    const historicos = await this.historicoRepository.findByViagemId(viagem.id);

    // Ordenar por data mais recente primeiro
    return historicos.sort((a, b) => b.ocorridoEm.getTime() - a.ocorridoEm.getTime());
  }

  async findAll(): Promise<HistoricoMovimentacao[]> {
    this.logger.debug('Listando todos os históricos');
    const historicos = await this.historicoRepository.findAll();
    return historicos.sort((a, b) => b.ocorridoEm.getTime() - a.ocorridoEm.getTime());
  }

  async createManual(
    codigoCarga: string,
    dto: CreateHistoricoManualDTO,
  ): Promise<HistoricoMovimentacao> {
    this.logger.info('Criando histórico manual', { codigoCarga });

    const viagem = await this.viagemRepository.findByCodigoCarga(codigoCarga);
    if (!viagem) {
      throw new NotFoundError('Viagem', codigoCarga);
    }

    const status = StatusFlow.normalizeStatus(dto.status);

    const historico = await this.historicoRepository.create({
      viagemId: viagem.id,
      status,
      localTexto: dto.localTexto,
      observacoes: dto.observacoes,
      ocorridoEm: dto.ocorridoEm ?? new Date(),
    });

    this.logger.info('Histórico manual criado', { id: historico.id });
    return historico;
  }
}
