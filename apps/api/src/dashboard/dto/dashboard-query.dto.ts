import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength } from 'class-validator';

export class DashboardQueryDto {
  @ApiProperty({ example: '2026-08-31', pattern: '^\\d{4}-\\d{2}-\\d{2}$' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date!: string;

  @ApiProperty({ example: 'Europe/Warsaw', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  timeZone!: string;
}
