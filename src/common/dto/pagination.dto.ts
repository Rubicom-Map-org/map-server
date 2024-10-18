import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {

    @IsOptional()
    @ApiProperty()
    readonly skip: number = 1;

    @IsOptional()
    @ApiProperty()
    readonly take: number = 10;

}