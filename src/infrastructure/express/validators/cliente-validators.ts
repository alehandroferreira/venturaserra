import { z } from 'zod';

export const createClienteSchema = z.object({
  body: z.object({
    nome: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().email('Email inválido').optional(),
    telefone: z.string().optional(),
  }),
});

export const updateClienteSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido'),
  }),
  body: z.object({
    nome: z.string().min(1).optional(),
    email: z.string().email().optional(),
    telefone: z.string().optional(),
  }),
});

export const idParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido'),
  }),
});
