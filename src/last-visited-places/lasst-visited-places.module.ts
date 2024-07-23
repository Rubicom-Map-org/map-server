import {Module} from "@nestjs/common";
import {CacheModule} from "@nestjs/common/cache";


@Module({
    providers: [],
    controllers: [],
    imports: [
        CacheModule.register({})
    ],
    exports: []
})
export class LastVisitedPlacesModule {}