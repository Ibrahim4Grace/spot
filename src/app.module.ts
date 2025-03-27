import { Module, ValidationPipe } from '@nestjs/common';
import { BorrowerModule } from './modules/borrower/borrower.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_PIPE } from '@nestjs/core';
import { ClaimModule } from './modules/claim/claim.module';
import { GuaranteeModule } from './modules/guarantee/guarantee.module';
import { CollateralModule } from './modules/collateral/collateral.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { BullModule } from '@nestjs/bull';
import dataSource from '@database/data-source';
import authConfig from '@config/auth.config';
import { AuthGuard } from '@guards/auth.guard';
import { AuthModule } from './modules/auth/auth.module';
import serverConfig from '@config/server.config';
import { OtpModule } from '@modules/otp/otp.module';
import { EmailModule } from '@modules/email/email.module';
import { UserModule } from '@modules/user/user.module';
import { RoleModule } from '@modules/role/role.module';

@Module({
  providers: [
    {
      provide: 'CONFIG',
      useClass: ConfigService,
    },
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
        }),
    },
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
  ],
  imports: [
    ConfigModule.forRoot({
      /*
       * By default, the package looks for a env file in the root directory of the application.
       * We don't use ".env" file because it is prioritize as the same level as real environment variables.
       * To specify multiple. env files, set the envFilePath property.
       * If a variable is found in multiple files, the first one takes precedence.
       */

      envFilePath: ['.env', `.env.${process.env.PROFILE}`],
      load: [serverConfig, authConfig],
      isGlobal: true,
    }),
    LoggerModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        ...dataSource.options,
      }),
      dataSourceFactory: async () => dataSource,
    }),
    BorrowerModule,
    ClaimModule,
    GuaranteeModule,
    CollateralModule,
    AuthModule,
    UserModule,
    OtpModule,
    EmailModule,
    RoleModule,

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('SMTP_HOST'),
          port: configService.get<number>('SMTP_PORT'),
          auth: {
            user: configService.get<string>('SMTP_USER'),
            pass: configService.get<string>('SMTP_PASSWORD'),
          },
        },
        defaults: {
          from: `"Team Remote Bingo" <${configService.get<string>('SMTP_USER')}>`,
        },
        template: {
          dir: process.cwd() + '/src/modules/email/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      useFactory: () => ({
        redis: {
          host: authConfig().redis.host,
          port: +authConfig().redis.port,
          password: authConfig().redis.password,
          username: authConfig().redis.username,
        },
      }),
    }),
  ],
})
export class AppModule {}
