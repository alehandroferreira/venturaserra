import { DateValidator } from './date-validator';
import { UnprocessableEntityError } from '@domain/errors';

describe('DateValidator', () => {
  describe('validatePrevisaoEntrega', () => {
    it('não deve lançar erro quando previsão é posterior à saída', () => {
      const dataSaida = new Date('2024-01-01');
      const previsaoEntrega = new Date('2024-01-05');

      expect(() => {
        DateValidator.validatePrevisaoEntrega(dataSaida, previsaoEntrega);
      }).not.toThrow();
    });

    it('não deve lançar erro quando previsão é igual à saída', () => {
      const dataSaida = new Date('2024-01-01');
      const previsaoEntrega = new Date('2024-01-01');

      expect(() => {
        DateValidator.validatePrevisaoEntrega(dataSaida, previsaoEntrega);
      }).not.toThrow();
    });

    it('deve lançar UnprocessableEntityError quando previsão é anterior à saída', () => {
      const dataSaida = new Date('2024-01-05');
      const previsaoEntrega = new Date('2024-01-01');

      expect(() => {
        DateValidator.validatePrevisaoEntrega(dataSaida, previsaoEntrega);
      }).toThrow(UnprocessableEntityError);
    });
  });

  describe('ensureValidDates', () => {
    it('deve validar datas corretas', () => {
      const dataSaida = new Date('2024-01-01');
      const previsaoEntrega = new Date('2024-01-05');

      expect(() => {
        DateValidator.ensureValidDates(dataSaida, previsaoEntrega);
      }).not.toThrow();
    });

    it('deve lançar erro para data de saída inválida', () => {
      const dataSaida = new Date('invalid');
      const previsaoEntrega = new Date('2024-01-05');

      expect(() => {
        DateValidator.ensureValidDates(dataSaida, previsaoEntrega);
      }).toThrow(UnprocessableEntityError);
    });

    it('deve lançar erro para previsão de entrega inválida', () => {
      const dataSaida = new Date('2024-01-01');
      const previsaoEntrega = new Date('invalid');

      expect(() => {
        DateValidator.ensureValidDates(dataSaida, previsaoEntrega);
      }).toThrow(UnprocessableEntityError);
    });
  });
});
