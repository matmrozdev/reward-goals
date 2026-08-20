import { goalFormSchema } from './goal-form-schema';

const validValues = {
  description: '',
  goalType: 'FINITE' as const,
  rewardEnabled: false,
  rewardRequiredProgress: '',
  rewardTitle: '',
  scheduleDays: [],
  targetValue: '10',
  title: 'Read consistently',
};

describe('goalFormSchema', () => {
  it('accepts an ongoing Goal without a target', () => {
    expect(
      goalFormSchema.safeParse({
        ...validValues,
        goalType: 'ONGOING',
        targetValue: '',
      }).success,
    ).toBe(true);
  });

  it('rejects a finite Goal without a positive integer target', () => {
    const result = goalFormSchema.safeParse({
      ...validValues,
      targetValue: '1.5',
    });

    expect(result.error?.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: ['targetValue'] }),
      ]),
    );
  });

  it('rejects a finite reward threshold above the target', () => {
    const result = goalFormSchema.safeParse({
      ...validValues,
      rewardEnabled: true,
      rewardRequiredProgress: '11',
      rewardTitle: 'New book',
    });

    expect(result.error?.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: ['rewardRequiredProgress'] }),
      ]),
    );
  });
});
