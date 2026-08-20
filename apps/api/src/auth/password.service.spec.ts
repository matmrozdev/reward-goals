import { PasswordService } from './password.service';

describe('PasswordService', () => {
  const service = new PasswordService();

  it('stores a one-way hash and verifies the matching password', async () => {
    const password = 'correct horse battery staple';
    const passwordHash = await service.hash(password);

    expect(passwordHash).not.toBe(password);
    await expect(service.verify(password, passwordHash)).resolves.toBe(true);
    await expect(
      service.verify('incorrect password', passwordHash),
    ).resolves.toBe(false);
  });
});
