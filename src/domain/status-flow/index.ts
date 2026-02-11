import { StatusViagem } from '../enums';
import { InvalidStatusTransitionError } from '../errors';

type StatusTransitions = {
  [key in StatusViagem]: StatusViagem[];
};

const VALID_TRANSITIONS: StatusTransitions = {
  [StatusViagem.INICIADA]: [StatusViagem.EM_TRANSITO, StatusViagem.CANCELADA],
  [StatusViagem.EM_TRANSITO]: [
    StatusViagem.TRANSBORDO,
    StatusViagem.ENTREGUE,
    StatusViagem.CANCELADA,
  ],
  [StatusViagem.TRANSBORDO]: [
    StatusViagem.EM_TRANSITO,
    StatusViagem.ENTREGUE,
    StatusViagem.CANCELADA,
  ],
  [StatusViagem.ENTREGUE]: [],
  [StatusViagem.CANCELADA]: [],
};

export class StatusFlow {
  static canTransition(from: StatusViagem, to: StatusViagem): boolean {
    const allowedTransitions = VALID_TRANSITIONS[from];
    return allowedTransitions.includes(to);
  }

  static validateTransition(from: StatusViagem, to: StatusViagem): void {
    if (!this.canTransition(from, to)) {
      throw new InvalidStatusTransitionError(from, to);
    }
  }

  static normalizeStatus(status: string): StatusViagem {
    const normalized = status.toUpperCase().replace(/\s+/g, '_');
    
    if (!Object.values(StatusViagem).includes(normalized as StatusViagem)) {
      throw new Error(`Status inválido: ${status}`);
    }
    
    return normalized as StatusViagem;
  }

  static getAllowedTransitions(from: StatusViagem): StatusViagem[] {
    return VALID_TRANSITIONS[from];
  }

  static isFinalStatus(status: StatusViagem): boolean {
    return status === StatusViagem.ENTREGUE || status === StatusViagem.CANCELADA;
  }
}
