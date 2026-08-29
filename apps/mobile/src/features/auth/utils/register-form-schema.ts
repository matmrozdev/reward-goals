import { z } from 'zod';

export const registerFormSchema = z
  .object({
    confirmPassword: z.string(),
    email: z.string().trim().pipe(z.email('Enter a valid email address.')),
    password: z
      .string()
      .min(8, 'Use at least 8 characters.')
      .max(128, 'Use no more than 128 characters.'),
  })
  .refine(({ confirmPassword, password }) => confirmPassword === password, {
    message: 'Passwords must match.',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerFormSchema>;
