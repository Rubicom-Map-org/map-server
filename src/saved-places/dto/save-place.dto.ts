import { ApiProperty } from '@nestjs/swagger';

class GeometryDto {
    @ApiProperty()
    readonly type: string;

    @ApiProperty()
    readonly coordinates: [number, number];
}

export class SavePlaceDto {
    @ApiProperty()
    readonly type: string;

    @ApiProperty()
    readonly properties: object;

    @ApiProperty()
    readonly geometry: GeometryDto;

}