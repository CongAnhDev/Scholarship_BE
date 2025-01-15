import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateProviderDto {

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsArray()
    address: string[];

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    logo: string;

    @IsNotEmpty()
    background: string;
}
