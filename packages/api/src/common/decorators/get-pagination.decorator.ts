import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { IsNumberString, IsOptional, validateSync } from 'class-validator';
import { Request } from 'express';

export class PaginationDto {
  @IsNumberString()
  @IsOptional()
  limit?: string;

  @IsNumberString()
  @IsOptional()
  offset?: string;
}

export interface Pagination {
  limit: number;
  offset: number;
}

export const GetPagination = createParamDecorator((data, ctx: ExecutionContext) => {
  const req: Request = ctx.switchToHttp().getRequest();

  const dto = plainToClass(PaginationDto, req.query);
  const validationErrors = validateSync(dto);
  if (validationErrors.length > 0)
    throw new BadRequestException(...validationErrors.map((e) => Object.values(e.constraints ?? {})));

  const pagination: Pagination = {
    limit: dto.limit ? parseInt(dto.limit, 10) : 50,
    offset: dto.offset ? parseInt(dto.offset, 10) : 0,
  };

  return pagination;
});
