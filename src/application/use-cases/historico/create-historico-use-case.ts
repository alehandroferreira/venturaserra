import { HistoricoMovimentacaoRepository } from '../../ports/repositories';
import { Logger } from '../../ports/logger';
import { HistoricoMovimentacao } from '@domain/entities';
import { StatusViagem } from '@domain/enums';

interface CreateHistoricoInput {
  viagemId: string;
  status: StatusViagem;
  localTexto: string;
  lat?: number;
  lng?: number;
  observacoes?: string;
  ocorridoEm?: Date;
}

export class CreateHistoricoUseCase {
  constructor(
    private readonly historicoRepository: HistoricoMovimentacaoRepository,
    private readonly logger: Logger,
  ) {}

  async execute(input: CreateHistoricoInput): Promise<HistoricoMovimentacao> {
    this.logger.debug('Criando histórico de movimentação', {
      viagemId: input.viagemId,
      status: input.status,
    });

    const historico = await this.historicoRepository.create({
      viagemId: input.viagemId,
      status: input.status,
      localTexto: input.localTexto,
      lat: input.lat,
      lng: input.lng,
      observacoes: input.observacoes,
      ocorridoEm: input.ocorridoEm ?? new Date(),
    });

    this.logger.info('Histórico criado', { id: historico.id });
    return historico;
  }
}
