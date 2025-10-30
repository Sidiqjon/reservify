import { Module } from '@nestjs/common';
import { BookingsController } from './presentation/bookings.controller';
import { BookingsService } from './application/bookings.service';
import { BookingsRepository } from './infrastructure/bookings.repository';
import { PrismaModule } from '../../core/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BookingsController],
  providers: [BookingsService, BookingsRepository],
  exports: [BookingsService],
})
export class BookingsModule {}
