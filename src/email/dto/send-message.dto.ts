import {IsNotEmpty} from "class-validator";


export class SendMessageDto {

    @IsNotEmpty({message: "Введіть ваш запит"})
    readonly message: string;

}