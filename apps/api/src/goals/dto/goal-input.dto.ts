import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { trimString } from '../../common/transform-string';
import { Weekday } from '../../generated/prisma/enums';

export class GoalRewardInputDto {
  @ApiProperty({ example: 'Enjoy a new book', maxLength: 120 })
  @Transform(({ value }): unknown => trimString(value as unknown))
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  title!: string;

  @ApiProperty({ example: 10, minimum: 1 })
  @IsInt()
  @Min(1)
  requiredProgress!: number;
}

export class CreateGoalDto {
  @ApiProperty({ example: 'Read consistently', maxLength: 120 })
  @Transform(({ value }): unknown => trimString(value as unknown))
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  title!: string;

  @ApiPropertyOptional({
    example: 'Make time for focused reading sessions.',
    maxLength: 1000,
    nullable: true,
  })
  @IsOptional()
  @Transform(({ value }): unknown => trimString(value as unknown))
  @IsString()
  @MaxLength(1000)
  description?: string | null;

  @ApiPropertyOptional({
    description: 'Positive target for a finite Goal; null for an ongoing Goal.',
    example: 20,
    minimum: 1,
    nullable: true,
  })
  @IsOptional()
  @ValidateIf((_object, value) => value !== null)
  @IsInt()
  @Min(1)
  targetValue?: number | null;

  @ApiPropertyOptional({ enum: Weekday, isArray: true })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(7)
  @ArrayUnique()
  @IsEnum(Weekday, { each: true })
  scheduleDays?: Weekday[];

  @ApiPropertyOptional({ type: GoalRewardInputDto, nullable: true })
  @IsOptional()
  @ValidateIf((_object, value) => value !== null)
  @ValidateNested()
  @Type(() => GoalRewardInputDto)
  reward?: GoalRewardInputDto | null;
}

export class UpdateGoalDto extends PartialType(CreateGoalDto) {}
