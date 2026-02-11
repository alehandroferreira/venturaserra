import { Cliente, Operador, Viagem, HistoricoMovimentacao } from '@domain/entities';
import { StatusViagem } from '@domain/enums';

export interface ClienteRepository {
  create(data: Omit<Cliente, 'id' | 'createdAt' | 'updatedAt'>): Promise<Cliente>;
  findById(id: string): Promise<Cliente | null>;
  findAll(): Promise<Cliente[]>;
  update(id: string, data: Partial<Cliente>): Promise<Cliente>;
  delete(id: string): Promise<void>;
}

export interface OperadorRepository {
  create(data: Omit<Operador, 'id' | 'createdAt' | 'updatedAt'>): Promise<Operador>;
  findById(id: string): Promise<Operador | null>;
  findByEmail(email: string): Promise<Operador | null>;
  findAll(): Promise<Operador[]>;
  update(id: string, data: Partial<Operador>): Promise<Operador>;
  delete(id: string): Promise<void>;
}

export interface ViagemFilters {
  clienteId?: string;
  operadorId?: string;
  status?: StatusViagem;
  dataSaidaInicio?: Date;
  dataSaidaFim?: Date;
  previsaoEntregaInicio?: Date;
  previsaoEntregaFim?: Date;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ViagemRepository {
  create(data: Omit<Viagem, 'id' | 'createdAt' | 'updatedAt'>): Promise<Viagem>;
  findById(id: string): Promise<Viagem | null>;
  findByCodigoCarga(codigoCarga: string): Promise<Viagem | null>;
  findAll(
    filters?: ViagemFilters,
    pagination?: PaginationParams,
  ): Promise<PaginatedResult<Viagem>>;
  findByStatus(status: StatusViagem): Promise<Viagem[]>;
  update(id: string, data: Partial<Viagem>): Promise<Viagem>;
  delete(id: string): Promise<void>;
}

export interface HistoricoMovimentacaoRepository {
  create(
    data: Omit<HistoricoMovimentacao, 'id'>,
  ): Promise<HistoricoMovimentacao>;
  findByViagemId(viagemId: string): Promise<HistoricoMovimentacao[]>;
  findAll(): Promise<HistoricoMovimentacao[]>;
}
