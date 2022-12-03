import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ApiV0Module } from './api/v0/v0.module';
import { XApiKeyLoggerMiddlware } from './common/middleware/x-api-key-logger.middleware';
import { EventModule } from './event/event.module';
import { CronModule } from './providers/cron/cron.module';
import { CronService } from './providers/cron/cron.service';
import { GlobalHttpModule } from './providers/http/global-http.module';
import { PrismaModule } from './providers/prisma/prisma.module';
import { AreaModule } from './area/area.module';

@Module({
  imports: [ScheduleModule.forRoot(), GlobalHttpModule, ApiV0Module, EventModule, PrismaModule, CronModule, AreaModule],
  exports: [],
})
export class AppModule implements NestModule {
  constructor(private readonly cronService: CronService) {}

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

    // Sync events from https://api.open511.gov.bc.ca/events
    await this.cronService.syncEvents();
  }
}
