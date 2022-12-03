import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { EventFilters, GetEventFilters } from '../../../common/decorators/get-event-filters.decorator';
import { GetPagination, Pagination } from '../../../common/decorators/get-pagination.decorator';
import { XApiKeyGuard } from '../../../common/guards/x-api-key.guard';
import { EventService } from '../../../event/event.service';
import { CreateEventDto } from './dtos/create-event.dto';

@Controller({
  path: 'events',
  version: '0',
})
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(XApiKeyGuard)
  @Post()
  createEvent(@Body() data: CreateEventDto) {
    return this.eventService.createEvent(data);
  }

  @Get()
  getList(@GetPagination() pagination: Pagination, @GetEventFilters() filters: EventFilters) {
    return this.eventService.getList(pagination, filters);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.eventService.getOne(id);
  }

  @UseGuards(XApiKeyGuard)
  @Get('views/major-events')
  getMajorEvents(@GetPagination() pagination: Pagination, @GetEventFilters() filters: EventFilters) {
    return this.eventService.getMajorEventsByArea(pagination, filters);
  }
}
