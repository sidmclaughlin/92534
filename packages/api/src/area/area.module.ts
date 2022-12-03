import { Module } from '@nestjs/common';
import { PrismaModule } from '../providers/prisma/prisma.module';
import { AreaService } from './area.service';

@Module({
  imports: [PrismaModule],
  providers: [AreaService],
  exports: [AreaService],
})
export class AreaModule {}
