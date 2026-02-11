import dotenv from 'dotenv';
import { createApp } from '@infrastructure/express/app';
import { PinoLogger } from '@infrastructure/logging/pino-logger';
import { ClienteRepositoryImpl } from '@infrastructure/repositories/cliente-repository';
import { OperadorRepositoryImpl } from '@infrastructure/repositories/operador-repository';
import { ViagemRepositoryImpl } from '@infrastructure/repositories/viagem-repository';
import { HistoricoMovimentacaoRepositoryImpl } from '@infrastructure/repositories/historico-movimentacao-repository';
import { NominatimGeocodingService } from '@infrastructure/external/nominatim-geocoding-service';
import { ClienteUseCases } from '@application/use-cases/clientes/cliente-use-cases';
import { OperadorUseCases } from '@application/use-cases/operadores/operador-use-cases';
import { AuthUseCases } from '@application/use-cases/auth/auth-use-cases';
import { RegisterCargaUseCase } from '@application/use-cases/tracking/register-carga-use-case';
import { CreateHistoricoUseCase } from '@application/use-cases/historico/create-historico-use-case';
import { UpdateStatusUseCase } from '@application/use-cases/tracking/update-status-use-case';
import { UpdateLocalizacaoUseCase } from '@application/use-cases/tracking/update-localizacao-use-case';
import { MarcarEntregaUseCase } from '@application/use-cases/tracking/marcar-entrega-use-case';
import { TrackingUseCases } from '@application/use-cases/tracking/tracking-use-cases';
import { HistoricoUseCases } from '@application/use-cases/historico/historico-use-cases';

// Carrega variáveis de ambiente
dotenv.config();

// Configurações
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET não configurado. Defina a variável de ambiente JWT_SECRET.');
}
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const GEOCODING_USER_AGENT = process.env.GEOCODING_USER_AGENT || 'RastreamentoCargas/1.0';
const GEOCODING_CACHE_TTL = parseInt(process.env.GEOCODING_CACHE_TTL || '3600000', 10);

// Logger
const logger = new PinoLogger();

// Repositories
const clienteRepository = new ClienteRepositoryImpl();
const operadorRepository = new OperadorRepositoryImpl();
const viagemRepository = new ViagemRepositoryImpl();
const historicoRepository = new HistoricoMovimentacaoRepositoryImpl();

// External Services
const geocodingService = new NominatimGeocodingService(logger, GEOCODING_USER_AGENT, GEOCODING_CACHE_TTL);

// Use Cases
const createHistoricoUseCase = new CreateHistoricoUseCase(historicoRepository, logger);

const clienteUseCases = new ClienteUseCases(clienteRepository, logger);

const operadorUseCases = new OperadorUseCases(operadorRepository, logger);

const authUseCases = new AuthUseCases(operadorRepository, logger, JWT_SECRET, JWT_EXPIRES_IN);

const registerCargaUseCase = new RegisterCargaUseCase(
  viagemRepository,
  clienteRepository,
  operadorRepository,
  geocodingService,
  createHistoricoUseCase,
  logger,
);

const updateStatusUseCase = new UpdateStatusUseCase(
  viagemRepository,
  geocodingService,
  createHistoricoUseCase,
  logger,
);

const updateLocalizacaoUseCase = new UpdateLocalizacaoUseCase(
  viagemRepository,
  geocodingService,
  logger,
);

const marcarEntregaUseCase = new MarcarEntregaUseCase(
  viagemRepository,
  createHistoricoUseCase,
  logger,
);

const trackingUseCases = new TrackingUseCases(
  viagemRepository,
  clienteRepository,
  operadorRepository,
  historicoRepository,
  logger,
);

const historicoUseCases = new HistoricoUseCases(historicoRepository, viagemRepository, logger);

// Criar aplicação
const app = createApp({
  clienteUseCases,
  operadorUseCases,
  authUseCases,
  registerCargaUseCase,
  updateStatusUseCase,
  updateLocalizacaoUseCase,
  marcarEntregaUseCase,
  trackingUseCases,
  historicoUseCases,
  logger,
});

// Iniciar servidor
app.listen(PORT, () => {
  logger.info(`🚀 Servidor rodando na porta ${PORT}`);
  logger.info(`📚 Documentação Swagger disponível em http://localhost:${PORT}/docs`);
  logger.info(`💚 Health check disponível em http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM recebido, encerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT recebido, encerrando servidor...');
  process.exit(0);
});
