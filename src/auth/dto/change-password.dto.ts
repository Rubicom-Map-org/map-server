import {IsEmail, IsNotEmpty, Length} from "class-validator";


export class ChangePasswordDto {

    @IsEmail({}, {message: "Email is required"})
    @Length(6, 99)
    readonly email: string;

    @Length(8, 99, {message: "Password is too short"})
    @IsNotEmpty({message: "Password can not be empty"})
    readonly password: string;

}