import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { v4 as uuid } from 'uuid';
import { CreateEventDto } from '../api/v0/event/dtos/create-event.dto';
import { EventFilters } from '../common/decorators/get-event-filters.decorator';
import { Pagination } from '../common/decorators/get-pagination.decorator';
import { extractStartDateFromEventSchedule } from '../common/utils/extract-start-date-from-event-schedule.util';
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
        start_date: extractStartDateFromEventSchedule(data.schedule),
        created_at: data.created_at,
        updated_at: data.updated_at,
      },
    });

    return {
      data: result,
    };
  }

  async upsert(data: CreateEventDto) {
    const id = data.id ? normalizeId(data.id) : `drivebc.ca-${uuid()}`;

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
      start_date: extractStartDateFromEventSchedule(data.schedule),
      created_at: (data as any).created,
      updated_at: (data as any).updated,
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

  async getList(pagination: Pagination, filters: EventFilters) {
    const { limit, offset } = pagination;
    const { areas, event_type, severity, start_date } = filters;

    const results = await this.prisma.event.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        start_date: 'desc',
      },
      where: {
        areas,
        event_type,
        severity,
        start_date,
      },
      include: {
        areas: true,
      },
    });
    const count = await this.prisma.event.count({
      where: {
        areas,
        event_type,
        severity,
        start_date,
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

  async getOne(id: string) {
    const results = await this.prisma.event.findFirst({
      where: { id },
    });

    return {
      data: results,
    };
  }

  async getMajorEventsByArea(pagination: Pagination, filters: EventFilters) {
    const { areas, event_type, start_date } = filters;
    const severity = { severity: { in: ['MAJOR'] } };

    const results = await this.getList(pagination, { areas, event_type, ...severity, start_date });

    return {
      pagination: results.pagination,
      data: results.data,
    };
  }
}
