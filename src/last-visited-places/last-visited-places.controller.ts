import {Body, Controller, Get, HttpException, HttpStatus, Param, Post} from "@nestjs/common";
import {LastVisitedPlacesService} from "./last-visited-places.service";
import {SaveLastVisitedPlacesDto} from "./dto/save-last-visited-place.dto";
import {GetLastVisitedPlaceDto} from "./dto/get-last-visited-place.dto";


@Controller('last-visited-places')
export class LastVisitedPlacesController {
    
    constructor(
        private readonly lastVisitedPlacesService: LastVisitedPlacesService,
    ) {
    }
    
    
    @Post("cache-place")
    async cacheLastVisitedPlace(@Body() saveLastVisitedPlaceDto: SaveLastVisitedPlacesDto): Promise<void>
    {
        try {
            return this.lastVisitedPlacesService.cacheLastVisitedPlace(saveLastVisitedPlaceDto)
        } catch (error) {
            if (error instanceof HttpException) {
                throw Error
            }
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    
    @Get("get-one")
    async getLastVisitedPlace(@Param() placeId: string): Promise<GetLastVisitedPlaceDto>
    {
        try {
            return this.lastVisitedPlacesService.getLastVisitedPlace(placeId)
        } catch(error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    
}