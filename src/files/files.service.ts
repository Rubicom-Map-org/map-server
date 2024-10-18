import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {DatabaseFile} from "./files.entity";
import {Repository} from "typeorm";
import {UsersService} from "../users/users.service";
import * as uuid from "uuid";
import * as path from "node:path";
import * as fs from "node:fs";
import { User } from '../users/users.entity';

@Injectable()
export class FilesService {
    
    constructor(
        @InjectRepository(DatabaseFile)
        private readonly databaseFileRepository: Repository<DatabaseFile>,
        private readonly usersService: UsersService
    ) {}
    
    async uploadFile(userId: string, file: any): Promise<DatabaseFile> {
        try {
            const user = await this.usersService.getUserById(userId);
            const newFile = this.databaseFileRepository.create({
                filename: file.filename,
                path: `uploads/${file.filename}`,
                mimetype: file.mimetype,
                user: user
            });

            await this.usersService.saveUser({
                ...user,
                file: newFile,
                isAvatarSet: true,
                avatarImageUrl: `uploads/${file.filename}`
            } as User);
            return await this.databaseFileRepository.save(newFile);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    async createFile(file: any): Promise<string> {
        try {
            const filename = uuid.v4() + ".jpg";
            const filepath = path.resolve(__dirname, "..", "uploads");
            if (!fs.existsSync(filepath)) {
                fs.mkdirSync(filepath, { recursive: true });
            }
            fs.writeFileSync(path.join(filepath, filename), file.buffer);
            return filename;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
