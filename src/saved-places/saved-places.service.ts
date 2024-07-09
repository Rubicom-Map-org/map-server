import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {SavedPlace} from "./saved-places.entity";
import {Repository} from "typeorm";
import {SavePlaceDto} from "./dto/save-place.dto";
import {UsersService} from "../users/users.service";

@Injectable()
export class SavedPlacesService {

    constructor(@InjectRepository(SavedPlace)
                private readonly savedPlaceRepository: Repository<SavedPlace>,
                private readonly usersService: UsersService)
    {
    }

    async savePlace(userId: string, savePlaceDto: SavePlaceDto): Promise<SavedPlace> {
        const user = await this.usersService.getUserById(userId)

        const savedPlace = this.savedPlaceRepository.create({
            ...savePlaceDto,
            user: user
        })

        if (savedPlace.properties.name) throw new BadRequestException("This place is already saved")

        return savedPlace
    }

    async getSavedPlace(userId: string, savedPlaceId: string): Promise<SavedPlace> {
        const user = await this.usersService.getUserById(userId)
        const savedPlace = await this.savedPlaceRepository.findOne({
            where: {
                id: savedPlaceId,
                user: user
            }
        })

        return savedPlace
    }

    async getSavedPlaces(userId: string): Promise<SavedPlace[]> {
        const user = await this.usersService.getUserById(userId)
        const savedPlaces = await this.savedPlaceRepository.find({
            where: {user: user}
        })

        return savedPlaces
    }

    async deleteSavedPlace(userId: string, savedPlaceId: string): Promise<void> {
        const user = await this.usersService.getUserById(userId)
        const savedPlace = await this.savedPlaceRepository.findOne({
            where: {user: user}
        })
        //
        // const deletedPlace = await this.savedPlaceRepository.remove(savedPlaceId)
        // return deletedPlace
    }

}
