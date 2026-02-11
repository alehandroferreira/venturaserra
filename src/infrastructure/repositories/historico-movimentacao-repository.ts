import { HistoricoMovimentacaoRepository } from '@application/ports/repositories';
import { HistoricoMovimentacao } from '@domain/entities';
import { prisma } from '../database/prisma-client';

export class HistoricoMovimentacaoRepositoryImpl
  implements HistoricoMovimentacaoRepository
{
  async create(
    data: Omit<HistoricoMovimentacao, 'id'>,
  ): Promise<HistoricoMovimentacao> {
    return prisma.historicoMovimentacao.create({
      data: {
        viagemId: data.viagemId,
        status: data.status,
        localTexto: data.localTexto,
        lat: data.lat,
        lng: data.lng,
        observacoes: data.observacoes,
        ocorridoEm: data.ocorridoEm,
      },
    }) as Promise<HistoricoMovimentacao>;
  }

  async findByViagemId(viagemId: string): Promise<HistoricoMovimentacao[]> {
    return prisma.historicoMovimentacao.findMany({
      where: { viagemId },
      orderBy: { ocorridoEm: 'desc' },
    }) as Promise<HistoricoMovimentacao[]>;
  }

  async findAll(): Promise<HistoricoMovimentacao[]> {
    return prisma.historicoMovimentacao.findMany({
      orderBy: { ocorridoEm: 'desc' },
    }) as Promise<HistoricoMovimentacao[]>;
  }
}
