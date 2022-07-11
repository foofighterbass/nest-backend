import { IsDateString, IsNotEmpty } from "class-validator";

export class UpdateProjectDto {

    readonly title: string;

    readonly description: string;

    @IsDateString()
    readonly due: Date;
}