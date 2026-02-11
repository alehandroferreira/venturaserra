import { OperadorRepository } from '@application/ports/repositories';
import { Operador } from '@domain/entities';
import { prisma } from '../database/prisma-client';

export class OperadorRepositoryImpl implements OperadorRepository {
  async create(data: Omit<Operador, 'id' | 'createdAt' | 'updatedAt'>): Promise<Operador> {
    return prisma.operador.create({
      data: {
        nome: data.nome,
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role,
      },
    }) as Promise<Operador>;
  }

  async findById(id: string): Promise<Operador | null> {
    return prisma.operador.findUnique({
      where: { id },
    }) as Promise<Operador | null>;
  }

  async findByEmail(email: string): Promise<Operador | null> {
    return prisma.operador.findUnique({
      where: { email },
    }) as Promise<Operador | null>;
  }

  async findAll(): Promise<Operador[]> {
    return prisma.operador.findMany() as Promise<Operador[]>;
  }

  async update(id: string, data: Partial<Operador>): Promise<Operador> {
    return prisma.operador.update({
      where: { id },
      data: {
        nome: data.nome,
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role,
      },
    }) as Promise<Operador>;
  }

  async delete(id: string): Promise<void> {
    await prisma.operador.delete({
      where: { id },
    });
  }
}
