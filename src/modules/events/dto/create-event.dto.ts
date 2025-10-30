import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({
    description: 'Human-friendly name of the event',
    example: 'Tech Conference 2026',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Total number of seats available for the event (must be >= 0)',
    example: 50,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  totalSeats: number;
}
