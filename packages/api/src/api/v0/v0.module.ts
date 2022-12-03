import { Module } from '@nestjs/common';
import { AreaModule } from '../../area/area.module';
import { EventModule } from '../../event/event.module';
import { AreaController } from './area/area.controller';
import { EventController } from './event/event.controller';

@Module({
  imports: [AreaModule, EventModule],
  controllers: [AreaController, EventController],
})
export class ApiV0Module {}
