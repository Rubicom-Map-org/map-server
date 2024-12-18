import {Body, Controller, Get, HttpException, HttpStatus, Param, Post, UseGuards} from "@nestjs/common";
import {LastVisitedPlacesService} from "./last-visited-places.service";


@Controller('last-visited-places')
export class LastVisitedPlacesController {
    
    constructor(
        private readonly lastVisitedPlacesService: LastVisitedPlacesService,
    ) {}
    
    // @UseGuards(AuthGuard)
    // @Post("cache-place")
    // async cacheLastVisitedPlace(
    //     @UserId() userId: string,
    //     @Body() saveLastVisitedPlaceDto: SaveLastVisitedPlacesDto
    // ): Promise<void>
    // {
    //     try {
    //         return this.lastVisitedPlacesService.cacheLastVisitedPlace(userId, saveLastVisitedPlaceDto)
    //     } catch (error) {
    //         if (error instanceof HttpException) {
    //             throw Error
    //         }
    //         throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    //     }
    // }
    
    // @Get("get-one")
    // async getLastVisitedPlace(@Param() placeId: string): Promise<GetLastVisitedPlaceDto>
    // {
    //     try {
    //         return this.lastVisitedPlacesService.getLastVisitedPlace(placeId)
    //     } catch(error) {
    //         throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    //     }
    // }
    
}