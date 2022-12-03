import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { AreaDto } from '../api/v0/area/dtos/area.dto';
import { normalizeId } from '../common/utils/normalize-id.util';
import { PrismaService } from '../providers/prisma/prisma.service';

@Injectable()
export class AreaService {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(data: AreaDto) {
    const id = data.id ? normalizeId(data.id) : `drivebc.ca-${uuid}`;

    const mappedData = {
      name: data.name,
      url: data.url,
    };

    return await this.prisma.area.upsert({
      where: { id },
      create: {
        id,
        ...mappedData,
      },
      update: mappedData,
    });
  }
}
