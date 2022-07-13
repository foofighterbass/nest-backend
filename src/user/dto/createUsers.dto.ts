import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUsersDto {
    
    @IsNotEmpty()
    readonly name: string;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    readonly password: string;

    @IsNotEmpty()
    readonly phone: string;
}