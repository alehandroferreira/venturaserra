import { Router } from 'express';
import { ClienteController } from '../controllers/cliente-controller';
import { validateRequest } from '../middlewares/validation-middleware';
import { authMiddleware } from '../middlewares/auth-middleware';
import {
  createClienteSchema,
  updateClienteSchema,
  idParamSchema,
} from '../validators/cliente-validators';
import { AuthUseCases } from '@application/use-cases/auth/auth-use-cases';

export function createClienteRoutes(
  clienteController: ClienteController,
  authUseCases: AuthUseCases,
): Router {
  const router = Router();

  /**
   * @swagger
   * /clientes:
   *   get:
   *     summary: Lista todos os clientes
   *     tags: [Clientes]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - $ref: '#/components/parameters/AuthorizationHeader'
   *     responses:
   *       200:
   *         description: Lista de clientes
   */
  router.get('/', authMiddleware(authUseCases), clienteController.findAll);

  /**
   * @swagger
   * /clientes/{id}:
   *   get:
   *     summary: Busca cliente por ID
   *     tags: [Clientes]
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
   *         description: Cliente encontrado
   *       404:
   *         description: Cliente não encontrado
   */
  router.get(
    '/:id',
    authMiddleware(authUseCases),
    validateRequest(idParamSchema),
    clienteController.findById,
  );

  /**
   * @swagger
   * /clientes:
   *   post:
   *     summary: Cria novo cliente
   *     tags: [Clientes]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - $ref: '#/components/parameters/AuthorizationHeader'
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateClienteRequest'
   *     responses:
   *       201:
   *         description: Cliente criado
   */
  router.post(
    '/',
    authMiddleware(authUseCases),
    validateRequest(createClienteSchema),
    clienteController.create,
  );

  /**
   * @swagger
   * /clientes/{id}:
   *   put:
   *     summary: Atualiza cliente
   *     tags: [Clientes]
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
   *             $ref: '#/components/schemas/UpdateClienteRequest'
   *     responses:
   *       200:
   *         description: Cliente atualizado
   */
  router.put(
    '/:id',
    authMiddleware(authUseCases),
    validateRequest(updateClienteSchema),
    clienteController.update,
  );

  /**
   * @swagger
   * /clientes/{id}:
   *   delete:
   *     summary: Remove cliente
   *     tags: [Clientes]
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
   *         description: Cliente removido
   */
  router.delete(
    '/:id',
    authMiddleware(authUseCases),
    validateRequest(idParamSchema),
    clienteController.delete,
  );

  return router;
}
