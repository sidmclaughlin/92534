import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Matches, validateSync } from 'class-validator';
import { Request } from 'express';

export class EventFiltersDto {
  @Matches(/^((drivebc.ca-\d)(,)?)+$/, { message: 'area_id value is not in the correct format' })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  area_id?: string;

  @Matches(/^(?:(CONSTRUCTION|INCIDENT|ROAD_CONDITION|SPECIAL_EVENT|WEATHER_CONDITION)(,)?)+$/, {
    message: 'event_type value is not in the correct format',
  })
  @IsString()
  @IsOptional()
  event_type?: string;

  @Matches(/^((MINOR|MODERATE|MAJOR|UNKNOWN)(,)?)+$/, { message: 'severity value is not in the correct format' })
  @IsString()
  @IsOptional()
  severity?: string;

  @Matches(/^(<|>)?(\d{4}-\d\d-\d\d)$/, {
    message: 'start_date is not in the correct format',
  })
  @IsOptional()
  start_date?: string;
}

type StartDateFilterType = Record<'gt', string> | Record<'lt', string> | Record<'equals', string>;

export interface EventFilters {
  areas?: any;
  event_type?: any;
  severity?: any;
  start_date?: StartDateFilterType;
}

export const GetEventFilters = createParamDecorator((data, ctx: ExecutionContext) => {
  const req: Request = ctx.switchToHttp().getRequest();

  const dto = plainToClass(EventFiltersDto, req.query);
  const validationErrors = validateSync(dto);
  if (validationErrors.length > 0)
    throw new BadRequestException(...validationErrors.map((e) => Object.values(e.constraints ?? {})));

  let startDateFilter: StartDateFilterType;
  if (dto.start_date) {
    if (dto.start_date.startsWith('<')) {
      startDateFilter = { lt: dto.start_date.replace('<', '') };
    } else if (dto.start_date.startsWith('>')) {
      startDateFilter = { gt: dto.start_date.replace('>', '') };
    } else {
      startDateFilter = { equals: dto.start_date };
    }
  }
  const pagination: EventFilters = {
    ...(dto.area_id && { areas: { some: { id: { in: dto.area_id.split(',') } } } }),
    ...(dto.event_type && { event_type: { in: dto.event_type.split(',') } }),
    ...(dto.severity && { severity: { in: dto.severity.split(',') } }),
    ...(startDateFilter && { start_date: startDateFilter }),
  };

  return pagination;
});
