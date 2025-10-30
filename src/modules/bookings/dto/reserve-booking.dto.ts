import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReserveBookingDto {
  @ApiProperty({ description: 'Event id to reserve a seat for', example: 1 })
  @IsInt()
  @Min(1)
  event_id: number;

  @ApiProperty({ description: 'User identifier (string)', example: 'user123' })
  @IsString()
  @IsNotEmpty()
  user_id: string;
}
