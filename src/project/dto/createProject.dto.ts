import { IsDateString, IsNotEmpty } from "class-validator";

export class CreateProjectDto {

    @IsNotEmpty()
    readonly title: string;

    @IsNotEmpty()
    readonly description: string;

    @IsDateString()
    readonly due: Date;
}