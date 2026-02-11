import express, { Express } from 'express';
import cors from 'cors';
import 'express-async-errors';
import swaggerUi from 'swagger-ui-express';
import pinoHttp from 'pino-http';
import { PinoLogger } from '../logging/pino-logger';
import { errorHandler } from './middlewares/error-handler';
import { swaggerSpec } from './swagger';

// Use cases
import { ClienteUseCases } from '@application/use-cases/clientes/cliente-use-cases';
import { OperadorUseCases } from '@application/use-cases/operadores/operador-use-cases';
import { AuthUseCases } from '@application/use-cases/auth/auth-use-cases';
import { RegisterCargaUseCase } from '@application/use-cases/tracking/register-carga-use-case';
import { UpdateStatusUseCase } from '@application/use-cases/tracking/update-status-use-case';
import { UpdateLocalizacaoUseCase } from '@application/use-cases/tracking/update-localizacao-use-case';
import { MarcarEntregaUseCase } from '@application/use-cases/tracking/marcar-entrega-use-case';
import { TrackingUseCases } from '@application/use-cases/tracking/tracking-use-cases';
import { HistoricoUseCases } from '@application/use-cases/historico/historico-use-cases';

// Controllers
import { ClienteController } from './controllers/cliente-controller';
import { OperadorController } from './controllers/operador-controller';
import { AuthController } from './controllers/auth-controller';
import { TrackingController } from './controllers/tracking-controller';
import { HistoricoController } from './controllers/historico-controller';

// Routes
import { createClienteRoutes } from './routes/cliente-routes';
import { createOperadorRoutes } from './routes/operador-routes';
import { createAuthRoutes } from './routes/auth-routes';
import { createTrackingRoutes } from './routes/tracking-routes';
import { createHistoricoRoutes } from './routes/historico-routes';

export interface AppDependencies {
  clienteUseCases: ClienteUseCases;
  operadorUseCases: OperadorUseCases;
  authUseCases: AuthUseCases;
  registerCargaUseCase: RegisterCargaUseCase;
  updateStatusUseCase: UpdateStatusUseCase;
  updateLocalizacaoUseCase: UpdateLocalizacaoUseCase;
  marcarEntregaUseCase: MarcarEntregaUseCase;
  trackingUseCases: TrackingUseCases;
  historicoUseCases: HistoricoUseCases;
  logger: PinoLogger;
}

export function createApp(dependencies: AppDependencies): Express {
  const app = express();

  // Middlewares básicos
  app.use(cors());
  app.use(express.json());
  app.use(
    pinoHttp({
      logger: dependencies.logger.getHttpLogger(),
    }),
  );

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Swagger
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Controllers
  const clienteController = new ClienteController(dependencies.clienteUseCases);
  const operadorController = new OperadorController(dependencies.operadorUseCases);
  const authController = new AuthController(dependencies.authUseCases);
  const trackingController = new TrackingController(
    dependencies.registerCargaUseCase,
    dependencies.updateStatusUseCase,
    dependencies.updateLocalizacaoUseCase,
    dependencies.marcarEntregaUseCase,
    dependencies.trackingUseCases,
  );
  const historicoController = new HistoricoController(dependencies.historicoUseCases);

  // Routes
  app.use('/auth', createAuthRoutes(authController));
  app.use('/clientes', createClienteRoutes(clienteController, dependencies.authUseCases));
  app.use('/operadores', createOperadorRoutes(operadorController, dependencies.authUseCases));
  app.use(
    '/tracking',
    createTrackingRoutes(trackingController, historicoController, dependencies.authUseCases),
  );
  app.use('/historico', createHistoricoRoutes(historicoController, dependencies.authUseCases));

  // Error handler (deve ser o último middleware)
  app.use(errorHandler(dependencies.logger));

  return app;
}
