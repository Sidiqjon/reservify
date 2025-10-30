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
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { EventsService } from '../application/events.service';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import { ListEventsDto } from '../dto/list-events.dto';

@ApiTags('events')
@Controller('api/events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiOperation({ summary: 'Create event' })
  @ApiResponse({ status: 201, description: 'Event created' })
  create(@Body() dto: CreateEventDto) {
    return this.eventsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List events with pagination and optional search' })
  @ApiResponse({ status: 200, description: 'Events list with meta' })
  list(@Query() query: ListEventsDto) {
    return this.eventsService.findAll({
      page: query.page,
      limit: query.limit,
      search: query.search,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event by id' })
  @ApiParam({ name: 'id', description: 'Event id', example: 1 })
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update event (partial update)' })
  @ApiParam({ name: 'id', description: 'Event id', example: 1 })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEventDto) {
    return this.eventsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete event by id' })
  @ApiParam({ name: 'id', description: 'Event id', example: 1 })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.remove(id);
  }
}
