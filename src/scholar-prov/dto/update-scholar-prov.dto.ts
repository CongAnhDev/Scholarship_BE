import { PartialType } from '@nestjs/swagger';
import { CreateScholarProvDto } from './create-scholar-prov.dto';

export class UpdateScholarProvDto extends PartialType(CreateScholarProvDto) {}
