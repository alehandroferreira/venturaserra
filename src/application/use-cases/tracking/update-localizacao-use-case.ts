import { ViagemRepository } from '../../ports/repositories';
import { GeocodingService } from '../../ports/geocoding-service';
import { Logger } from '../../ports/logger';
import { UpdateLocalizacaoDTO } from '../../dtos';
import { Viagem } from '@domain/entities';
import { NotFoundError } from '@domain/errors';

export class UpdateLocalizacaoUseCase {
  constructor(
    private readonly viagemRepository: ViagemRepository,
    private readonly geocodingService: GeocodingService,
    private readonly logger: Logger,
  ) {}

  async execute(codigoCarga: string, dto: UpdateLocalizacaoDTO): Promise<Viagem> {
    this.logger.info('Atualizando localização da carga', { codigoCarga });

    // Buscar viagem
    const viagem = await this.viagemRepository.findByCodigoCarga(codigoCarga);
    if (!viagem) {
      throw new NotFoundError('Viagem', codigoCarga);
    }

    // Geocodificar nova localização
    this.logger.debug('Geocodificando localização', { local: dto.localTexto });
    const locationGeo = await this.geocodingService.geocode(dto.localTexto);

    // Atualizar apenas localização atual, não muda status
    const updatedViagem = await this.viagemRepository.update(viagem.id, {
      localAtual: {
        texto: dto.localTexto,
        cidade: locationGeo?.cidade,
        pais: locationGeo?.pais,
        lat: locationGeo?.lat,
        lng: locationGeo?.lng,
      },
    });

    this.logger.info('Localização atualizada', { id: viagem.id });
    return updatedViagem;
  }
}
