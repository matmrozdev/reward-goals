import { ApiProperty } from '@nestjs/swagger';

export class PublicUserDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'person@example.com' })
  email!: string;

  @ApiProperty({ format: 'date-time' })
  createdAt!: Date;
}

export class UserResponseDto {
  @ApiProperty({ type: PublicUserDto })
  user!: PublicUserDto;
}

export class TokenPairDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty()
  refreshToken!: string;
}

export class LoginResponseDto extends TokenPairDto {
  @ApiProperty({ type: PublicUserDto })
  user!: PublicUserDto;
}
