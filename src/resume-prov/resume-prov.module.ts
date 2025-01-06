import { Module } from '@nestjs/common';
import { ResumeProvController } from './resume-prov.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ResumeProvService } from './resume-prov.service';
import { ResumePro, ResumeProSchema } from './schemas/resume-prov.schemas';
import { Provider, ProviderSchema } from 'src/provider/schemas/providers.schemas';
import { User, UserSchema } from 'src/users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ResumePro.name, schema: ResumeProSchema },
      { name: Provider.name, schema: ProviderSchema },
      { name: User.name, schema: UserSchema }
    ]),
  ],
  controllers: [ResumeProvController],
  providers: [ResumeProvService],
})
export class ResumeProvModule { }
