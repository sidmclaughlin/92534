import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
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

  @UseGuards(XApiKeyGuard)
  @Get('views/major-events')
  getMajorEvents(@Query('area_id') id?: string) {
    return this.eventService.getMajorEvents(id);
  }
}
