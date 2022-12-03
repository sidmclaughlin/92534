import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { firstValueFrom } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { CreateEventDto } from '../api/v0/event/dtos/create-event.dto';
import { Pagination } from '../common/decorators/get-pagination.decorator';
import { normalizeId } from '../common/utils/normalize-id.util';
import { PrismaService } from '../providers/prisma/prisma.service';

@Injectable()
export class EventService {
  constructor(private readonly httpService: HttpService, private readonly prisma: PrismaService) {}

  async createEvent(data: CreateEventDto) {
    const areas = data.areas.map((area) => ({
      create: { id: area.id, name: area.name, url: area.url },
      where: { id: area.id },
    }));

    const result = await this.prisma.event.create({
      data: {
        id: `drivebc.ca-${uuid()}`,
        url: data.url,
        jurisdiction_url: data.jurisdiction_url,
        event_type: data.event_type,
        event_subtypes: data.event_subtypes,
        severity: data.severity,
        status: data.status,
        headline: data.headline,
        description: data.description,
        areas: {
          connectOrCreate: areas,
        },
        geography: data.geography as unknown as Prisma.JsonValue,
        roads: data.roads as unknown as Prisma.JsonValue,
        schedule: data.schedule,
        created_at: data.created,
        updated_at: data.updated,
      },
    });

    return result;
  }

  async upsert(data: CreateEventDto) {
    const id = data.id ? normalizeId(data.id) : `drivebc.ca-${uuid()}`;

    // const areas = data.areas.map((area) => ({
    //   create: { id: area.id, name: area.name, url: area.url },
    //   where: { id: area.id },
    // }));

    const extractStartDate = () => {
      if (Object.keys(data.schedule).includes('intervals') && data.schedule.intervals.length > 0) {
        const [start_datetime] = data.schedule.intervals[0].split('/');
        const [start_date] = start_datetime.split('T');

        return start_date;
      }
      if (Object.keys(data.schedule).includes('recurring_schedules') && data.schedule.recurring_schedules.length > 0) {
        const { start_date } = data.schedule.recurring_schedules[0];
        return start_date;
      }

      return null;
    };

    const mappedData = {
      url: data.url,
      jurisdiction_url: data.jurisdiction_url,
      event_type: data.event_type,
      event_subtypes: data.event_subtypes,
      severity: data.severity,
      status: data.status,
      headline: data.headline,
      description: data.description,
      areas: {
        connect: data.areas.map((area) => ({ id: normalizeId(area.id) })),
      },
      geography: data.geography as unknown as Prisma.JsonValue,
      roads: data.roads as unknown as Prisma.JsonValue,
      schedule: data.schedule,
      start_date: extractStartDate(),
      created_at: data.created,
      updated_at: data.updated,
    };

    const result = await this.prisma.event.upsert({
      where: { id },
      create: {
        id,
        ...mappedData,
      },
      update: mappedData,
    });

    return result;
  }

  async getList(pagination: Pagination) {
    const { limit, offset, areas, event_type, severity, start_date } = pagination;

    return await this.prisma.event.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        updated_at: 'desc',
      },
      where: {
        areas,
        event_type,
        severity,
        start_date,
      },
    });
  }

  async getOne(id: string) {
    return await this.prisma.event.findFirst({
      where: { id },
    });
  }

  async getMajorEvents(id?: string) {
    const params = new URLSearchParams();
    params.append('format', 'json');
    params.append('severity', 'MAJOR');
    if (id != null) params.append('area_id', id);

    const { data } = await firstValueFrom(this.httpService.get(`events?${params.toString()}`));

    return data;
  }
}
