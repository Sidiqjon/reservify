import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';

@Injectable()
export class BookingsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(txClient: any, data: { eventId: number; userId: string }) {
    const client = txClient ?? this.prisma;
    return client.booking.create({
      data: {
        eventId: data.eventId,
        userId: data.userId,
      },
    });
  }

  async findByEventAndUser(eventId: number, userId: string) {
    return this.prisma.booking.findFirst({
      where: { eventId, userId },
    });
  }

  async countByEvent(eventId: number) {
    return this.prisma.booking.count({ where: { eventId } });
  }

  async findById(id: number) {
    return this.prisma.booking.findUnique({ where: { id } });
  }

  async remove(id: number) {
    return this.prisma.booking.delete({ where: { id } });
  }

  async findAll(params: { skip?: number; take?: number; eventId?: number; userId?: string }) {
    const where: any = {};
    if (params.eventId) where.eventId = params.eventId;
    if (params.userId) where.userId = params.userId;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.booking.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.booking.count({ where }),
    ]);

    return { items, total };
  }
}
