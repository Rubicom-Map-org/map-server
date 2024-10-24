import { ApiProperty } from '@nestjs/swagger';

export class UploadFileResponseDto {
    @ApiProperty()
    readonly url: string;
}