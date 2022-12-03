import { Module } from '@nestjs/common';
import { EventModule } from '../../event/event.module';
import { PrismaModule } from '../prisma/prisma.module';
import { CronService } from './cron.service';

@Module({
  imports: [EventModule, PrismaModule],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}
