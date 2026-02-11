import { Request, Response } from 'express';
import { AuthController } from './auth-controller';
import { AuthUseCases } from '@application/use-cases/auth/auth-use-cases';

describe('AuthController', () => {
  const makeResponse = (): Response => {
    const res: Partial<Response> = {
      json: jest.fn(),
    };
    return res as Response;
  };

  it('calls login use case and returns result', async () => {
    const authUseCases = {
      login: jest.fn().mockResolvedValue({ token: 'jwt' }),
    } as unknown as AuthUseCases;

    const controller = new AuthController(authUseCases);
    const req = { body: { email: 'user@local.com', password: '123456' } } as Request;
    const res = makeResponse();

    await controller.login(req, res);

    expect(authUseCases.login).toHaveBeenCalledWith(req.body);
    expect(res.json).toHaveBeenCalledWith({ token: 'jwt' });
  });
});
