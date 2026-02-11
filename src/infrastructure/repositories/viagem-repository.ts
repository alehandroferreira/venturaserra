import {
  ViagemRepository,
  ViagemFilters,
  PaginationParams,
  PaginatedResult,
} from '@application/ports/repositories';
import { Viagem } from '@domain/entities';
import { StatusViagem } from '@domain/enums';
import { prisma } from '../database/prisma-client';

type PrismaViagem = NonNullable<Awaited<ReturnType<typeof prisma.viagem.findUnique>>>;

export class ViagemRepositoryImpl implements ViagemRepository {
  async create(data: Omit<Viagem, 'id' | 'createdAt' | 'updatedAt'>): Promise<Viagem> {
    const created = await prisma.viagem.create({
      data: {
        codigoCarga: data.codigoCarga,
        origemTexto: data.origem.texto,
        origemCidade: data.origem.cidade,
        origemPais: data.origem.pais,
        origemLat: data.origem.lat,
        origemLng: data.origem.lng,
        destinoTexto: data.destino.texto,
        destinoCidade: data.destino.cidade,
        destinoPais: data.destino.pais,
        destinoLat: data.destino.lat,
        destinoLng: data.destino.lng,
        dataSaida: data.dataSaida,
        previsaoEntrega: data.previsaoEntrega,
        clienteId: data.clienteId,
        operadorId: data.operadorId,
        statusAtual: data.statusAtual,
        localAtualTexto: data.localAtual?.texto,
        localAtualLat: data.localAtual?.lat,
        localAtualLng: data.localAtual?.lng,
      },
    });

    return this.mapToDomain(created);
  }

  async findById(id: string): Promise<Viagem | null> {
    const viagem = await prisma.viagem.findUnique({
      where: { id },
    });

    return viagem ? this.mapToDomain(viagem) : null;
  }

  async findByCodigoCarga(codigoCarga: string): Promise<Viagem | null> {
    const viagem = await prisma.viagem.findUnique({
      where: { codigoCarga },
    });

    return viagem ? this.mapToDomain(viagem) : null;
  }

  async findAll(
    filters?: ViagemFilters,
    pagination?: PaginationParams,
  ): Promise<PaginatedResult<Viagem>> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (filters?.clienteId) where.clienteId = filters.clienteId;
    if (filters?.operadorId) where.operadorId = filters.operadorId;
    if (filters?.status) where.statusAtual = filters.status;

    if (filters?.dataSaidaInicio || filters?.dataSaidaFim) {
      where.dataSaida = {};
      if (filters.dataSaidaInicio) where.dataSaida.gte = filters.dataSaidaInicio;
      if (filters.dataSaidaFim) where.dataSaida.lte = filters.dataSaidaFim;
    }

    if (filters?.previsaoEntregaInicio || filters?.previsaoEntregaFim) {
      where.previsaoEntrega = {};
      if (filters.previsaoEntregaInicio)
        where.previsaoEntrega.gte = filters.previsaoEntregaInicio;
      if (filters.previsaoEntregaFim) where.previsaoEntrega.lte = filters.previsaoEntregaFim;
    }

    const page = pagination?.page || 1;
    const pageSize = pagination?.pageSize || 10;
    const skip = (page - 1) * pageSize;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orderBy: any = {};
    if (pagination?.sortBy) {
      orderBy[pagination.sortBy] = pagination.sortDir || 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [data, total] = await Promise.all([
      prisma.viagem.findMany({
        where,
        skip,
        take: pageSize,
        orderBy,
      }),
      prisma.viagem.count({ where }),
    ]);

    return {
      data: data.map((v: PrismaViagem) => this.mapToDomain(v)),
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async findByStatus(status: StatusViagem): Promise<Viagem[]> {
    const viagens = await prisma.viagem.findMany({
      where: { statusAtual: status },
    });

    return viagens.map((v: PrismaViagem) => this.mapToDomain(v));
  }

  async update(id: string, data: Partial<Viagem>): Promise<Viagem> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};

    if (data.statusAtual) updateData.statusAtual = data.statusAtual;
    if (data.localAtual) {
      updateData.localAtualTexto = data.localAtual.texto;
      updateData.localAtualLat = data.localAtual.lat;
      updateData.localAtualLng = data.localAtual.lng;
    }

    const updated = await prisma.viagem.update({
      where: { id },
      data: updateData,
    });

    return this.mapToDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await prisma.viagem.delete({
      where: { id },
    });
  }

  private mapToDomain(prismaViagem: PrismaViagem): Viagem {
    return {
      id: prismaViagem.id,
      codigoCarga: prismaViagem.codigoCarga,
      origem: {
        texto: prismaViagem.origemTexto,
        cidade: prismaViagem.origemCidade || undefined,
        pais: prismaViagem.origemPais || undefined,
        lat: prismaViagem.origemLat || undefined,
        lng: prismaViagem.origemLng || undefined,
      },
      destino: {
        texto: prismaViagem.destinoTexto,
        cidade: prismaViagem.destinoCidade || undefined,
        pais: prismaViagem.destinoPais || undefined,
        lat: prismaViagem.destinoLat || undefined,
        lng: prismaViagem.destinoLng || undefined,
      },
      dataSaida: prismaViagem.dataSaida,
      previsaoEntrega: prismaViagem.previsaoEntrega,
      clienteId: prismaViagem.clienteId,
      operadorId: prismaViagem.operadorId,
      statusAtual: prismaViagem.statusAtual as StatusViagem,
      localAtual: prismaViagem.localAtualTexto
        ? {
            texto: prismaViagem.localAtualTexto,
            lat: prismaViagem.localAtualLat || undefined,
            lng: prismaViagem.localAtualLng || undefined,
          }
        : undefined,
      createdAt: prismaViagem.createdAt,
      updatedAt: prismaViagem.updatedAt,
    };
  }
}
