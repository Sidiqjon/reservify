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
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'; // ✅ fix here
import { ListBookingsDto } from '../dto/list-bookings.dto';


@Injectable()
export class BookingsService {
  constructor(
    private readonly bookingsRepo: BookingsRepository,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Reserve a booking with concurrency-safety:
   * - start an interactive tx
   * - lock event row (SELECT FOR UPDATE)
   * - check event existence and seats
   * - check duplicate booking (optional double-check)
   * - create booking
   */
  async reserve(dto: ReserveBookingDto) {
    const eventId = dto.event_id;
    const userId = dto.user_id.trim();

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        // Lock the event row to avoid race conditions (prevent overbooking)
        // Note: using parameterized query to avoid SQL injection
        await tx.$executeRaw`SELECT id FROM "events" WHERE id = ${eventId} FOR UPDATE`;

        const event = await tx.event.findUnique({ where: { id: eventId } });
        if (!event) throw new NotFoundException('Event not found');

        // Count current bookings
        const bookedCount = await tx.booking.count({ where: { eventId } });

        if (bookedCount >= event.totalSeats) {
          throw new BadRequestException('No seats available for this event');
        }

        // Check duplicate booking
        const existing = await tx.booking.findFirst({ where: { eventId, userId } });
        if (existing) {
          throw new ConflictException('User already has a booking for this event');
        }

        // Create booking
        const booking = await tx.booking.create({
          data: { eventId, userId },
        });

        return booking;
      }, { maxWait: 5000, timeout: 10000 }); // optional settings

      return result;
    } catch (err) {
      // Prisma unique constraint error (double-check)
      if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
        // unique constraint on (eventId, userId)
        throw new ConflictException('User already has a booking for this event');
      }
      // If we re-threw an HttpException (NotFound/BadRequest/Conflict), let it bubble up
      if (err instanceof NotFoundException || err instanceof BadRequestException || err instanceof ConflictException) {
        throw err;
      }
      // Unexpected
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
    // ensure booking exists
    const booking = await this.bookingsRepo.findById(id);
    if (!booking) throw new NotFoundException('Booking not found');

    await this.bookingsRepo.remove(id);
    return { success: true };
  }
}
