import { IsEmail } from "class-validator";

export class AddMemberDto {
    @IsEmail()
    readonly email: string;
}