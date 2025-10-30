import { Module } from '@nestjs/common';
import { PrismaModule } from './core/prisma/prisma.module';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { EventsModule } from './modules/events/events.module';
import { BookingsModule } from './modules/bookings/bookings.module';

@Module({
  imports: [
    PrismaModule,
    EventsModule,
    BookingsModule,
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
