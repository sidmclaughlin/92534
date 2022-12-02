import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { EventService } from './event.service';

@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://api.open511.gov.bc.ca/',
    }),
  ],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
