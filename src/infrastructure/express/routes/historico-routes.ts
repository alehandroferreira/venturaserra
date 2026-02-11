import { Router } from 'express';
import { HistoricoController } from '../controllers/historico-controller';
import { validateRequest } from '../middlewares/validation-middleware';
import { authMiddleware, requireRole } from '../middlewares/auth-middleware';
import { createHistoricoManualSchema } from '../validators/tracking-validators';
import { AuthUseCases } from '@application/use-cases/auth/auth-use-cases';
import { Role } from '@domain/enums';

export function createHistoricoRoutes(
  historicoController: HistoricoController,
  authUseCases: AuthUseCases,
): Router {
  const router = Router();

  /**
   * @swagger
   * /historico:
   *   get:
   *     summary: Lista todos os históricos (apenas ADMIN)
   *     tags: [Histórico]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - $ref: '#/components/parameters/AuthorizationHeader'
   *     responses:
   *       200:
   *         description: Lista de históricos
   */
  router.get(
    '/',
    authMiddleware(authUseCases),
    requireRole(Role.ADMIN),
    historicoController.findAll,
  );

  /**
   * @swagger
   * /historico/{codigoCarga}:
   *   post:
   *     summary: Cria histórico manual (apenas ADMIN)
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
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateHistoricoManualRequest'
   *     responses:
   *       201:
   *         description: Histórico criado
   */
  router.post(
    '/:codigoCarga',
    authMiddleware(authUseCases),
    requireRole(Role.ADMIN),
    validateRequest(createHistoricoManualSchema),
    historicoController.createManual,
  );

  return router;
}
