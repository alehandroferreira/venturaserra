import { Request, Response } from 'express';
import { AuthUseCases } from '@application/use-cases/auth/auth-use-cases';

export class AuthController {
  constructor(private readonly authUseCases: AuthUseCases) {}

  login = async (req: Request, res: Response) => {
    const result = await this.authUseCases.login(req.body);
    res.json(result);
  };
}
