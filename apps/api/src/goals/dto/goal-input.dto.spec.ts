import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Weekday } from '../../generated/prisma/enums';
import { CreateGoalDto, UpdateGoalDto } from './goal-input.dto';

describe('CreateGoalDto', () => {
  async function validateInput(input: object) {
    return validate(plainToInstance(CreateGoalDto, input), {
      forbidNonWhitelisted: true,
      whitelist: true,
    });
  }

  it('accepts the finite count-based MVP shape', async () => {
    await expect(
      validateInput({
        title: '  Read consistently  ',
        targetValue: 20,
        scheduleDays: [Weekday.MONDAY, Weekday.WEDNESDAY],
        reward: { title: 'New book', requiredProgress: 10 },
      }),
    ).resolves.toHaveLength(0);
  });

  it('accepts an ongoing Goal without a target or schedule', async () => {
    await expect(
      validateInput({ title: 'Practice Spanish' }),
    ).resolves.toHaveLength(0);
  });

  it.each([
    ['blank title', { title: '   ' }],
    ['non-positive target', { title: 'Read', targetValue: 0 }],
    [
      'duplicate weekdays',
      {
        title: 'Read',
        scheduleDays: [Weekday.MONDAY, Weekday.MONDAY],
      },
    ],
    [
      'invalid reward threshold',
      { title: 'Read', reward: { title: 'Book', requiredProgress: 0 } },
    ],
    ['server-owned user ID', { title: 'Read', userId: 'foreign-user' }],
    ['server-owned status', { title: 'Read', status: 'COMPLETED' }],
  ])('rejects %s', async (_case, input) => {
    await expect(validateInput(input)).resolves.not.toHaveLength(0);
  });
});

describe('UpdateGoalDto', () => {
  it('accepts nullable optional fields for clearing pre-progress settings', async () => {
    const errors = await validate(
      plainToInstance(UpdateGoalDto, {
        description: null,
        targetValue: null,
        reward: null,
      }),
      { forbidNonWhitelisted: true, whitelist: true },
    );

    expect(errors).toHaveLength(0);
  });
});
