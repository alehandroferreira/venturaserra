import { Router } from 'express';
import { OperadorController } from '../controllers/operador-controller';
import { validateRequest } from '../middlewares/validation-middleware';
import { authMiddleware, requireRole } from '../middlewares/auth-middleware';
import { createOperadorSchema, updateOperadorSchema } from '../validators/auth-validators';
import { idParamSchema } from '../validators/cliente-validators';
import { AuthUseCases } from '@application/use-cases/auth/auth-use-cases';
import { Role } from '@domain/enums';

export function createOperadorRoutes(
  operadorController: OperadorController,
  authUseCases: AuthUseCases,
): Router {
  const router = Router();

  /**
   * @swagger
   * /operadores:
   *   get:
   *     summary: Lista todos os operadores
   *     tags: [Operadores]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - $ref: '#/components/parameters/AuthorizationHeader'
   *     responses:
   *       200:
   *         description: Lista de operadores
   */
  router.get('/', authMiddleware(authUseCases), operadorController.findAll);

  /**
   * @swagger
   * /operadores/{id}:
   *   get:
   *     summary: Busca operador por ID
   *     tags: [Operadores]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - $ref: '#/components/parameters/AuthorizationHeader'
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: Operador encontrado
   */
  router.get(
    '/:id',
    authMiddleware(authUseCases),
    validateRequest(idParamSchema),
    operadorController.findById,
  );

  /**
   * @swagger
   * /operadores:
   *   post:
   *     summary: Cria novo operador (apenas ADMIN)
   *     tags: [Operadores]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - $ref: '#/components/parameters/AuthorizationHeader'
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateOperadorRequest'
   *     responses:
   *       201:
   *         description: Operador criado
   */
  router.post(
    '/',
    authMiddleware(authUseCases),
    requireRole(Role.ADMIN),
    validateRequest(createOperadorSchema),
    operadorController.create,
  );

  /**
   * @swagger
   * /operadores/{id}:
   *   put:
   *     summary: Atualiza operador
   *     tags: [Operadores]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - $ref: '#/components/parameters/AuthorizationHeader'
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateOperadorRequest'
   *     responses:
   *       200:
   *         description: Operador atualizado
   */
  router.put(
    '/:id',
    authMiddleware(authUseCases),
    validateRequest(updateOperadorSchema),
    operadorController.update,
  );

  /**
   * @swagger
   * /operadores/{id}:
   *   delete:
   *     summary: Remove operador (apenas ADMIN)
   *     tags: [Operadores]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - $ref: '#/components/parameters/AuthorizationHeader'
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       204:
   *         description: Operador removido
   */
  router.delete(
    '/:id',
    authMiddleware(authUseCases),
    requireRole(Role.ADMIN),
    validateRequest(idParamSchema),
    operadorController.delete,
  );

  return router;
}
