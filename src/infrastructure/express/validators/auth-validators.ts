import { z } from 'zod';

export const createOperadorSchema = z.object({
  body: z.object({
    nome: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    role: z.enum(['ADMIN', 'OPERATOR']).optional(),
  }),
});

export const updateOperadorSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido'),
  }),
  body: z.object({
    nome: z.string().min(1).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    role: z.enum(['ADMIN', 'OPERATOR']).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'Senha é obrigatória'),
  }),
});
