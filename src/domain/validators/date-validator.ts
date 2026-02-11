import { UnprocessableEntityError } from '../errors';

export class DateValidator {
  static validatePrevisaoEntrega(dataSaida: Date, previsaoEntrega: Date): void {
    if (previsaoEntrega < dataSaida) {
      throw new UnprocessableEntityError(
        'A previsão de entrega não pode ser anterior à data de saída',
      );
    }
  }

  static ensureValidDates(dataSaida: Date, previsaoEntrega: Date): void {
    if (!(dataSaida instanceof Date) || isNaN(dataSaida.getTime())) {
      throw new UnprocessableEntityError('Data de saída inválida');
    }

    if (!(previsaoEntrega instanceof Date) || isNaN(previsaoEntrega.getTime())) {
      throw new UnprocessableEntityError('Previsão de entrega inválida');
    }

    this.validatePrevisaoEntrega(dataSaida, previsaoEntrega);
  }
}
