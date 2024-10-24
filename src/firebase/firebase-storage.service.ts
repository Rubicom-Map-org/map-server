import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { UsersService } from '../users/users.service';
import { UploadFileResponseDto } from './dto/upload-file-response.dto';

@Injectable()
export class FirebaseStorageService {

    private readonly firebaseStorage: admin.storage.Storage;

    constructor(
        @Inject("FIREBASE_ADMIN")
        private readonly firebaseAdmin: admin.app.App,
        private readonly usersService: UsersService
    ) {
        this.firebaseStorage = this.firebaseAdmin.storage();
    }

    async uploadAvatar(userId: string, file: Express.Multer.File): Promise<UploadFileResponseDto> {
        try {
            const user = await this.usersService.getUserById(userId);
            const bucket = this.firebaseStorage.bucket();
            const filePath = `uploads/avatars/${userId}`;

            const fileUpload = bucket.file(filePath);
            await fileUpload.save(file.buffer, { metadata: { contentType: file.mimetype, } });

            const [url] = await fileUpload.getSignedUrl({
                action: 'read',
                expires: '12-31-2025',
            });

            user.avatarImageUrl = url;
            user.isAvatarSet = true;
            await this.usersService.saveUser(user);

            return { url };
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async deleteAvatar(userId: string): Promise<void> {
        const user = await this.usersService.getUserById(userId);
        const bucket = this.firebaseStorage.bucket();
        await bucket.file(user.avatarImageUrl).delete();

        user.avatarImageUrl = null;
        user.isAvatarSet = false;
        await this.usersService.saveUser(user);
    }

}