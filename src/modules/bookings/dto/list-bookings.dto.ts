import { IsInt, IsOptional, IsPositive, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ListBookingsDto {
  @ApiPropertyOptional({ description: 'Page number (1-based)', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Page size (max 100)', example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsPositive()
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Filter by event id', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  eventId?: number;

  @ApiPropertyOptional({ description: 'Filter by user id (string)', example: 'user123' })
  @IsOptional()
  @IsString()
  userId?: string;
}
