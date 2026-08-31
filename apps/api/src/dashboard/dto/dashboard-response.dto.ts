import { ApiProperty } from '@nestjs/swagger';
import { Weekday } from '../../generated/prisma/enums';

export class DashboardGoalPreviewDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({ minimum: 0 })
  progressCount!: number;

  @ApiProperty({ minimum: 1, nullable: true })
  targetValue!: number | null;

  @ApiProperty({ enum: Weekday, isArray: true })
  scheduleDays!: Weekday[];

  @ApiProperty({ maximum: 1439, minimum: 0, nullable: true })
  scheduledTimeMinutes!: number | null;

  @ApiProperty()
  hasProgressToday!: boolean;

  @ApiProperty({ format: 'uuid', nullable: true })
  latestTodayProgressEntryId!: string | null;
}

export class DashboardTodayDto {
  @ApiProperty({ example: '2026-08-31' })
  date!: string;

  @ApiProperty({ minimum: 0 })
  completedCount!: number;

  @ApiProperty({ minimum: 0 })
  totalCount!: number;

  @ApiProperty({ isArray: true, type: DashboardGoalPreviewDto })
  goals!: DashboardGoalPreviewDto[];
}

export class DashboardRewardPreviewDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  goalId!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({ minimum: 0 })
  currentProgress!: number;

  @ApiProperty({ minimum: 1 })
  requiredProgress!: number;

  @ApiProperty({ minimum: 0 })
  remainingProgress!: number;

  @ApiProperty({ format: 'date-time', nullable: true })
  unlockedAt!: Date | null;
}

export class DashboardResponseDto {
  @ApiProperty({ type: DashboardTodayDto })
  today!: DashboardTodayDto;

  @ApiProperty({ nullable: true, type: DashboardRewardPreviewDto })
  rewardPreview!: DashboardRewardPreviewDto | null;
}
