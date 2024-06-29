import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {DatabaseFile} from "./files.entity";
import {Repository} from "typeorm";
import {UsersService} from "../users/users.service";
import * as uuid from "uuid"
import * as path from "node:path";
import * as fs from "node:fs";

@Injectable()
export class FilesService {
    
    constructor(@InjectRepository(DatabaseFile)
                private readonly databaseFileRepository: Repository<DatabaseFile>,
                private readonly usersService: UsersService)
    {
    }
    
    async uploadFile(userId: string, file: any): Promise<DatabaseFile> {
        
        try {
            const user = await this.usersService.getUserById(userId)
            
            console.log("FILE_NAME: ", file.filename)
            console.log("FILE_PATH: ", file.path)
            console.log("FILE_MIMETYPE: ", file.mimetype)
            
            const newFile = this.databaseFileRepository.create({
                filename: file.filename,
                path: `uploads/${file.filename}`,
                mimetype: file.mimetype,
                user: user
            })
            
            user.file = newFile
            user.isAvatarSet = true
            user.avatarImageUrl = `uploads/${file.filename}`
            
            const updatedUser = await this.usersService.saveUser(user)
            
            console.log("UPDATED USER: ", updatedUser)
            console.log(newFile)
            
            return await this.databaseFileRepository.save(newFile)
            
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
        
    }
    
    async createFile(file: any): Promise<any> {
        try {
            const filename = uuid.v4() + ".jpg"
            const filepath = path.resolve(__dirname, "..", "uploads")
            if (!fs.existsSync(filepath)) {
                fs.mkdirSync(filepath, { recursive: true })
            }
            fs.writeFileSync(path.join(filepath, filename), file.buffer)
            return filename
        } catch (error) {
            throw new Error(error.message)
        }
    }
    
}
