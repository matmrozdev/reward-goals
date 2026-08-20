import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AccessTokenGuard } from '../auth/access-token.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthenticatedUser } from '../auth/auth.types';
import { CreateGoalDto, UpdateGoalDto } from './dto/goal-input.dto';
import {
  GoalEnvelopeDto,
  GoalListResponseDto,
  GoalProgressMutationResponseDto,
} from './dto/goal-response.dto';
import { GoalsService } from './goals.service';

@ApiTags('Goals')
@ApiBearerAuth()
@ApiBadRequestResponse({
  description: 'A route identifier or request body is invalid.',
})
@ApiUnauthorizedResponse({ description: 'The access token is invalid.' })
@UseGuards(AccessTokenGuard)
@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a Goal' })
  @ApiCreatedResponse({ type: GoalEnvelopeDto })
  async create(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Body() input: CreateGoalDto,
  ): Promise<GoalEnvelopeDto> {
    return { goal: await this.goalsService.create(currentUser.id, input) };
  }

  @Get()
  @ApiOperation({ summary: 'List the authenticated user’s Goals' })
  @ApiOkResponse({ type: GoalListResponseDto })
  async list(
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<GoalListResponseDto> {
    return { goals: await this.goalsService.list(currentUser.id) };
  }

  @Get(':goalId')
  @ApiOperation({ summary: 'Get one owned Goal' })
  @ApiOkResponse({ type: GoalEnvelopeDto })
  @ApiNotFoundResponse({ description: 'The Goal does not exist.' })
  async get(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('goalId', new ParseUUIDPipe()) goalId: string,
  ): Promise<GoalEnvelopeDto> {
    return { goal: await this.goalsService.get(currentUser.id, goalId) };
  }

  @Patch(':goalId')
  @ApiOperation({ summary: 'Update editable Goal fields' })
  @ApiOkResponse({ type: GoalEnvelopeDto })
  @ApiBadRequestResponse({
    description: 'The update violates the frozen Goal contract.',
  })
  @ApiNotFoundResponse({ description: 'The Goal does not exist.' })
  async update(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('goalId', new ParseUUIDPipe()) goalId: string,
    @Body() input: UpdateGoalDto,
  ): Promise<GoalEnvelopeDto> {
    return {
      goal: await this.goalsService.update(currentUser.id, goalId, input),
    };
  }

  @Post(':goalId/archive')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Archive a Goal without changing its lifecycle' })
  @ApiOkResponse({ type: GoalEnvelopeDto })
  @ApiNotFoundResponse({ description: 'The Goal does not exist.' })
  async archive(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('goalId', new ParseUUIDPipe()) goalId: string,
  ): Promise<GoalEnvelopeDto> {
    return { goal: await this.goalsService.archive(currentUser.id, goalId) };
  }

  @Post(':goalId/unarchive')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore an archived Goal' })
  @ApiOkResponse({ type: GoalEnvelopeDto })
  @ApiNotFoundResponse({ description: 'The Goal does not exist.' })
  async unarchive(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('goalId', new ParseUUIDPipe()) goalId: string,
  ): Promise<GoalEnvelopeDto> {
    return { goal: await this.goalsService.unarchive(currentUser.id, goalId) };
  }

  @Post(':goalId/abandon')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Abandon an active Goal' })
  @ApiOkResponse({ type: GoalEnvelopeDto })
  @ApiBadRequestResponse({ description: 'The lifecycle change is invalid.' })
  @ApiNotFoundResponse({ description: 'The Goal does not exist.' })
  async abandon(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('goalId', new ParseUUIDPipe()) goalId: string,
  ): Promise<GoalEnvelopeDto> {
    return { goal: await this.goalsService.abandon(currentUser.id, goalId) };
  }

  @Post(':goalId/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Explicitly end an ongoing Goal as completed' })
  @ApiOkResponse({ type: GoalEnvelopeDto })
  @ApiBadRequestResponse({ description: 'The lifecycle change is invalid.' })
  @ApiNotFoundResponse({ description: 'The Goal does not exist.' })
  async completeOngoing(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('goalId', new ParseUUIDPipe()) goalId: string,
  ): Promise<GoalEnvelopeDto> {
    return {
      goal: await this.goalsService.completeOngoing(currentUser.id, goalId),
    };
  }

  @Post(':goalId/progress')
  @ApiOperation({ summary: 'Record one manual Done progress entry' })
  @ApiCreatedResponse({ type: GoalProgressMutationResponseDto })
  @ApiBadRequestResponse({
    description: 'Progress cannot be recorded for the current Goal state.',
  })
  @ApiNotFoundResponse({ description: 'The Goal does not exist.' })
  addProgress(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('goalId', new ParseUUIDPipe()) goalId: string,
  ): Promise<GoalProgressMutationResponseDto> {
    return this.goalsService.addProgress(currentUser.id, goalId);
  }

  @Post(':goalId/progress/:progressEntryId/undo')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Undo one active progress entry' })
  @ApiOkResponse({ type: GoalProgressMutationResponseDto })
  @ApiNotFoundResponse({
    description: 'The Goal or active progress entry does not exist.',
  })
  undoProgress(
    @CurrentUser() currentUser: AuthenticatedUser,
    @Param('goalId', new ParseUUIDPipe()) goalId: string,
    @Param('progressEntryId', new ParseUUIDPipe()) progressEntryId: string,
  ): Promise<GoalProgressMutationResponseDto> {
    return this.goalsService.undoProgress(
      currentUser.id,
      goalId,
      progressEntryId,
    );
  }
}
