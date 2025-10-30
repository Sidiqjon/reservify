import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { EventsRepository } from '../infrastructure/events.repository';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(private readonly eventsRepo: EventsRepository) {}

  async create(dto: CreateEventDto) {
    // business rule: totalSeats must be integer >= 0 (validated in DTO)
    const created = await this.eventsRepo.create({
      name: dto.name.trim(),
      totalSeats: dto.totalSeats,
    });
    return created;
  }

  async findAll(options: { page?: number; limit?: number; search?: string }) {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? Math.min(options.limit, 100) : 10;
    const skip = (page - 1) * limit;

    const { items, total } = await this.eventsRepo.findAll({
      skip,
      take: limit,
      search: options.search?.trim(),
    });

    const pages = Math.ceil(total / limit) || 1;

    return {
      meta: {
        total,
        page,
        limit,
        pages,
      },
      data: items,
    };
  }

  async findOne(id: number) {
    const event = await this.eventsRepo.findById(id);
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async update(id: number, dto: UpdateEventDto) {
    // ensure event exists
    const event = await this.eventsRepo.findById(id);
    if (!event) throw new NotFoundException('Event not found');

    // if trying to reduce totalSeats, ensure it is not less than already booked seats
    if (dto.totalSeats !== undefined) {
      const booked = await this.eventsRepo.countBookingsForEvent(id);
      if (dto.totalSeats < booked) {
        throw new BadRequestException(
          `Cannot set totalSeats to ${dto.totalSeats} because ${booked} seats are already booked`,
        );
      }
    }

    const updated = await this.eventsRepo.update(id, {
      name: dto.name !== undefined ? dto.name.trim() : undefined,
      totalSeats: dto.totalSeats,
    });

    return updated;
  }

  async remove(id: number) {
    // ensure event exists
    const event = await this.eventsRepo.findById(id);
    if (!event) throw new NotFoundException('Event not found');

    // Removing will cascade bookings (as per Prisma schema)
    await this.eventsRepo.remove(id);
    return { success: true };
  }
}
