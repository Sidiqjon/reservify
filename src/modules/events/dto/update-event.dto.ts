import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEventDto {
  @ApiPropertyOptional({
    description: 'Human-friendly name of the event',
    example: 'Tech Summit 2026',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Total number of seats available for the event (must be >= 0)',
    example: 75,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  totalSeats?: number;
}
