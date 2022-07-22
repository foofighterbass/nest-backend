import { IsNotEmpty } from "class-validator";

export class StatusTaskDto {

    @IsNotEmpty()
    readonly status: Number;

}