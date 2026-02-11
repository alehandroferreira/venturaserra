import { z } from 'zod';

export const createViagemSchema = z.object({
  body: z
    .object({
      codigoCarga: z.string().min(1, 'Código de carga é obrigatório'),
      origemTexto: z.string().min(1, 'Origem é obrigatória'),
      destinoTexto: z.string().min(1, 'Destino é obrigatório'),
      dataSaida: z.string().datetime('Data de saída inválida'),
      previsaoEntrega: z.string().datetime('Previsão de entrega inválida'),
      clienteId: z.string().uuid('ID do cliente inválido'),
      operadorId: z.string().uuid('ID do operador inválido'),
    })
    .refine(
      (data) => {
        const saida = new Date(data.dataSaida);
        const entrega = new Date(data.previsaoEntrega);
        return entrega >= saida;
      },
      {
        message: 'Previsão de entrega não pode ser anterior à data de saída',
        path: ['previsaoEntrega'],
      },
    ),
});

export const updateStatusSchema = z.object({
  params: z.object({
    codigoCarga: z.string().min(1, 'Código de carga é obrigatório'),
  }),
  body: z.object({
    status: z.enum(['INICIADA', 'EM_TRANSITO', 'TRANSBORDO', 'ENTREGUE', 'CANCELADA'], {
      errorMap: () => ({ message: 'Status inválido. Use: INICIADA, EM_TRANSITO, TRANSBORDO, ENTREGUE ou CANCELADA' }),
    }),
    localTexto: z.string().min(1, 'Localização é obrigatória'),
    observacoes: z.string().optional(),
  }),
});

export const updateLocalizacaoSchema = z.object({
  params: z.object({
    codigoCarga: z.string().min(1, 'Código de carga é obrigatório'),
  }),
  body: z.object({
    localTexto: z.string().min(1, 'Localização é obrigatória'),
  }),
});

export const codigoCargaParamSchema = z.object({
  params: z.object({
    codigoCarga: z.string().min(1, 'Código de carga é obrigatório'),
  }),
});

export const statusParamSchema = z.object({
  params: z.object({
    status: z.enum(['INICIADA', 'EM_TRANSITO', 'TRANSBORDO', 'ENTREGUE', 'CANCELADA'], {
      errorMap: () => ({ message: 'Status inválido' }),
    }),
  }),
});

export const viagemFiltersSchema = z.object({
  query: z.object({
    clienteId: z.string().uuid().optional(),
    operadorId: z.string().uuid().optional(),
    status: z.enum(['INICIADA', 'EM_TRANSITO', 'TRANSBORDO', 'ENTREGUE', 'CANCELADA']).optional(),
    dataSaidaInicio: z.string().datetime().optional(),
    dataSaidaFim: z.string().datetime().optional(),
    previsaoEntregaInicio: z.string().datetime().optional(),
    previsaoEntregaFim: z.string().datetime().optional(),
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    pageSize: z.string().regex(/^\d+$/).transform(Number).optional(),
    sortBy: z.string().optional(),
    sortDir: z.enum(['asc', 'desc']).optional(),
  }),
});

export const createHistoricoManualSchema = z.object({
  params: z.object({
    codigoCarga: z.string().min(1, 'Código de carga é obrigatório'),
  }),
  body: z.object({
    status: z.enum(['INICIADA', 'EM_TRANSITO', 'TRANSBORDO', 'ENTREGUE', 'CANCELADA'], {
      errorMap: () => ({ message: 'Status inválido' }),
    }),
    localTexto: z.string().min(1, 'Localização é obrigatória'),
    observacoes: z.string().optional(),
    ocorridoEm: z.string().datetime().optional(),
  }),
});
