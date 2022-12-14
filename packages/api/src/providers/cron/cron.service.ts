import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';
import { AreaService } from '../../area/area.service';
import { EventService } from '../../event/event.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CronService {
  constructor(
    private readonly areaService: AreaService,
    private readonly eventService: EventService,
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async syncEvents() {
    const {
      _max: { updated_at: updatedAt },
    } = await this.prisma.event.aggregate({
      _max: {
        updated_at: true,
      },
    });

    const {
      data: { areas },
    } = await firstValueFrom(this.httpService.get(`areas?limit=500`));
    areas.forEach(async (area) => await this.areaService.upsert(area));

    const {
      data: { events },
    } = await firstValueFrom(
      this.httpService.get(`events?limit=500${updatedAt != null ? `&updated=>${updatedAt.toISOString()}` : ''}`)
    );
    events.forEach(async (event) => await this.eventService.upsert(event));
  }
}
