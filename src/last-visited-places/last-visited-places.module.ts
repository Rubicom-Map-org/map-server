import {Module} from "@nestjs/common";
import * as dotenv from "dotenv";
import {LastVisitedPlacesService} from "./last-visited-places.service";
import {LastVisitedPlacesController} from "./last-visited-places.controller";
dotenv.config();

@Module({
    providers: [LastVisitedPlacesService],
    controllers: [LastVisitedPlacesController],
    imports: [],
    exports: [LastVisitedPlacesService]
})
export class LastVisitedPlacesModule {}