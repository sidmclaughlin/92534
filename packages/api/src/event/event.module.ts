import { Module } from '@nestjs/common';
import { PrismaModule } from '../providers/prisma/prisma.module';
import { EventService } from './event.service';

@Module({
  imports: [PrismaModule],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
