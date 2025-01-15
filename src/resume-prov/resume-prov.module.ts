import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import {
  Provider,
  ProviderSchema,
} from 'src/provider/schemas/providers.schemas';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { ResumeProvController } from './resume-prov.controller';
import { ResumeProvService } from './resume-prov.service';
import { ResumePro, ResumeProSchema } from './schemas/resume-prov.schemas';
import { MailModule } from 'src/mail/mail.module';
import { ExcelModule } from 'src/excel/excel.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ResumePro.name, schema: ResumeProSchema },
      { name: Provider.name, schema: ProviderSchema },
      { name: User.name, schema: UserSchema },
    ]),
    CloudinaryModule,
    ExcelModule,
    MailModule,
  ],
  controllers: [ResumeProvController],
  providers: [ResumeProvService],
})
export class ResumeProvModule { }
