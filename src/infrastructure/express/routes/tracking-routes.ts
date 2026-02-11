import { Router } from 'express';
import { TrackingController } from '../controllers/tracking-controller';
import { HistoricoController } from '../controllers/historico-controller';
import { validateRequest } from '../middlewares/validation-middleware';
import { authMiddleware } from '../middlewares/auth-middleware';
import {
  createViagemSchema,
  updateStatusSchema,
  updateLocalizacaoSchema,
  codigoCargaParamSchema,
  statusParamSchema,
  viagemFiltersSchema,
} from '../validators/tracking-validators';
import { AuthUseCases } from '@application/use-cases/auth/auth-use-cases';

export function createTrackingRoutes(
  trackingController: TrackingController,
  historicoController: HistoricoController,
  authUseCases: AuthUseCases,
): Router {
  const router = Router();

  /**
   * @swagger
   * /tracking:
   *   post:
   *     summary: Registra nova carga
   *     tags: [Tracking]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - $ref: '#/components/parameters/AuthorizationHeader'
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateViagemRequest'
   *     responses:
   *       201:
   *         description: Carga registrada
   */
  router.post(
    '/',
    authMiddleware(authUseCases),
    validateRequest(createViagemSchema),
    trackingController.create,
  );

  /**
   * @swagger
   * /tracking:
   *   get:
   *     summary: Lista cargas com filtros e paginação
   *     tags: [Tracking]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - $ref: '#/components/parameters/AuthorizationHeader'
   *       - in: query
   *         name: clienteId
   *         schema:
   *           type: string
   *           format: uuid
   *       - in: query
   *         name: operadorId
   *         schema:
   *           type: string
   *           format: uuid
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [INICIADA, EM_TRANSITO, TRANSBORDO, ENTREGUE, CANCELADA]
   *       - in: query
   *         name: dataSaidaInicio
   *         schema:
   *           type: string
   *           format: date-time
   *       - in: query
   *         name: dataSaidaFim
   *         schema:
   *           type: string
   *           format: date-time
   *       - in: query
   *         name: previsaoEntregaInicio
   *         schema:
   *           type: string
   *           format: date-time
   *       - in: query
   *         name: previsaoEntregaFim
   *         schema:
   *           type: string
   *           format: date-time
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *       - in: query
   *         name: pageSize
   *         schema:
   *           type: integer
   *           minimum: 1
   *       - in: query
   *         name: sortBy
   *         schema:
   *           type: string
   *       - in: query
   *         name: sortDir
   *         schema:
   *           type: string
   *           enum: [asc, desc]
   *     responses:
   *       200:
   *         description: Lista de cargas
   */
  router.get(
    '/',
    authMiddleware(authUseCases),
    validateRequest(viagemFiltersSchema),
    trackingController.findAll,
  );

  /**
   * @swagger
   * /tracking/{codigoCarga}:
   *   get:
   *     summary: Busca carga por código com detalhes completos
   *     tags: [Tracking]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - $ref: '#/components/parameters/AuthorizationHeader'
   *       - in: path
   *         name: codigoCarga
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Carga encontrada com cliente, operador e histórico
   */
  router.get(
    '/:codigoCarga',
    authMiddleware(authUseCases),
    validateRequest(codigoCargaParamSchema),
    trackingController.findByCodigoCarga,
  );

  /**
   * @swagger
   * /tracking/{codigoCarga}/status:
   *   put:
   *     summary: Atualiza status da carga
   *     tags: [Tracking]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - $ref: '#/components/parameters/AuthorizationHeader'
   *       - in: path
   *         name: codigoCarga
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateStatusRequest'
   *     responses:
   *       200:
   *         description: Status atualizado
   */
  router.put(
    '/:codigoCarga/status',
    authMiddleware(authUseCases),
    validateRequest(updateStatusSchema),
    trackingController.updateStatus,
  );

  /**
   * @swagger
   * /tracking/{codigoCarga}/localizacao:
   *   put:
   *     summary: Atualiza localização da carga
   *     tags: [Tracking]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - $ref: '#/components/parameters/AuthorizationHeader'
   *       - in: path
   *         name: codigoCarga
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateLocalizacaoRequest'
   *     responses:
   *       200:
   *         description: Localização atualizada
   */
  router.put(
    '/:codigoCarga/localizacao',
    authMiddleware(authUseCases),
    validateRequest(updateLocalizacaoSchema),
    trackingController.updateLocalizacao,
  );

  /**
   * @swagger
   * /tracking/{codigoCarga}/entrega:
   *   put:
   *     summary: Marca carga como entregue
   *     tags: [Tracking]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - $ref: '#/components/parameters/AuthorizationHeader'
   *       - in: path
   *         name: codigoCarga
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Carga marcada como entregue
   */
  router.put(
    '/:codigoCarga/entrega',
    authMiddleware(authUseCases),
    validateRequest(codigoCargaParamSchema),
    trackingController.marcarEntrega,
  );

  /**
   * @swagger
   * /tracking/status/{status}:
   *   get:
   *     summary: Lista cargas por status
   *     tags: [Tracking]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - $ref: '#/components/parameters/AuthorizationHeader'
   *       - in: path
   *         name: status
   *         required: true
   *         schema:
   *           type: string
   *           enum: [INICIADA, EM_TRANSITO, TRANSBORDO, ENTREGUE, CANCELADA]
   *     responses:
   *       200:
   *         description: Lista de cargas
   */
  router.get(
    '/status/:status',
    authMiddleware(authUseCases),
    validateRequest(statusParamSchema),
    trackingController.findByStatus,
  );

  /**
   * @swagger
   * /tracking/{codigoCarga}:
   *   delete:
   *     summary: Cancela carga
   *     tags: [Tracking]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - $ref: '#/components/parameters/AuthorizationHeader'
   *       - in: path
   *         name: codigoCarga
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       204:
   *         description: Carga cancelada
   */
  router.delete(
    '/:codigoCarga',
    authMiddleware(authUseCases),
    validateRequest(codigoCargaParamSchema),
    trackingController.delete,
  );

  /**
   * @swagger
   * /tracking/{codigoCarga}/historico:
   *   get:
   *     summary: Lista histórico da carga
   *     tags: [Histórico]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - $ref: '#/components/parameters/AuthorizationHeader'
   *       - in: path
   *         name: codigoCarga
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Histórico da carga
   */
  router.get(
    '/:codigoCarga/historico',
    authMiddleware(authUseCases),
    validateRequest(codigoCargaParamSchema),
    historicoController.findByCodigoCarga,
  );

  return router;
}
