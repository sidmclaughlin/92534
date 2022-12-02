import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ApiV0Module } from './api/v0/v0.module';
import { XApiKeyLoggerMiddlware } from './common/middleware/x-api-key-logger.middleware';
import { EventModule } from './event/event.module';
import { GlobalHttpModule } from './providers/http/global-http.module';
import { PrismaModule } from './providers/prisma/prisma.module';

@Module({
  imports: [GlobalHttpModule, EventModule, ApiV0Module, PrismaModule],
  exports: [],
})
export class AppModule implements NestModule {
  async configure(consumer: MiddlewareConsumer) {
    await consumer.apply(XApiKeyLoggerMiddlware).forRoutes('v0/events/views/major-events');
  }
}
