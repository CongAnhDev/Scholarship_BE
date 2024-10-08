import { IsArray, IsBoolean, IsEmail, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreateSubscriberDto {

    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsOptional()
    @IsString({ each: true })
    @IsArray()
    subject: string[];

    @IsOptional()
    @IsString({ each: true })
    @IsArray()
    level: string[];

}