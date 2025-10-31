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
import { formatResponse } from '../../../core/utils';

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
    const result = await this.bookingsService.reserve(dto);
    return formatResponse(result, 'Booking created successfully');
  }

  @Get()
  @ApiOperation({ summary: 'List bookings with filters and pagination' })
  async list(@Query() query: ListBookingsDto) {
    const result = await this.bookingsService.findAll(query);
    return {
      success: true,
      message: 'Bookings retrieved successfully',
      ...result,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking by id' })
  @ApiParam({ name: 'id', description: 'Booking id', example: 1 })
  async getOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.bookingsService.findOne(id);
    return formatResponse(result, 'Booking retrieved successfully');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete booking by id' })
  @ApiParam({ name: 'id', description: 'Booking id', example: 1 })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.bookingsService.remove(id);
    return formatResponse(result, 'Booking deleted successfully');
  }
}
