import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthJwtPayload, EmailVerificationPayload, RefreshTokenPayload } from './interface/token.interface';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // Authentication token methods
  createAuthToken(payload: { userId: string; role: string }): string {
    const secret = this.configService.get<string>('JWT_AUTH_SECRET');
    if (!secret) throw new Error('JWT_AUTH_SECRET is not defined');

    // const expiresIn = this.configService.get<string>('JWT_AUTH_EXPIRES_IN', '15m');
    const expiresIn = this.configService.get<string>('JWT_AUTH_EXPIRES_IN', '7d');
    return this.jwtService.sign(payload, {
      secret,
      expiresIn,
    });
  }

  async verifyAuthToken(token: string): Promise<AuthJwtPayload> {
    const secret = this.configService.get<string>('JWT_AUTH_SECRET');
    if (!secret) throw new Error('JWT_AUTH_SECRET is not defined');
    return this.jwtService.verify<AuthJwtPayload>(token, { secret });
  }

  // Refresh token methods
  createRefreshToken(payload: { userId: string; role: string }): string {
    const secret = this.configService.get<string>('JWT_REFRESH_SECRET');
    if (!secret) throw new Error('JWT_REFRESH_SECRET is not defined');

    const expiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d');
    return this.jwtService.sign(payload, {
      secret,
      expiresIn,
    });
  }

  async verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
    const secret = this.configService.get<string>('JWT_REFRESH_SECRET');
    if (!secret) throw new Error('JWT_REFRESH_SECRET is not defined');
    return this.jwtService.verify<AuthJwtPayload>(token, { secret });
  }

  // Email verification token methods
  createEmailVerificationToken(payload: { userId: string; role: string }): string {
    const secret = this.configService.get<string>('JWT_EMAIL_SECRET');
    if (!secret) throw new Error('JWT_EMAIL_SECRET is not defined');

    const expiresIn = this.configService.get<string>('JWT_EMAIL_EXPIRES_IN', '1d');
    return this.jwtService.sign(payload, {
      secret,
      expiresIn,
    });
  }

  async verifyEmailToken(token: string): Promise<EmailVerificationPayload> {
    const secret = this.configService.get<string>('JWT_EMAIL_SECRET');
    if (!secret) throw new Error('JWT_EMAIL_SECRET is not defined');
    return this.jwtService.verify<EmailVerificationPayload>(token, { secret });
  }
}
