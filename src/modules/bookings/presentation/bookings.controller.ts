import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { BookingsService } from '../application/bookings.service';
import { ReserveBookingDto } from '../dto/reserve-booking.dto';
import { ListBookingsDto } from '../dto/list-bookings.dto';

@ApiTags('bookings')
@Controller('api/bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post('reserve')
  @ApiOperation({ summary: 'Reserve a seat for an event' })
  @ApiResponse({ status: 201, description: 'Booking created' })
  @ApiResponse({ status: 400, description: 'No seats available or bad request' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  @ApiResponse({ status: 409, description: 'Duplicate booking' })
  async reserve(@Body() dto: ReserveBookingDto) {
    const booking = await this.bookingsService.reserve(dto);
    return booking;
  }

  @Get()
  @ApiOperation({ summary: 'List bookings with filters and pagination' })
  async list(@Query() query: ListBookingsDto) {
    return this.bookingsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking by id' })
  @ApiParam({ name: 'id', description: 'Booking id', example: 1 })
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookingsService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete booking by id' })
  @ApiParam({ name: 'id', description: 'Booking id', example: 1 })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.bookingsService.remove(id);
  }
}
