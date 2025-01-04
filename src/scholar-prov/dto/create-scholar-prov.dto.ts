import { Transform, Type } from 'class-transformer';
import { IsArray, IsDate, IsEmail, IsMongoId, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsOptional, IsPhoneNumber, IsString, Max, Min, ValidateNested } from 'class-validator';
import mongoose from 'mongoose';



export class CreateScholarProvDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    location: string;

    @IsNotEmpty()
    @IsMongoId()
    provider: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    image: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    level: string[];

    @IsOptional()
    @IsNotEmpty()
    quantity: number;

    @IsNotEmpty()
    description: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    major: string[];

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(9)
    ielts: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(4)
    GPA: number;

    @IsOptional()
    @IsNumber()
    pay: number;

    @IsOptional()
    value: string

    @IsOptional()
    isActive: boolean;
}

