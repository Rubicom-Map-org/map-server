import {
    Controller,
    Patch,
    Post,
    UploadedFile, UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {FileInterceptor} from "@nestjs/platform-express";
import {FilesService} from "./files.service";
import {AuthGuard} from "../auth/auth.guard";
import {UserId} from "../decorators/user-id.decorator";
import { DatabaseFile } from './files.entity';

@Controller('files')
export class FilesController {
    
    constructor(private readonly filesService: FilesService) {}
    
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor("file"))
    @Patch("upload-file")
    async uploadFile(@UserId() userId: string, file: Express.Multer.File): Promise<DatabaseFile> {
        return this.filesService.uploadFile(userId, file);
    }
    
    @UseInterceptors(FileInterceptor("file"))
    @Post("create-file")
    async (@UploadedFile("file") file: Express.Multer.File): Promise<string> {
        return this.filesService.createFile(file);
    }
}

