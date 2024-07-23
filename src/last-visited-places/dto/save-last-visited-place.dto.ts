import {Column, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../../users/users.entity";
import {IsNotEmpty, IsObject, IsString} from "class-validator";


export class SaveLastVisitedPlacesDto {
    
    @IsString()
    @IsNotEmpty()
    readonly id: string;
    
    @IsString()
    @IsNotEmpty()
    readonly type: string;
    
    @IsNotEmpty()
    readonly properties: any;
    
    @IsNotEmpty()
    @IsObject()
    readonly geometry: {
        type: string;
        coordinates: [number, number];
    };
    
}