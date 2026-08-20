import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';

const PASSWORD_HASH_ROUNDS = 12;

@Injectable()
export class PasswordService {
  hash(password: string): Promise<string> {
    return hash(password, PASSWORD_HASH_ROUNDS);
  }

  verify(password: string, passwordHash: string): Promise<boolean> {
    return compare(password, passwordHash);
  }
}
