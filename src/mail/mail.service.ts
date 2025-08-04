import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '../../generated/prisma';


@Injectable()
export class MailService {
    constructor(private readonly mailllerService: MailerService){}

    async sendOtp(email: string, otp: string) {
      await this.mailllerService.sendMail({
        to: email,
        subject: 'InBook uchun tasdiqlash kodi (OTP)',
        template: '', // agar siz `handlebars` shablon ishlatsangiz, bu yerga qo‘shing
        html: `
          <p>Assalomu alaykum!</p>
          <p>Siz tizimga kirish uchun OTP kod oldingiz:</p>
          <h2>${otp}</h2>
          <p>Kod faqat 1 daqiqa amal qiladi.</p>
        `
      });
    }
    
}
