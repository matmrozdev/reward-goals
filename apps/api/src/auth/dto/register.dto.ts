import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { trimString } from '../../common/transform-string';

export class RegisterDto {
  @ApiProperty({ example: 'person@example.com' })
  @Transform(({ value }): unknown => trimString(value as unknown))
  @IsEmail()
  @MaxLength(320)
  email!: string;

  @ApiProperty({ example: 'correct horse battery staple', minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;
}
