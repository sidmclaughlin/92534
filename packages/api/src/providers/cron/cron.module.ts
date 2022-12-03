import { Module } from '@nestjs/common';
import { AreaModule } from '../../area/area.module';
import { EventModule } from '../../event/event.module';
import { PrismaModule } from '../prisma/prisma.module';
import { CronService } from './cron.service';

@Module({
  imports: [AreaModule, EventModule, PrismaModule],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}
