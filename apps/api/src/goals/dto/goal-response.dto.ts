import { ApiProperty } from '@nestjs/swagger';
import {
  GoalMeasurementType,
  GoalStatus,
  Weekday,
} from '../../generated/prisma/enums';

export class GoalRewardResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({ minimum: 1 })
  requiredProgress!: number;

  @ApiProperty({ format: 'date-time', nullable: true })
  unlockedAt!: Date | null;
}

export class GoalResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({ nullable: true })
  description!: string | null;

  @ApiProperty({ enum: GoalMeasurementType })
  measurementType!: GoalMeasurementType;

  @ApiProperty({ minimum: 1, nullable: true })
  targetValue!: number | null;

  @ApiProperty({ enum: Weekday, isArray: true })
  scheduleDays!: Weekday[];

  @ApiProperty({ maximum: 1439, minimum: 0, nullable: true })
  scheduledTimeMinutes!: number | null;

  @ApiProperty({ enum: GoalStatus })
  status!: GoalStatus;

  @ApiProperty({ format: 'date-time', nullable: true })
  archivedAt!: Date | null;

  @ApiProperty({ minimum: 0 })
  progressCount!: number;

  @ApiProperty({
    description:
      'Whether any progress entry exists, including entries that were undone.',
  })
  hasProgressHistory!: boolean;

  @ApiProperty({ type: GoalRewardResponseDto, nullable: true })
  reward!: GoalRewardResponseDto | null;

  @ApiProperty({ format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ format: 'date-time' })
  updatedAt!: Date;
}

export class GoalEnvelopeDto {
  @ApiProperty({ type: GoalResponseDto })
  goal!: GoalResponseDto;
}

export class GoalListResponseDto {
  @ApiProperty({ type: GoalResponseDto, isArray: true })
  goals!: GoalResponseDto[];
}

export class GoalProgressEntryResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ format: 'date-time', nullable: true })
  undoneAt!: Date | null;
}

export class GoalProgressMutationResponseDto extends GoalEnvelopeDto {
  @ApiProperty({ type: GoalProgressEntryResponseDto })
  progressEntry!: GoalProgressEntryResponseDto;
}
