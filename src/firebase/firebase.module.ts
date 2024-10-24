import { Global, Module } from '@nestjs/common';
import { FirebaseStorageService } from './firebase-storage.service';
import * as admin from "firebase-admin";
import { ConfigService } from '@nestjs/config';
import { FirebaseStorageController } from './firebase-storage.controller';
import { UsersModule } from '../users/users.module';

@Global()
@Module({
    providers: [
        FirebaseStorageService,
        {
            provide: "FIREBASE_ADMIN",
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const adminConfig = {
                    credential: admin.credential.cert({
                        // @ts-ignore
                        type: configService.get<string>('FIREBASE_SERVICE_ACCOUNT_TYPE'),
                        projectId: configService.get<string>('FIREBASE_SERVICE_ACCOUNT_PROJECT_ID'),
                        privateKeyId: configService.get<string>('FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY_ID'),
                        privateKey: configService.get<string>('FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY').replace(/\\n/g, '\n'),
                        clientEmail: configService.get<string>('FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL'),
                        clientId: configService.get<string>('FIREBASE_SERVICE_ACCOUNT_CLIENT_ID'),
                        authUri: configService.get<string>('FIREBASE_SERVICE_ACCOUNT_AUTH_URI'),
                        tokenUri: configService.get<string>('FIREBASE_SERVICE_ACCOUNT_TOKEN_URI'),
                        authProviderX509CertUrl: configService.get<string>('FIREBASE_SERVICE_ACCOUNT_AUTH_PROVIDER_x509_CERT_URL'),
                        clientC509CertUrl: configService.get<string>('FIREBASE_SERVICE_ACCOUNT_CLIENT_x509_CERT_URL'),
                    }),
                    storageBucket: `${configService.get<string>("FIREBASE_SERVICE_ACCOUNT_PROJECT_ID")}.appspot.com`,
                }
                return admin.initializeApp(adminConfig);
            }
        },
    ],
    controllers: [FirebaseStorageController],
    imports: [UsersModule],
    exports: [FirebaseStorageService, "FIREBASE_ADMIN"],
})
export class FirebaseModule {}