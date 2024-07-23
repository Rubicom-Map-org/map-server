import {IsNotEmpty, IsObject, IsString} from "class-validator";


export class GetLastVisitedPlaceDto {
    
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