import { Module } from '@nestjs/common';
import { ScholarProvService } from './scholar-prov.service';
import { ScholarProvController } from './scholar-prov.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ScholarProv, ScholarProvSchema } from './schemas/scholar-prov.schemas';
import { Provider, ProviderSchema } from 'src/provider/schemas/providers.schemas';
import { User, UserSchema } from 'src/users/schemas/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: ScholarProv.name, schema: ScholarProvSchema },
  { name: Provider.name, schema: ProviderSchema },
  { name: User.name, schema: UserSchema }
  ])],
  controllers: [ScholarProvController],
  providers: [ScholarProvService],
})
export class ScholarProvModule { }


