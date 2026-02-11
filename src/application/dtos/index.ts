import { Role } from '@domain/enums';

export interface CreateClienteDTO {
  nome: string;
  email?: string;
  telefone?: string;
}

export interface UpdateClienteDTO {
  nome?: string;
  email?: string;
  telefone?: string;
}

export interface CreateOperadorDTO {
  nome: string;
  email: string;
  password: string;
  role?: Role;
}

export interface UpdateOperadorDTO {
  nome?: string;
  email?: string;
  password?: string;
  role?: Role;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthTokenDTO {
  token: string;
  expiresIn: string;
  operador: {
    id: string;
    nome: string;
    email: string;
    role: Role;
  };
}

export interface LocalizacaoDTO {
  texto: string;
  cidade?: string;
  pais?: string;
  lat?: number;
  lng?: number;
}

export interface CreateViagemDTO {
  codigoCarga: string;
  origemTexto: string;
  destinoTexto: string;
  dataSaida: Date;
  previsaoEntrega: Date;
  clienteId: string;
  operadorId: string;
}

export interface UpdateStatusDTO {
  status: string;
  localTexto: string;
  observacoes?: string;
}

export interface UpdateLocalizacaoDTO {
  localTexto: string;
}

export interface CreateHistoricoManualDTO {
  status: string;
  localTexto: string;
  observacoes?: string;
  ocorridoEm?: Date;
}

export interface ViagemDetalhesDTO {
  viagem: import('@domain/entities').Viagem;
  cliente: import('@domain/entities').Cliente;
  operador: import('@domain/entities').Operador;
  historico: import('@domain/entities').HistoricoMovimentacao[];
}

export interface ViagemFiltersDTO {
  clienteId?: string;
  operadorId?: string;
  status?: string;
  dataSaidaInicio?: string;
  dataSaidaFim?: string;
  previsaoEntregaInicio?: string;
  previsaoEntregaFim?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}
