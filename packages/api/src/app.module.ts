import { HttpService } from '@nestjs/axios';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ApiV0Module } from './api/v0/v0.module';
import { XApiKeyLoggerMiddlware } from './common/middleware/x-api-key-logger.middleware';
import { EventModule } from './event/event.module';
import { EventService } from './event/event.service';
import { GlobalHttpModule } from './providers/http/global-http.module';
import { PrismaModule } from './providers/prisma/prisma.module';

@Module({
  imports: [GlobalHttpModule, ApiV0Module, EventModule, PrismaModule],
  exports: [],
})
export class AppModule implements NestModule {
  constructor(private readonly eventService: EventService, private readonly httpService: HttpService) {}

  async configure(consumer: MiddlewareConsumer) {
    await consumer.apply(XApiKeyLoggerMiddlware).forRoutes(
      {
        path: 'events',
        method: RequestMethod.POST,
        version: '0',
      },
      {
        path: 'events/views/major-events',
        method: RequestMethod.GET,
        version: '0',
      }
    );
    const { data } = await firstValueFrom(this.httpService.get('events?limit=500'));
    if (data.events) {
      data.events.forEach(async (event) => await this.eventService.sync(event));
    }
  }
}
