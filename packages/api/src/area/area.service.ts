import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { AreaDto } from '../api/v0/area/dtos/area.dto';
import { Pagination } from '../common/decorators/get-pagination.decorator';
import { normalizeId } from '../common/utils/normalize-id.util';
import { PrismaService } from '../providers/prisma/prisma.service';

@Injectable()
export class AreaService {
  constructor(private readonly prisma: PrismaService) {}

  async getList(pagination: Pagination) {
    const { limit, offset } = pagination;

    const count = await this.prisma.area.count();
    const results = await this.prisma.area.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return {
      pagination: {
        limit,
        offset,
        count,
      },
      data: results,
    };
  }

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
