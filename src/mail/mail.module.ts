import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Subscriber,
  SubscriberSchema,
} from 'src/subscribers/schemas/subscriber.schemas';
import {
  Scholarship,
  ScholarshipSchema,
} from 'src/scholarship/schemas/scholarship.schemas';
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('EMAIL_HOST'),
          secure: false,
          auth: {
            user: configService.get<string>('EMAIL_AUTH_USER'),
            pass: configService.get<string>('EMAIL_AUTH_PASS'),
          },
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },

        preview:
          configService.get<string>('EMAIL_PREVIEW') === 'true' ? true : false,
      }),
      inject: [ConfigService],
    }),
    //add mail 01234
    MongooseModule.forFeature([
      { name: Subscriber.name, schema: SubscriberSchema },
      { name: Scholarship.name, schema: ScholarshipSchema },
    ]),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule { }
