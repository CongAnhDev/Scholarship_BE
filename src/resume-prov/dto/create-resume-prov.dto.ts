import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";
import mongoose from "mongoose";


export class CreateResumeProDto {

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    userId: mongoose.Schema.Types.ObjectId;

    @IsOptional()
    @IsString()
    urlCV: string;

    @IsNotEmpty()
    status: string;

    @IsNotEmpty()
    @IsMongoId()
    scholarProv: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty()
    note: string;

    @IsNotEmpty()
    @IsMongoId()
    provider: mongoose.Schema.Types.ObjectId;

}

export class CreateUserCvProDto {

    @IsOptional()
    @IsString()
    urlCV: string;

    @IsNotEmpty()
    @IsMongoId()
    scholarProv: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty()
    @IsMongoId()
    provider: mongoose.Schema.Types.ObjectId;

    @IsOptional()
    note: string;
}