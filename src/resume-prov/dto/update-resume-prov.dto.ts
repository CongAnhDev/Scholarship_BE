import { PartialType } from '@nestjs/mapped-types';

import { IsArray, IsEmail, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { Types } from 'mongoose';
import { Type } from 'class-transformer';
import { CreateResumeProDto } from './create-resume-prov.dto';

class UpdateBy {
    @IsNotEmpty()
    _id: Types.ObjectId;

    @IsNotEmpty()
    @IsEmail()
    email: Types.ObjectId;
}


class History {
    @IsNotEmpty()
    status: string;

    @IsOptional()
    note: string;

    @IsNotEmpty()
    updatedAt: Date;

    @ValidateNested()
    @IsNotEmpty()
    @Type(() => UpdateBy)
    updatedBy: UpdateBy;
}

export class UpdateResumeProDto extends PartialType(CreateResumeProDto) {
    @IsNotEmpty()
    @IsArray()
    @ValidateNested()
    @Type(() => History)
    history: History[];
}