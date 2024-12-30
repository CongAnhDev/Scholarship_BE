import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateQuestionDto {
    @IsNotEmpty()
    question: string;

    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    option: string[];

    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    answer: string[];

    @IsNotEmpty()
    @IsNumber()
    quiz: number;// aa
}