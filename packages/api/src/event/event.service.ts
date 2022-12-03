import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { firstValueFrom } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { CreateEventDto } from '../api/v0/event/dtos/create-event.dto';
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
        id: `drivebc.ca/${uuid()}`,
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
    const id = data.id || `drivebc.ca/${uuid()}`;

    const areas = data.areas.map((area) => ({
      create: { id: area.id, name: area.name, url: area.url },
      where: { id: area.id },
    }));

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
        connectOrCreate: areas,
      },
      geography: data.geography as unknown as Prisma.JsonValue,
      roads: data.roads as unknown as Prisma.JsonValue,
      schedule: data.schedule,
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

  async getMajorEvents(id?: string) {
    const params = new URLSearchParams();
    params.append('format', 'json');
    params.append('severity', 'MAJOR');
    if (id != null) params.append('area_id', id);

    const { data } = await firstValueFrom(this.httpService.get(`events?${params.toString()}`));

    return data;
  }
}
