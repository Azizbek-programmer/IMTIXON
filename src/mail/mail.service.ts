import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../../generated/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(user: User) {
  const url = `${process.env.API_URL}/api/auth/activate/${user.activationLink}`;

  const to = user.email && user.email.includes('@') 
    ? user.email 
    : 'azizbekmirzavaliyev31@gmail.com'; // fallback

  console.log('Yuborilayotgan email:', to); // Debug log

  await this.mailerService.sendMail({
    to,
    subject: `Welcome to Mebel Zone!`,
    template: 'confirmation',
    context: {
      username: user.full_name,
      url,
    },
  });
}

  
  async sendResetPasswordEmail(user: User, resetPasswordUrl: string) {
    await this.mailerService.sendMail({
      to: user.email || 'azizbekmirzavaliyev31@gmail.com',
      subject: 'Parolni tiklash',
      template: 'reset-password',
      context: {
        username: user.full_name,
        resetPasswordUrl,
      },
    });
    // console.log('Yuborilayotgan email:', user.email)
  }
}
