import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { MailInterface } from './interface/message.interface';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';

@Processor('emailSending')
export default class EmailQueueConsumer {
  private logger = new Logger(EmailQueueConsumer.name);
  constructor(private readonly mailerService: MailerService) {}

  @Process('register-otp')
  async sendTokenEmailJob(job: Job<MailInterface>) {
    try {
      const {
        data: { mail },
      } = job;
      this.logger.log(`Processing register-otp job for ${mail.to} with context: ${JSON.stringify(mail.context)}`);
      await this.mailerService.sendMail({
        ...mail,
        subject: 'Welcome to My App! Confirm your Email',
        template: 'register-otp',
      });
      this.logger.log(`Register OTP email sent successfully to ${mail.to}`);
    } catch (sendTokenEmailJobError) {
      this.logger.error(`EmailQueueConsumer ~ sendTokenEmailJobError:   ${sendTokenEmailJobError}`);
    }
  }

  @Process('welcome')
  async sendWelcomeEmailJob(job: Job<MailInterface>) {
    try {
      const {
        data: { mail },
      } = job;
      await this.mailerService.sendMail({
        ...mail,
        subject: 'Welcome to My App! Confirm your Email',
        template: 'Welcome-Template',
      });
      this.logger.log(`Welcome email sent successfully to ${mail.to}`);
    } catch (sendWelcomeEmailJobError) {
      this.logger.error(`EmailQueueConsumer ~ sendWelcomeEmailJobError:  ${sendWelcomeEmailJobError}`);
    }
  }

  @Process('forgot-password')
  async sendOtpEmailJob(job: Job<MailInterface>) {
    try {
      const {
        data: { mail },
      } = job;

      await this.mailerService.sendMail({
        ...mail,
        subject: 'Your 6-digit Verification Code',
        template: 'otp-Template',
      });
      this.logger.log(`Otp verification email sent successfully to ${mail.to}`);
    } catch (sendOtpEmailJobError) {
      this.logger.error(`EmailQueueConsumer ~ sendOtpEmailJobError: ${sendOtpEmailJobError}`);
    }
  }

  @Process('reset-password')
  async sendResetPasswordEmailJob(job: Job<MailInterface>) {
    try {
      const {
        data: { mail },
      } = job;

      await this.mailerService.sendMail({
        ...mail,
        subject: 'Reset Password',
        template: 'Reset-Password-Template',
      });
      this.logger.log(`Reset password email sent successfully to ${mail.to}`);
    } catch (sendResetPasswordEmailJobError) {
      this.logger.error(`EmailQueueConsumer ~ sendResetPasswordEmailJobError: ${sendResetPasswordEmailJobError}`);
    }
  }

  @Process('login-otp')
  async sendLoginOtpEmailJob(job: Job<MailInterface>) {
    try {
      const {
        data: { mail },
      } = job;
      await this.mailerService.sendMail({
        ...mail,
        subject: 'Login with OTP',
        template: 'login-otp',
      });
      this.logger.log(`Login OTP email sent successfully to ${mail.to}`);
    } catch (sendLoginOtpEmailJobError) {
      this.logger.error(`EmailQueueConsumer ~ sendLoginOtpEmailJobError:   ${sendLoginOtpEmailJobError}`);
    }
  }
}
