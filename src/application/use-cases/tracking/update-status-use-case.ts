import { ViagemRepository } from '../../ports/repositories';
import { GeocodingService } from '../../ports/geocoding-service';
import { Logger } from '../../ports/logger';
import { UpdateStatusDTO } from '../../dtos';
import { Viagem } from '@domain/entities';
import { NotFoundError } from '@domain/errors';
import { StatusFlow } from '@domain/status-flow';
import { CreateHistoricoUseCase } from '../historico/create-historico-use-case';

export class UpdateStatusUseCase {
  constructor(
    private readonly viagemRepository: ViagemRepository,
    private readonly geocodingService: GeocodingService,
    private readonly createHistoricoUseCase: CreateHistoricoUseCase,
    private readonly logger: Logger,
  ) {}

  async execute(codigoCarga: string, dto: UpdateStatusDTO): Promise<Viagem> {
    this.logger.info('Atualizando status da carga', { codigoCarga, novoStatus: dto.status });

    // Buscar viagem
    const viagem = await this.viagemRepository.findByCodigoCarga(codigoCarga);
    if (!viagem) {
      throw new NotFoundError('Viagem', codigoCarga);
    }

    // Normalizar e validar status
    const novoStatus = StatusFlow.normalizeStatus(dto.status);

    // Validar transição de status
    StatusFlow.validateTransition(viagem.statusAtual, novoStatus);

    // Geocodificar nova localização
    this.logger.debug('Geocodificando localização', { local: dto.localTexto });
    const locationGeo = await this.geocodingService.geocode(dto.localTexto);

    // Atualizar viagem
    const updatedViagem = await this.viagemRepository.update(viagem.id, {
      statusAtual: novoStatus,
      localAtual: {
        texto: dto.localTexto,
        cidade: locationGeo?.cidade,
        pais: locationGeo?.pais,
        lat: locationGeo?.lat,
        lng: locationGeo?.lng,
      },
    });

    // Registrar no histórico
    await this.createHistoricoUseCase.execute({
      viagemId: viagem.id,
      status: novoStatus,
      localTexto: dto.localTexto,
      lat: locationGeo?.lat,
      lng: locationGeo?.lng,
      observacoes: dto.observacoes,
    });

    this.logger.info('Status atualizado com sucesso', {
      id: viagem.id,
      statusAnterior: viagem.statusAtual,
      statusNovo: novoStatus,
    });

    return updatedViagem;
  }
}
