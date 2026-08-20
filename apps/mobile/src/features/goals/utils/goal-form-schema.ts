import { z } from 'zod';

export const goalFormSchema = z
  .object({
    description: z.string().max(1000, 'Use no more than 1000 characters.'),
    goalType: z.enum(['FINITE', 'ONGOING']),
    rewardEnabled: z.boolean(),
    rewardRequiredProgress: z.string(),
    rewardTitle: z.string(),
    scheduleDays: z.array(
      z.enum([
        'MONDAY',
        'TUESDAY',
        'WEDNESDAY',
        'THURSDAY',
        'FRIDAY',
        'SATURDAY',
        'SUNDAY',
      ]),
    ),
    targetValue: z.string(),
    title: z
      .string()
      .trim()
      .min(1, 'Enter a Goal title.')
      .max(120, 'Use no more than 120 characters.'),
  })
  .superRefine((values, context) => {
    const targetValue = Number(values.targetValue);

    if (
      values.goalType === 'FINITE' &&
      (!/^\d+$/.test(values.targetValue) || targetValue < 1)
    ) {
      context.addIssue({
        code: 'custom',
        message: 'Enter a positive whole-number target.',
        path: ['targetValue'],
      });
    }

    if (!values.rewardEnabled) {
      return;
    }

    if (values.rewardTitle.trim().length === 0) {
      context.addIssue({
        code: 'custom',
        message: 'Enter a reward title.',
        path: ['rewardTitle'],
      });
    } else if (values.rewardTitle.trim().length > 120) {
      context.addIssue({
        code: 'custom',
        message: 'Use no more than 120 characters.',
        path: ['rewardTitle'],
      });
    }

    const rewardThreshold = Number(values.rewardRequiredProgress);

    if (!/^\d+$/.test(values.rewardRequiredProgress) || rewardThreshold < 1) {
      context.addIssue({
        code: 'custom',
        message: 'Enter a positive whole-number threshold.',
        path: ['rewardRequiredProgress'],
      });
    } else if (
      values.goalType === 'FINITE' &&
      Number.isInteger(targetValue) &&
      rewardThreshold > targetValue
    ) {
      context.addIssue({
        code: 'custom',
        message: 'The reward threshold cannot exceed the Goal target.',
        path: ['rewardRequiredProgress'],
      });
    }
  });

export type GoalFormValues = z.infer<typeof goalFormSchema>;
