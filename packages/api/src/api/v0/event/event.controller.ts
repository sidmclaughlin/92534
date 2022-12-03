import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
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
  getList(@GetPagination() pagination: Pagination) {
    return this.eventService.getList(pagination);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    console.log('gg');
    return this.eventService.getOne(id);
  }

  @UseGuards(XApiKeyGuard)
  @Get('views/major-events')
  getMajorEvents(@Query('area_id') id?: string) {
    return this.eventService.getMajorEvents(id);
  }
}
