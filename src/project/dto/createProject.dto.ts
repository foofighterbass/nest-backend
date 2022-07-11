import { IsDate, IsNotEmpty } from "class-validator";

export class CreateProjectDto {

    @IsNotEmpty()
    readonly title: string;

    @IsNotEmpty()
    readonly description: string;

    @IsDate()
    readonly due: Date;
}