import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { strict } from 'assert';


@Module({
  imports:[MailerModule.forRootAsync({
    useFactory: async(config: ConfigService) => ({
      transport:{
        host: config.get<string>("smtp_host!"),
        secure: false,
        auth: {
          user: config.get<string>("smtp_user!"), 
          pass: config.get<string>("smtp_password!") 
        }
      },
      defaults: {
        from: `InBook <${config.get<string>("smtp_password!")}>`,
      }
      
    }),
    inject: [ConfigService]
  })],
  providers: [MailService],
  exports:[MailService]
})
export class MailModule {}
