import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { BookingsRepository } from '../infrastructure/bookings.repository';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { ReserveBookingDto } from '../dto/reserve-booking.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'; 
import { ListBookingsDto } from '../dto/list-bookings.dto';


@Injectable()
export class BookingsService {
  constructor(
    private readonly bookingsRepo: BookingsRepository,
    private readonly prisma: PrismaService,
  ) {}

  async reserve(dto: ReserveBookingDto) {
    const eventId = dto.event_id;
    const userId = dto.user_id.trim();

    try {
      const result = await this.prisma.$transaction(async (tx) => {

        await tx.$executeRaw`SELECT id FROM "events" WHERE id = ${eventId} FOR UPDATE`;

        const event = await tx.event.findUnique({ where: { id: eventId } });
        if (!event) throw new NotFoundException('Event not found');

        const bookedCount = await tx.booking.count({ where: { eventId } });

        if (bookedCount >= event.totalSeats) {
          throw new BadRequestException('No seats available for this event');
        }

        const existing = await tx.booking.findFirst({ where: { eventId, userId } });
        if (existing) {
          throw new ConflictException('User already has a booking for this event');
        }

        const booking = await tx.booking.create({
          data: { eventId, userId },
        });

        return booking;
      }, { maxWait: 5000, timeout: 10000 }); 

      return result;

    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ConflictException('User already has a booking for this event');
      }
      if (err instanceof NotFoundException || err instanceof BadRequestException || err instanceof ConflictException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to reserve booking');
    }
  }

  async findAll(query: ListBookingsDto) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? Math.min(query.limit, 100) : 10;
    const skip = (page - 1) * limit;

    const { items, total } = await this.bookingsRepo.findAll({
      skip,
      take: limit,
      eventId: query.eventId,
      userId: query.userId,
    });

    const pages = Math.ceil(total / limit) || 1;

    return {
      meta: { total, page, limit, pages },
      data: items,
    };
  }

  async findOne(id: number) {
    const booking = await this.bookingsRepo.findById(id);
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async remove(id: number) {
    const booking = await this.bookingsRepo.findById(id);
    if (!booking) throw new NotFoundException('Booking not found');
    await this.bookingsRepo.remove(id);
    return booking;
  }
}