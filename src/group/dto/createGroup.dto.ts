import { IsDateString, IsNotEmpty } from "class-validator";

export class CreateGroupDto {

    @IsNotEmpty()
    readonly title: string;

    @IsNotEmpty()
    readonly description: string;

    @IsDateString()
    readonly due: Date;

}