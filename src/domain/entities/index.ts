import { Role, StatusViagem } from '../enums';

export interface Cliente {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Operador {
  id: string;
  nome: string;
  email: string;
  passwordHash: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface Localizacao {
  texto: string;
  cidade?: string;
  pais?: string;
  lat?: number;
  lng?: number;
}

export interface Viagem {
  id: string;
  codigoCarga: string;
  origem: Localizacao;
  destino: Localizacao;
  dataSaida: Date;
  previsaoEntrega: Date;
  clienteId: string;
  operadorId: string;
  statusAtual: StatusViagem;
  localAtual?: Localizacao;
  createdAt: Date;
  updatedAt: Date;
}

export interface HistoricoMovimentacao {
  id: string;
  viagemId: string;
  status: StatusViagem;
  ocorridoEm: Date;
  localTexto: string;
  lat?: number;
  lng?: number;
  observacoes?: string;
}
