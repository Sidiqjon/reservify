import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { EventsService } from '../application/events.service';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import { ListEventsDto } from '../dto/list-events.dto';
import { formatResponse } from 'src/core/utils';

@ApiTags('events')
@Controller('api/events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiOperation({ summary: 'Create event' })
  @ApiResponse({ status: 201, description: 'Event created' })
  async create(@Body() dto: CreateEventDto) {
    const result = await this.eventsService.create(dto);
    return formatResponse(result, 'Event created successfully');
  }

  @Get()
  @ApiOperation({ summary: 'List events with pagination and optional search' })
  @ApiResponse({ status: 200, description: 'Events list with meta' })
  async list(@Query() query: ListEventsDto) {
    const result = await this.eventsService.findAll({
      page: query.page,
      limit: query.limit,
      search: query.search,
    });
    return {
      success: true,
      message: 'Events retrieved successfully',
      ...result,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event by id' })
  @ApiParam({ name: 'id', description: 'Event id', example: 1 })
  async getOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.eventsService.findOne(id);
    return formatResponse(result, 'Event retrieved successfully');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update event (partial update)' })
  @ApiParam({ name: 'id', description: 'Event id', example: 1 })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEventDto) {
    const result = await this.eventsService.update(id, dto);
    return formatResponse(result, 'Event updated successfully');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete event by id' })
  @ApiParam({ name: 'id', description: 'Event id', example: 1 })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.eventsService.remove(id);
    return formatResponse(result, 'Event deleted successfully');
  }
}
