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

import { Role } from '@modules/role/entities/role.entity';
import { OtpModule } from '@modules/otp/otp.module';
import { EmailModule } from '@modules/email/email.module';
import appConfig from '@config/auth.config';

@Module({
  controllers: [RegistrationController],
  providers: [AuthenticationService, Repository, UserService, OtpService, EmailService],
  imports: [
    TypeOrmModule.forFeature([User, Otp, Role]),
    PassportModule,
    OtpModule,
    EmailModule,
    JwtModule.register({
      global: true,
      secret: appConfig().jwtSecret,
      signOptions: { expiresIn: `${appConfig().jwtExpiry}s` },
    }),
  ],
})
export class AuthModule {}
