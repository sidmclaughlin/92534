import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { XApiKeyGuard } from '../../../common/guards/x-api-key.guard';
import { EventService } from '../../../event/event.service';

@Controller({
  path: 'events',
  version: '0',
})
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(XApiKeyGuard)
  @Get('views/major-events')
  getMajorEvents(@Query('area_id') id?: string) {
    return this.eventService.getMajorEvents(id);
  }
}
