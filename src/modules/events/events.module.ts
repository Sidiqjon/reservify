import { Module } from '@nestjs/common';
import { EventsController } from './presentation/events.controller';
import { EventsService } from './application/events.service';
import { EventsRepository } from './infrastructure/events.repository';
import { PrismaModule } from '../../core/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EventsController],
  providers: [EventsService, EventsRepository],
  exports: [EventsService],
})
export class EventsModule {}
