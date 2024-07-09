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
import {SaveSaveDto} from "./dto/save-save.dto";
import {SavedPlace} from "./saved-places.entity";
import {AuthGuard} from "@nestjs/passport";
import {UserId} from "../decorators/user-id.decorator";

// @UseGuards(AuthGuard)
@Controller('saved-places')
export class SavedPlacesController {

    constructor(private readonly savedPlacesService: SavedPlacesService) {
    }

    @UsePipes(ValidationPipe)
    @Post("/save-place")
    async savePlace(@UserId() userId: string,
                    @Body() savedPlaceDto: SaveSaveDto): Promise<SavedPlace>
    {
        try {
            return this.savedPlacesService.savePlace(userId, savedPlaceDto);
        } catch (error) {
            if (error instanceof HttpException) throw Error
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    
    @Get("/:savedPlaceId")
    async getSavedPlace(@UserId() userId: string,
                        @Param("savedPlaceId") savedPlaceId: string): Promise<SavedPlace> {
        try {
            return this.savedPlacesService.getSavedPlace(userId, savedPlaceId);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    
    @Get("/")
    async getSavedPlaces(@UserId() userId: string): Promise<SavedPlace[]> {
        try {
            return this.savedPlacesService.getSavedPlaces(userId)
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    
    @Delete("")
    async deletePlaceFromList() {
        try {
            // return this.savedPlacesService.()
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

}
