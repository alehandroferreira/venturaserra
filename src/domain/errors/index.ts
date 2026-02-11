export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 400,
  ) {
    super(message);
    this.name = 'DomainError';
    Object.setPrototypeOf(this, DomainError.prototype);
  }
}

export class ValidationError extends DomainError {
  constructor(message: string, public readonly details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class NotFoundError extends DomainError {
  constructor(resource: string, identifier?: string) {
    const message = identifier
      ? `${resource} com identificador '${identifier}' não encontrado(a)`
      : `${resource} não encontrado(a)`;
    super(message, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ConflictError extends DomainError {
  constructor(message: string) {
    super(message, 'CONFLICT', 409);
    this.name = 'ConflictError';
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message: string = 'Não autorizado') {
    super(message, 'UNAUTHORIZED', 401);
    this.name = 'UnauthorizedError';
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class ForbiddenError extends DomainError {
  constructor(message: string = 'Acesso negado') {
    super(message, 'FORBIDDEN', 403);
    this.name = 'ForbiddenError';
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

export class UnprocessableEntityError extends DomainError {
  constructor(message: string) {
    super(message, 'UNPROCESSABLE_ENTITY', 422);
    this.name = 'UnprocessableEntityError';
    Object.setPrototypeOf(this, UnprocessableEntityError.prototype);
  }
}

export class InvalidStatusTransitionError extends DomainError {
  constructor(from: string, to: string) {
    super(
      `Transição de status inválida: não é permitido mudar de ${from} para ${to}`,
      'INVALID_STATUS_TRANSITION',
      422,
    );
    this.name = 'InvalidStatusTransitionError';
    Object.setPrototypeOf(this, InvalidStatusTransitionError.prototype);
  }
}

export class ExternalServiceError extends DomainError {
  constructor(service: string, message: string) {
    super(`Erro no serviço externo ${service}: ${message}`, 'EXTERNAL_SERVICE_ERROR', 500);
    this.name = 'ExternalServiceError';
    Object.setPrototypeOf(this, ExternalServiceError.prototype);
  }
}
