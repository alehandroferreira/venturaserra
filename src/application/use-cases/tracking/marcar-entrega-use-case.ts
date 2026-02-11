import { ViagemRepository } from '../../ports/repositories';
import { Logger } from '../../ports/logger';
import { Viagem } from '@domain/entities';
import { NotFoundError, UnprocessableEntityError } from '@domain/errors';
import { StatusViagem } from '@domain/enums';
import { StatusFlow } from '@domain/status-flow';
import { CreateHistoricoUseCase } from '../historico/create-historico-use-case';

export class MarcarEntregaUseCase {
  constructor(
    private readonly viagemRepository: ViagemRepository,
    private readonly createHistoricoUseCase: CreateHistoricoUseCase,
    private readonly logger: Logger,
  ) {}

  async execute(codigoCarga: string): Promise<Viagem> {
    this.logger.info('Marcando carga como entregue', { codigoCarga });

    // Buscar viagem
    const viagem = await this.viagemRepository.findByCodigoCarga(codigoCarga);
    if (!viagem) {
      throw new NotFoundError('Viagem', codigoCarga);
    }

    // Verificar se já está entregue ou cancelada
    if (viagem.statusAtual === StatusViagem.ENTREGUE) {
      throw new UnprocessableEntityError('Carga já foi entregue');
    }

    if (viagem.statusAtual === StatusViagem.CANCELADA) {
      throw new UnprocessableEntityError('Não é possível entregar uma carga cancelada');
    }

    // Validar se pode ir para ENTREGUE
    StatusFlow.validateTransition(viagem.statusAtual, StatusViagem.ENTREGUE);

    // Atualizar status
    const updatedViagem = await this.viagemRepository.update(viagem.id, {
      statusAtual: StatusViagem.ENTREGUE,
      localAtual: {
        texto: viagem.destino.texto,
        cidade: viagem.destino.cidade,
        pais: viagem.destino.pais,
        lat: viagem.destino.lat,
        lng: viagem.destino.lng,
      },
    });

    // Registrar no histórico
    await this.createHistoricoUseCase.execute({
      viagemId: viagem.id,
      status: StatusViagem.ENTREGUE,
      localTexto: viagem.destino.texto,
      lat: viagem.destino.lat,
      lng: viagem.destino.lng,
      observacoes: 'Carga entregue no destino',
    });

    this.logger.info('Carga marcada como entregue', { id: viagem.id });
    return updatedViagem;
  }
}
