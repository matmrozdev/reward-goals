import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { LoginDto } from './dto/login.dto';
import type { RefreshTokenDto } from './dto/refresh-token.dto';
import type { RegisterDto } from './dto/register.dto';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';
import type { LoginResponseDto, TokenPairDto } from './dto/auth-response.dto';
import type { PublicUser } from './auth.types';

const publicUserSelect = {
  id: true,
  email: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

const DUMMY_PASSWORD_HASH =
  '$2b$12$C6UzMDM.H6dfI/f/IKcEe.yr9HOqLQY0Y8j9YxZlT9r3Wf8oQyY1m';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
  ) {}

  async register(input: RegisterDto): Promise<PublicUser> {
    const email = normalizeEmail(input.email);
    const passwordHash = await this.passwordService.hash(input.password);

    try {
      return await this.prisma.user.create({
        data: { email, passwordHash },
        select: publicUserSelect,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'An account with this email already exists',
        );
      }

      throw error;
    }
  }

  async login(input: LoginDto): Promise<LoginResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: normalizeEmail(input.email) },
    });
    const passwordIsValid = await this.passwordService.verify(
      input.password,
      user?.passwordHash ?? DUMMY_PASSWORD_HASH,
    );

    if (!user || !passwordIsValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.tokenService.issuePair(user.id);
    await this.prisma.refreshSession.create({
      data: {
        ...tokens.refreshState,
        userId: user.id,
      },
    });

    return {
      user: toPublicUser(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async getCurrentUser(userId: string): Promise<PublicUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: publicUserSelect,
    });

    if (!user) {
      throw new UnauthorizedException('Invalid access token');
    }

    return user;
  }

  async refresh(input: RefreshTokenDto): Promise<TokenPairDto> {
    const payload = await this.tokenService.verifyRefreshToken(
      input.refreshToken,
    );
    const replacement = await this.tokenService.issuePair(payload.sub);
    const now = new Date();

    await this.prisma.$transaction(async (transaction) => {
      const consumed = await transaction.refreshSession.updateMany({
        where: {
          id: payload.jti,
          userId: payload.sub,
          tokenHash: this.tokenService.hashRefreshToken(input.refreshToken),
          expiresAt: { gt: now },
          revokedAt: null,
        },
        data: { revokedAt: now },
      });

      if (consumed.count !== 1) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      await transaction.refreshSession.create({
        data: {
          ...replacement.refreshState,
          userId: payload.sub,
        },
      });
    });

    return {
      accessToken: replacement.accessToken,
      refreshToken: replacement.refreshToken,
    };
  }

  async logout(input: RefreshTokenDto): Promise<void> {
    const payload = await this.tokenService.verifyRefreshToken(
      input.refreshToken,
    );
    const revoked = await this.prisma.refreshSession.updateMany({
      where: {
        id: payload.jti,
        userId: payload.sub,
        tokenHash: this.tokenService.hashRefreshToken(input.refreshToken),
        expiresAt: { gt: new Date() },
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });

    if (revoked.count !== 1) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function toPublicUser(
  user: PublicUser & { passwordHash?: string },
): PublicUser {
  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
  };
}
