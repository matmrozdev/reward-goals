import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ description: 'The active refresh token issued by the API.' })
  @IsString()
  @MinLength(1)
  refreshToken!: string;
}
