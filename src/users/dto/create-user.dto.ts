import { Type } from 'class-transformer';
import { IsEmail, IsMongoId, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsOptional, IsPhoneNumber, Max, Min, ValidateNested } from 'class-validator';
import mongoose from 'mongoose';

// class Provider { //validate obj provider
//     @IsNotEmpty()
//     _id: mongoose.Schema.Types.ObjectId;

//     @IsNotEmpty()
//     name: string;
// }

export class CreateUserDto { //admin
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    avatar: string;

    @IsNotEmpty()
    age: number;

    @IsNotEmpty()
    address: string;

    @IsNotEmpty()
    @IsPhoneNumber('VN')
    phone: number;

    @IsNotEmpty()
    gender: string;

    @IsNotEmpty()
    isActive: boolean;

    @IsNotEmpty()
    @IsMongoId()
    role: mongoose.Schema.Types.ObjectId;

}

export class RegisterUserDto {
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    age: number;

    @IsNotEmpty()
    @IsPhoneNumber('VN')
    phone: number;

    @IsNotEmpty()
    address: string;

    @IsNotEmpty()
    gender: string;

}

export class CodeAuthDto {

    @IsNotEmpty()
    _id: string;

    @IsNotEmpty()
    code: string;

}


export class ChangePasswordDto {
    @IsNotEmpty()
    currentPassword: string;

    @IsNotEmpty()
    newPassword: string;
}


export class ChangePasswordAuthDto {
    @IsNotEmpty({ message: "code không được để trống" })
    code: string;

    @IsNotEmpty({ message: "password không được để trống" })
    password: string;

    @IsNotEmpty({ message: "confirmPassword không được để trống" })
    confirmPassword: string;

    @IsNotEmpty({ message: "email không được để trống" })
    email: string;

}
