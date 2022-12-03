import { Controller, Get } from '@nestjs/common';
import { AreaService } from '../../../area/area.service';
import { GetPagination, Pagination } from '../../../common/decorators/get-pagination.decorator';

@Controller({
  path: 'areas',
  version: '0',
})
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @Get()
  getList(@GetPagination() pagination: Pagination) {
    return this.areaService.getList(pagination);
  }
}
