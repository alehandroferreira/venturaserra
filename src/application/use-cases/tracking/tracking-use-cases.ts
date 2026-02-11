import {
  ViagemRepository,
  PaginatedResult,
  ViagemFilters,
  ClienteRepository,
  OperadorRepository,
  HistoricoMovimentacaoRepository,
} from '../../ports/repositories';
import { Logger } from '../../ports/logger';
import { ViagemFiltersDTO, ViagemDetalhesDTO } from '../../dtos';
import { Viagem } from '@domain/entities';
import { NotFoundError } from '@domain/errors';
import { StatusViagem } from '@domain/enums';
import { StatusFlow } from '@domain/status-flow';

export class TrackingUseCases {
  constructor(
    private readonly viagemRepository: ViagemRepository,
    private readonly clienteRepository: ClienteRepository,
    private readonly operadorRepository: OperadorRepository,
    private readonly historicoRepository: HistoricoMovimentacaoRepository,
    private readonly logger: Logger,
  ) {}

  async findByCodigoCarga(codigoCarga: string): Promise<Viagem> {
    this.logger.debug('Buscando carga por código', { codigoCarga });
    const viagem = await this.viagemRepository.findByCodigoCarga(codigoCarga);
    if (!viagem) {
      throw new NotFoundError('Viagem', codigoCarga);
    }
    return viagem;
  }

  async findDetalhesPorCodigoCarga(codigoCarga: string): Promise<ViagemDetalhesDTO> {
    this.logger.debug('Buscando detalhes completos da carga', { codigoCarga });

    const viagem = await this.findByCodigoCarga(codigoCarga);

    const [cliente, operador, historico] = await Promise.all([
      this.clienteRepository.findById(viagem.clienteId),
      this.operadorRepository.findById(viagem.operadorId),
      this.historicoRepository.findByViagemId(viagem.id),
    ]);

    if (!cliente) {
      throw new NotFoundError('Cliente', viagem.clienteId);
    }

    if (!operador) {
      throw new NotFoundError('Operador', viagem.operadorId);
    }

    return {
      viagem,
      cliente,
      operador,
      historico,
    };
  }

  async findAll(filters: ViagemFiltersDTO): Promise<PaginatedResult<Viagem>> {
    this.logger.debug('Listando cargas com filtros', filters as Record<string, unknown>);

    const parsedFilters: ViagemFilters = {};

    if (filters.clienteId) parsedFilters.clienteId = filters.clienteId;
    if (filters.operadorId) parsedFilters.operadorId = filters.operadorId;
    if (filters.status) {
      parsedFilters.status = StatusFlow.normalizeStatus(filters.status);
    }
    if (filters.dataSaidaInicio) {
      parsedFilters.dataSaidaInicio = new Date(filters.dataSaidaInicio);
    }
    if (filters.dataSaidaFim) {
      parsedFilters.dataSaidaFim = new Date(filters.dataSaidaFim);
    }
    if (filters.previsaoEntregaInicio) {
      parsedFilters.previsaoEntregaInicio = new Date(filters.previsaoEntregaInicio);
    }
    if (filters.previsaoEntregaFim) {
      parsedFilters.previsaoEntregaFim = new Date(filters.previsaoEntregaFim);
    }

    const pagination = {
      page: filters.page || 1,
      pageSize: filters.pageSize || 10,
      sortBy: filters.sortBy || 'createdAt',
      sortDir: (filters.sortDir || 'desc') as 'asc' | 'desc',
    };

    return this.viagemRepository.findAll(parsedFilters, pagination);
  }

  async findByStatus(status: string): Promise<Viagem[]> {
    const normalizedStatus = StatusFlow.normalizeStatus(status);
    this.logger.debug('Buscando cargas por status', { status: normalizedStatus });
    return this.viagemRepository.findByStatus(normalizedStatus);
  }

  async delete(codigoCarga: string): Promise<void> {
    this.logger.info('Cancelando carga', { codigoCarga });
    const viagem = await this.findByCodigoCarga(codigoCarga);

    // Marcar como cancelada ao invés de remover
    await this.viagemRepository.update(viagem.id, {
      statusAtual: StatusViagem.CANCELADA,
    });

    this.logger.info('Carga cancelada', { id: viagem.id });
  }
}
