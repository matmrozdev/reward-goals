import { registerFormSchema } from './register-form-schema';

describe('registerFormSchema', () => {
  it('accepts matching passwords and trims the email address', () => {
    const result = registerFormSchema.parse({
      confirmPassword: 'password123',
      email: '  person@example.com  ',
      password: 'password123',
    });

    expect(result).toEqual({
      confirmPassword: 'password123',
      email: 'person@example.com',
      password: 'password123',
    });
  });

  it('reports mismatched passwords against the confirmation field', () => {
    const result = registerFormSchema.safeParse({
      confirmPassword: 'different123',
      email: 'person@example.com',
      password: 'password123',
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: 'Passwords must match.',
          path: ['confirmPassword'],
        }),
      ]),
    );
  });
});
