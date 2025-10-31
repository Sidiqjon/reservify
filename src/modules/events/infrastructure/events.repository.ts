import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { CreateEventDto } from '../dto/create-event.dto';

@Injectable()
export class EventsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { name: string; totalSeats: number }) {
    return this.prisma.event.create({
      data: {
        name: data.name,
        totalSeats: data.totalSeats,
      },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    search?: string | undefined;
  }) {
    const where: Prisma.EventWhereInput = params.search
      ? {
          name: {
            contains: params.search,
            mode: Prisma.QueryMode.insensitive, 
          },
        }
      : {};

    const [items, total] = await this.prisma.$transaction([
      this.prisma.event.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { id: 'desc' },
      }),
      this.prisma.event.count({ where }),
    ]);

    return { items, total };
  }

  async findById(id: number) {
    return this.prisma.event.findUnique({ where: { id } });
  }

  async update(id: number, data: { name?: string; totalSeats?: number }) {
    return this.prisma.event.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.totalSeats !== undefined ? { totalSeats: data.totalSeats } : {}),
      },
    });
  }

  async remove(id: number) {
    return this.prisma.event.delete({ where: { id } });
  }

  async countBookingsForEvent(eventId: number) {
    return this.prisma.booking.count({ where: { eventId } });
  }
}
