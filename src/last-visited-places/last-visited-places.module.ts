import {Module} from "@nestjs/common";
import * as process from "node:process";
import * as dotenv from "dotenv";
import {UsersModule} from "../users/users.module";
import {CacheModule} from "@nestjs/common/cache";
import * as redisStore from 'cache-manager-redis-store';
import {LastVisitedPlacesService} from "./last-visited-places.service";
import {LastVisitedPlacesController} from "./last-visited-places.controller";
import {JwtModule} from "@nestjs/jwt";
dotenv.config();

@Module({
    providers: [LastVisitedPlacesService],
    controllers: [LastVisitedPlacesController],
    imports: [
        // CacheModule.registerAsync({
        //     isGlobal: true,
        //     useFactory: () => ({
        //         // @ts-ignore
        //         store: redisStore,
        //         url: process.env.REDIS_URL,
        //     }),
        // }),
        CacheModule.register(),
        UsersModule,
        JwtModule
    ],
    exports: [LastVisitedPlacesService]
})
export class LastVisitedPlacesModule {}