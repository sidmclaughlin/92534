import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://api.open511.gov.bc.ca/',
    }),
  ],
  exports: [HttpModule],
})
export class GlobalHttpModule {}
