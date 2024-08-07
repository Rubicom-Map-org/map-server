import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Inject, Patch,
    Post,
    Req,
    UploadedFile, UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {FileInterceptor} from "@nestjs/platform-express";
import {FilesService} from "./files.service";
import { multerConfig } from "./multer.config";
import {AuthGuard} from "../auth/auth.guard";
import {UserId} from "../decorators/user-id.decorator";

@Controller('files')
export class FilesController {
    
    constructor(private readonly filesService: FilesService) {}
    
    @UseGuards(AuthGuard)
    @Patch("/upload-file")
    @UseInterceptors(FileInterceptor("file", multerConfig))
    async uploadFile(@UserId() userId: string, {file}: { file: any }) {
        try {
            console.log("FILE: ", file)
            console.log(file.filename)
            console.log(file.path)
            return this.filesService.uploadFile(userId, file)
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    
    @Post("/create-file")
    @UseInterceptors(FileInterceptor("file"))
    async (@UploadedFile("file") file: any): Promise<any> {
        try {
            return this.filesService.createFile(file)
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    
}

