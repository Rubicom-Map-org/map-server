import { Controller, Delete, HttpStatus, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseStorageService } from './firebase-storage.service';
import { UserId } from '../decorators/user-id.decorator';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { UploadFileResponseDto } from './dto/upload-file-response.dto';

@UseGuards(AuthGuard)
@Controller("upload")
export class FirebaseStorageController {

    constructor(private readonly firebaseStorageService: FirebaseStorageService) {}

    @ApiOperation({ summary: "Uploading user avatar image" })
    @ApiResponse({ status: HttpStatus.CREATED, type: UploadFileResponseDto })
    @ApiBearerAuth()
    @UseInterceptors(FileInterceptor('file'))
    @Post("avatar")
    async uploadFile(
        @UserId() userId: string,
        @UploadedFile() file: Express.Multer.File
    ): Promise<UploadFileResponseDto> {
        return this.firebaseStorageService.uploadAvatar(userId, file);
    }

    @ApiOperation({ summary: "Deleting avatar image" })
    @ApiBearerAuth()
    @ApiQuery({ name: "filePath", type: String })
    @Delete("avatar")
    async deleteFile(@UserId() userId: string): Promise<void> {
        return this.firebaseStorageService.deleteAvatar(userId);
    }
}
