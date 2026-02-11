import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Rastreamento de Cargas',
      version: '1.0.0',
      description:
        'API RESTful para gerenciar clientes, operadores e rastreamento de cargas com histórico de movimentações',
      contact: {
        name: 'Suporte',
        email: 'suporte@rastreamento.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      parameters: {
        AuthorizationHeader: {
          name: 'Authorization',
          in: 'header',
          required: true,
          description: 'Bearer token no formato: Bearer <token>',
          schema: { type: 'string' },
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'object',
              properties: {
                code: { type: 'string' },
                message: { type: 'string' },
                details: { type: 'object' },
              },
            },
          },
        },
        Cliente: {
          type: 'object',
          required: ['nome'],
          properties: {
            id: { type: 'string', format: 'uuid' },
            nome: { type: 'string' },
            email: { type: 'string', format: 'email' },
            telefone: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Operador: {
          type: 'object',
          required: ['nome', 'email'],
          properties: {
            id: { type: 'string', format: 'uuid' },
            nome: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['ADMIN', 'OPERATOR'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Viagem: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            codigoCarga: { type: 'string' },
            origem: { $ref: '#/components/schemas/Localizacao' },
            destino: { $ref: '#/components/schemas/Localizacao' },
            dataSaida: { type: 'string', format: 'date-time' },
            previsaoEntrega: { type: 'string', format: 'date-time' },
            clienteId: { type: 'string', format: 'uuid' },
            operadorId: { type: 'string', format: 'uuid' },
            statusAtual: {
              type: 'string',
              enum: ['INICIADA', 'EM_TRANSITO', 'TRANSBORDO', 'ENTREGUE', 'CANCELADA'],
            },
            localAtual: { $ref: '#/components/schemas/Localizacao' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Localizacao: {
          type: 'object',
          properties: {
            texto: { type: 'string' },
            cidade: { type: 'string' },
            pais: { type: 'string' },
            lat: { type: 'number' },
            lng: { type: 'number' },
          },
        },
        HistoricoMovimentacao: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            viagemId: { type: 'string', format: 'uuid' },
            status: {
              type: 'string',
              enum: ['INICIADA', 'EM_TRANSITO', 'TRANSBORDO', 'ENTREGUE', 'CANCELADA'],
            },
            ocorridoEm: { type: 'string', format: 'date-time' },
            localTexto: { type: 'string' },
            lat: { type: 'number' },
            lng: { type: 'number' },
            observacoes: { type: 'string' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
        },
        CreateOperadorRequest: {
          type: 'object',
          required: ['nome', 'email', 'password'],
          properties: {
            nome: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
            role: { type: 'string', enum: ['ADMIN', 'OPERATOR'] },
          },
        },
        UpdateOperadorRequest: {
          type: 'object',
          properties: {
            nome: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
            role: { type: 'string', enum: ['ADMIN', 'OPERATOR'] },
          },
        },
        CreateClienteRequest: {
          type: 'object',
          required: ['nome'],
          properties: {
            nome: { type: 'string' },
            email: { type: 'string', format: 'email' },
            telefone: { type: 'string' },
          },
        },
        UpdateClienteRequest: {
          type: 'object',
          properties: {
            nome: { type: 'string' },
            email: { type: 'string', format: 'email' },
            telefone: { type: 'string' },
          },
        },
        CreateViagemRequest: {
          type: 'object',
          required: [
            'codigoCarga',
            'origemTexto',
            'destinoTexto',
            'dataSaida',
            'previsaoEntrega',
            'clienteId',
            'operadorId',
          ],
          properties: {
            codigoCarga: { type: 'string' },
            origemTexto: { type: 'string' },
            destinoTexto: { type: 'string' },
            dataSaida: { type: 'string', format: 'date-time' },
            previsaoEntrega: { type: 'string', format: 'date-time' },
            clienteId: { type: 'string', format: 'uuid' },
            operadorId: { type: 'string', format: 'uuid' },
          },
        },
        UpdateStatusRequest: {
          type: 'object',
          required: ['status', 'localTexto'],
          properties: {
            status: {
              type: 'string',
              enum: ['INICIADA', 'EM_TRANSITO', 'TRANSBORDO', 'ENTREGUE', 'CANCELADA'],
            },
            localTexto: { type: 'string' },
            observacoes: { type: 'string' },
          },
        },
        UpdateLocalizacaoRequest: {
          type: 'object',
          required: ['localTexto'],
          properties: {
            localTexto: { type: 'string' },
          },
        },
        CreateHistoricoManualRequest: {
          type: 'object',
          required: ['status', 'localTexto'],
          properties: {
            status: {
              type: 'string',
              enum: ['INICIADA', 'EM_TRANSITO', 'TRANSBORDO', 'ENTREGUE', 'CANCELADA'],
            },
            localTexto: { type: 'string' },
            observacoes: { type: 'string' },
            ocorridoEm: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    tags: [
      { name: 'Autenticação', description: 'Endpoints de autenticação' },
      { name: 'Clientes', description: 'Gerenciamento de clientes' },
      { name: 'Operadores', description: 'Gerenciamento de operadores' },
      { name: 'Tracking', description: 'Rastreamento de cargas' },
      { name: 'Histórico', description: 'Histórico de movimentações' },
    ],
  },
  apis: ['./src/infrastructure/express/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
