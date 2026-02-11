import { Router } from 'express';
import { AuthController } from '../controllers/auth-controller';
import { validateRequest } from '../middlewares/validation-middleware';
import { loginSchema } from '../validators/auth-validators';

export function createAuthRoutes(authController: AuthController): Router {
  const router = Router();

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Realiza login e retorna JWT
   *     tags: [Autenticação]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginRequest'
   *     responses:
   *       200:
   *         description: Login bem-sucedido
   *       401:
   *         description: Credenciais inválidas
   */
  router.post('/login', validateRequest(loginSchema), authController.login);

  return router;
}
