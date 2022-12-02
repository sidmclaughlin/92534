import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ApiV0Module } from './api/v0/v0.module';
import { XApiKeyLoggerMiddlware } from './common/middleware/x-api-key-logger.middleware';
import { EventModule } from './event/event.module';
import { PrismaModule } from './providers/prisma/prisma.module';

@Module({
  imports: [EventModule, ApiV0Module, PrismaModule],
})
export class AppModule implements NestModule {
  async configure(consumer: MiddlewareConsumer) {
    await consumer.apply(XApiKeyLoggerMiddlware).forRoutes('v0/events/views/major-events');
  }
}
