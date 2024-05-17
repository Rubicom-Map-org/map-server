import {IsEmail, IsNotEmpty, Length} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";


export class LoginDto {

    @ApiProperty({example: "yura.ilchyshyn06@gmail.com"})
    @IsEmail()
    @IsNotEmpty({message: "Email can not be empty"})
    readonly email: string;

    @ApiProperty({
        example: "asdafae9f90sdf90a90ewkf9ks9a0dofop9spef9p93f9",
        description: "hashed password to data base"
    })
    @Length(6, 100)
    readonly password: string;

}