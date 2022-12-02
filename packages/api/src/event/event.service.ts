import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EventService {
  constructor(private readonly httpService: HttpService) {}

  async getMajorEvents(id?: string) {
    const params = new URLSearchParams();
    params.append('format', 'json');
    params.append('severity', 'MAJOR');
    if (id != null) params.append('area_id', id);

    console.log('id: ', id);

    const { data } = await firstValueFrom(this.httpService.get(`events?${params.toString()}`));

    return data;
  }
}
