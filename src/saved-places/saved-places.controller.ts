import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Req,
    UseGuards,
    UsePipes, ValidationPipe
} from '@nestjs/common';
import {SavedPlacesService} from "./saved-places.service";
import {SavePlaceDto} from "./dto/save-place.dto";
import {SavedPlace} from "./saved-places.entity";
import {AuthGuard} from "../auth/auth.guard";
import {UserId} from "../decorators/user-id.decorator";

@UseGuards(AuthGuard)
@Controller('saved-places')
export class SavedPlacesController {

    constructor(private readonly savedPlacesService: SavedPlacesService) {}

    @UsePipes(ValidationPipe)
    @Post("/save-place")
    async savePlace(
        @UserId() userId: string,
        @Body() savedPlaceDto: SavePlaceDto
    ): Promise<SavedPlace> {
        return this.savedPlacesService.savePlace(userId, savedPlaceDto);
    }
    
    @Get("/:savedPlaceId")
    async getSavedPlace(
        @UserId() userId: string,
        @Param("savedPlaceId") savedPlaceId: string
    ): Promise<SavedPlace> {
        return this.savedPlacesService.getSavedPlace(userId, savedPlaceId);
    }
    
    @Get()
    async getSavedPlaces(@UserId() userId: string): Promise<SavedPlace[]> {
        return this.savedPlacesService.getSavedPlaces(userId)
    }
    
    @Delete()
    async deletePlaceFromList() {
        try {
            // return this.savedPlacesService.()
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Get("/")
    async getSavedPlaceByCoordinates(
        @UserId() userId: string,
        @Param("coordinates") coordinates: [ number, number ]
    ): Promise<SavedPlace> {
        return this.savedPlacesService.getSavedPlaceByCoordinates(userId, coordinates)
    }
}
