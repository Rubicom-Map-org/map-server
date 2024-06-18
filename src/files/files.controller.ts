import {Body, Controller, HttpException, HttpStatus, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {FileInterceptor} from "@nestjs/platform-express";

@Controller('files')
export class FilesController {

    // @Post()
    // @UseInterceptors(FileInterceptor('file', {
    //     storage: diskStorage({
    //         destination: './uploads/files',
    //         filename: (req, file, cb) => {
    //             const randomName = Array(32).fill(null).map(() =>
    //                 (Math.round(Math.random() * 16)).toString(16)).join('');
    //             return cb(null, `${randomName}${extname(file.originalname)}`);
    //         },
    //     }),
    // }))
    // create(@UploadedFile() file) {
    //     try {
    //
    //     // } catch (error) {
    //         return this.certificatesService.create(createCertificateDto, file);
    //         if (error instanceof HttpException) throw Error
    //         throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    //     }
    // }

}
