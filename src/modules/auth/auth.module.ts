import { Module } from '@nestjs/common';
import RegistrationController from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { User } from '@modules/user/entities/user.entity';
import AuthenticationService from './auth.service';
import { Repository } from 'typeorm';
import UserService from '@modules/user/user.service';
import { OtpService } from '@modules/otp/otp.service';
import { EmailService } from '@modules/email/email.service';
import { Otp } from '@modules/otp/entities/otp.entity';
import { TokenService } from '@modules/token/token.service';
import { Role } from '@modules/role/entities/role.entity';
import { OtpModule } from '@modules/otp/otp.module';
import { EmailModule } from '@modules/email/email.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PasswordService } from '../auth/password.service';
import { AuthHelperService } from './auth-helper.service';

@Module({
  controllers: [RegistrationController],
  providers: [
    AuthenticationService,
    Repository,
    UserService,
    OtpService,
    TokenService,
    EmailService,
    PasswordService,
    AuthHelperService,
  ],
  imports: [
    TypeOrmModule.forFeature([User, Otp, Role]),
    PassportModule,
    OtpModule,
    EmailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_AUTH_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AuthModule {}
