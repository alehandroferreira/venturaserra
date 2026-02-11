import { ClienteRepository } from '@application/ports/repositories';
import { Cliente } from '@domain/entities';
import { prisma } from '../database/prisma-client';

export class ClienteRepositoryImpl implements ClienteRepository {
  async create(data: Omit<Cliente, 'id' | 'createdAt' | 'updatedAt'>): Promise<Cliente> {
    return prisma.cliente.create({
      data: {
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
      },
    }) as Promise<Cliente>;
  }

  async findById(id: string): Promise<Cliente | null> {
    return prisma.cliente.findUnique({
      where: { id },
    }) as Promise<Cliente | null>;
  }

  async findAll(): Promise<Cliente[]> {
    return prisma.cliente.findMany() as Promise<Cliente[]>;
  }

  async update(id: string, data: Partial<Cliente>): Promise<Cliente> {
    return prisma.cliente.update({
      where: { id },
      data: {
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
      },
    }) as Promise<Cliente>;
  }

  async delete(id: string): Promise<void> {
    await prisma.cliente.delete({
      where: { id },
    });
  }
}
