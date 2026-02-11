import { StatusFlow } from './index';
import { StatusViagem } from '@domain/enums';
import { InvalidStatusTransitionError } from '@domain/errors';

describe('StatusFlow', () => {
  describe('canTransition', () => {
    it('deve permitir transição de INICIADA para EM_TRANSITO', () => {
      expect(StatusFlow.canTransition(StatusViagem.INICIADA, StatusViagem.EM_TRANSITO)).toBe(true);
    });

    it('deve permitir transição de INICIADA para CANCELADA', () => {
      expect(StatusFlow.canTransition(StatusViagem.INICIADA, StatusViagem.CANCELADA)).toBe(true);
    });

    it('não deve permitir transição de INICIADA para ENTREGUE', () => {
      expect(StatusFlow.canTransition(StatusViagem.INICIADA, StatusViagem.ENTREGUE)).toBe(false);
    });

    it('deve permitir transição de EM_TRANSITO para TRANSBORDO', () => {
      expect(StatusFlow.canTransition(StatusViagem.EM_TRANSITO, StatusViagem.TRANSBORDO)).toBe(true);
    });

    it('deve permitir transição de EM_TRANSITO para ENTREGUE', () => {
      expect(StatusFlow.canTransition(StatusViagem.EM_TRANSITO, StatusViagem.ENTREGUE)).toBe(true);
    });

    it('não deve permitir transição de EM_TRANSITO para INICIADA', () => {
      expect(StatusFlow.canTransition(StatusViagem.EM_TRANSITO, StatusViagem.INICIADA)).toBe(false);
    });

    it('não deve permitir transição de ENTREGUE para qualquer status', () => {
      expect(StatusFlow.canTransition(StatusViagem.ENTREGUE, StatusViagem.EM_TRANSITO)).toBe(false);
      expect(StatusFlow.canTransition(StatusViagem.ENTREGUE, StatusViagem.CANCELADA)).toBe(false);
    });

    it('não deve permitir transição de CANCELADA para qualquer status', () => {
      expect(StatusFlow.canTransition(StatusViagem.CANCELADA, StatusViagem.EM_TRANSITO)).toBe(false);
      expect(StatusFlow.canTransition(StatusViagem.CANCELADA, StatusViagem.ENTREGUE)).toBe(false);
    });
  });

  describe('validateTransition', () => {
    it('não deve lançar erro para transição válida', () => {
      expect(() => {
        StatusFlow.validateTransition(StatusViagem.INICIADA, StatusViagem.EM_TRANSITO);
      }).not.toThrow();
    });

    it('deve lançar InvalidStatusTransitionError para transição inválida', () => {
      expect(() => {
        StatusFlow.validateTransition(StatusViagem.ENTREGUE, StatusViagem.EM_TRANSITO);
      }).toThrow(InvalidStatusTransitionError);
    });
  });

  describe('normalizeStatus', () => {
    it('deve normalizar status em minúsculas', () => {
      expect(StatusFlow.normalizeStatus('iniciada')).toBe(StatusViagem.INICIADA);
    });

    it('deve normalizar status com espaços', () => {
      expect(StatusFlow.normalizeStatus('em transito')).toBe(StatusViagem.EM_TRANSITO);
    });

    it('deve aceitar status já normalizado', () => {
      expect(StatusFlow.normalizeStatus('ENTREGUE')).toBe(StatusViagem.ENTREGUE);
    });

    it('deve lançar erro para status inválido', () => {
      expect(() => {
        StatusFlow.normalizeStatus('INVALIDO');
      }).toThrow();
    });
  });

  describe('isFinalStatus', () => {
    it('deve retornar true para ENTREGUE', () => {
      expect(StatusFlow.isFinalStatus(StatusViagem.ENTREGUE)).toBe(true);
    });

    it('deve retornar true para CANCELADA', () => {
      expect(StatusFlow.isFinalStatus(StatusViagem.CANCELADA)).toBe(true);
    });

    it('deve retornar false para status não final', () => {
      expect(StatusFlow.isFinalStatus(StatusViagem.INICIADA)).toBe(false);
      expect(StatusFlow.isFinalStatus(StatusViagem.EM_TRANSITO)).toBe(false);
      expect(StatusFlow.isFinalStatus(StatusViagem.TRANSBORDO)).toBe(false);
    });
  });
});
