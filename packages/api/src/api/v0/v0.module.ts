import { Module } from '@nestjs/common';
import { EventModule } from '../../event/event.module';
import { EventController } from './event/event.controller';

@Module({
  imports: [EventModule],
  controllers: [EventController],
})
export class ApiV0Module {}
