import { EventSubtype, EventType, Severity, Status } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AreaDto } from '../../area/dtos/area.dto';

export class EventGeographyDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsArray({ each: true })
  coordinates: [number, number][];
}

export class EventRoadDto {
  @IsString()
  @IsOptional()
  direction?: string;

  @IsString()
  @IsOptional()
  from?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  to?: string;

  @IsString()
  @IsOptional()
  state?: string;
}

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  jurisdiction_url: string;

  @IsString()
  @IsIn(Object.keys(EventType))
  event_type: EventType;

  @IsArray()
  @IsIn(
    [
      'ACCIDENT',
      'SPILL',
      'OBSTRUCTION',
      'HAZARD',
      'ROAD_MAINTENANCE',
      'ROAD_CONSTRUCTION',
      'EMERGENCY_MAINTENANCE',
      'PLANNED_EVENT',
      'CROWD',
      'HAIL',
      'THUNDERSTORM',
      'HEAVY_DOWNPOUR',
      'STRONG_WINDS',
      'BLOWING_DUST',
      'SANDSTORM',
      'INSECT_SWARMS',
      'AVALANCH_HAZARD',
      'SURFACE_WATER_HAZARD',
      'MUD',
      'LOOSE_GRAVEL',
      'OIL_ON_HIGHWAY',
      'FIRE',
      'SIGNAL_LIGHT_FAILURE',
      'PARTLY_ICY',
      'ICE_COVERED',
      'PARTLY_SNOW_PACKED',
      'SNOW_PACKED',
      'PARTLY_SNOW_COVERED',
      'SNOW_COVERED',
      'DRIFTING_SNOW',
      'POOR_VISIBILITY',
      'ALMOST_IMPASSABLE',
      'PASSABLE_WITH_CARE',
    ],
    { each: true }
  )
  event_subtypes: EventSubtype[];

  @IsString()
  @IsIn(Object.keys(Severity))
  severity: Severity;

  @IsString()
  @IsIn(Object.keys(Status))
  status: Status;

  @IsString()
  @IsNotEmpty()
  headline: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @ValidateNested()
  @Type(() => AreaDto)
  areas: AreaDto[];

  @ValidateNested()
  @Type(() => EventGeographyDto)
  geography: EventGeographyDto;

  @ValidateNested()
  @Type(() => EventRoadDto)
  roads: EventRoadDto[];

  @IsObject()
  @IsNotEmpty()
  schedule: Record<string, any>;

  @IsDateString()
  @IsNotEmpty()
  created: string;

  @IsDateString()
  @IsNotEmpty()
  updated: string;
}
