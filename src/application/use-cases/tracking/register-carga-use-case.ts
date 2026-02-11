import { ViagemRepository, ClienteRepository, OperadorRepository } from '../../ports/repositories';
import { GeocodingService } from '../../ports/geocoding-service';
import { Logger } from '../../ports/logger';
import { CreateViagemDTO } from '../../dtos';
import { Viagem } from '@domain/entities';
import { NotFoundError, ConflictError } from '@domain/errors';
import { StatusViagem } from '@domain/enums';
import { DateValidator } from '@domain/validators/date-validator';
import { CreateHistoricoUseCase } from '../historico/create-historico-use-case';

export class RegisterCargaUseCase {
  constructor(
    private readonly viagemRepository: ViagemRepository,
    private readonly clienteRepository: ClienteRepository,
    private readonly operadorRepository: OperadorRepository,
    private readonly geocodingService: GeocodingService,
    private readonly createHistoricoUseCase: CreateHistoricoUseCase,
    private readonly logger: Logger,
  ) {}

  async execute(dto: CreateViagemDTO): Promise<Viagem> {
    this.logger.info('Registrando nova carga', { codigoCarga: dto.codigoCarga });

    // Validar datas
    DateValidator.ensureValidDates(dto.dataSaida, dto.previsaoEntrega);

    // Verificar se código de carga já existe
    const existing = await this.viagemRepository.findByCodigoCarga(dto.codigoCarga);
    if (existing) {
      throw new ConflictError(`Código de carga ${dto.codigoCarga} já existe`);
    }

    // Verificar se cliente existe
    const cliente = await this.clienteRepository.findById(dto.clienteId);
    if (!cliente) {
      throw new NotFoundError('Cliente', dto.clienteId);
    }

    // Verificar se operador existe
    const operador = await this.operadorRepository.findById(dto.operadorId);
    if (!operador) {
      throw new NotFoundError('Operador', dto.operadorId);
    }

    // Geocodificar origem
    this.logger.debug('Geocodificando origem', { origem: dto.origemTexto });
    const origemGeo = await this.geocodingService.geocode(dto.origemTexto);

    // Geocodificar destino
    this.logger.debug('Geocodificando destino', { destino: dto.destinoTexto });
    const destinoGeo = await this.geocodingService.geocode(dto.destinoTexto);

    // Criar viagem
    const viagem = await this.viagemRepository.create({
      codigoCarga: dto.codigoCarga,
      origem: {
        texto: dto.origemTexto,
        cidade: origemGeo?.cidade,
        pais: origemGeo?.pais,
        lat: origemGeo?.lat,
        lng: origemGeo?.lng,
      },
      destino: {
        texto: dto.destinoTexto,
        cidade: destinoGeo?.cidade,
        pais: destinoGeo?.pais,
        lat: destinoGeo?.lat,
        lng: destinoGeo?.lng,
      },
      dataSaida: dto.dataSaida,
      previsaoEntrega: dto.previsaoEntrega,
      clienteId: dto.clienteId,
      operadorId: dto.operadorId,
      statusAtual: StatusViagem.INICIADA,
      localAtual: {
        texto: dto.origemTexto,
        cidade: origemGeo?.cidade,
        pais: origemGeo?.pais,
        lat: origemGeo?.lat,
        lng: origemGeo?.lng,
      },
    });

    // Criar histórico inicial
    await this.createHistoricoUseCase.execute({
      viagemId: viagem.id,
      status: StatusViagem.INICIADA,
      localTexto: dto.origemTexto,
      lat: origemGeo?.lat,
      lng: origemGeo?.lng,
      observacoes: 'Carga registrada no sistema',
    });

    this.logger.info('Carga registrada com sucesso', { id: viagem.id, codigoCarga: viagem.codigoCarga });
    return viagem;
  }
}
