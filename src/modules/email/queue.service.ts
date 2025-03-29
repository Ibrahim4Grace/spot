import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { MailInterface } from './interface/message.interface';
import { Injectable } from '@nestjs/common';

Injectable();
export default class QueueService {
  constructor(
    @InjectQueue('emailSending')
    private readonly emailQueue: Queue,
  ) {}

  async sendMail({ variant, mail }: MailSender) {
    const mailJob = await this.emailQueue.add(variant, { mail });
    return { jobId: mailJob.id };
  }
}

export interface MailSender {
  mail: MailInterface;
  variant: 'register-otp' | 'welcome' | 'forgot-otp' | 'reset-successful';
}
