import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {SavedPlace} from "./saved-places.entity";
import {InsertResult, Repository} from "typeorm";
import {SavePlaceDto} from "./dto/save-place.dto";
import {UsersService} from "../users/users.service";
import { ExceptionMessage } from 'src/utils/exception-message.enum';
import { log } from 'console';
import { User } from 'src/users/users.entity';

@Injectable()
export class SavedPlacesService {

    constructor(@InjectRepository(SavedPlace)
                private readonly savedPlaceRepository: Repository<SavedPlace>,
                private readonly usersService: UsersService)
    {
    }

    async savePlace(userId: string, savePlaceDto: SavePlaceDto): Promise<SavedPlace> {
        const user = await this.usersService.getUserById(userId)
        
        const insertionResult: InsertResult = await this.savedPlaceRepository
            .createQueryBuilder()
            .where("savedPlace.user = :user", { user: user.id })
            .insert()
            .into(SavedPlace)
            .values({
                ...savePlaceDto,
                user: user
            })
            .execute();
        
        const savedPlace = await this.savedPlaceRepository.findOne(insertionResult.raw[0]);
        console.log("SAVED PLACE: ", savedPlace)
            
        const checkExistingSavedPlaceInDB = await this.getSavedPlaceByCoordinates(user.id, savedPlace.geometry.coordinates);
        console.log('Check existing saved place:', checkExistingSavedPlaceInDB);
        if (checkExistingSavedPlaceInDB) throw new BadRequestException(ExceptionMessage.PLACE_ALREADY_SAVED);

        return await this.savedPlaceRepository.save(savedPlace)
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

    async getSavedPlaceByCoordinates(userId: string, coordinates: [number, number]): Promise<SavedPlace>
    {
        const user = await this.usersService.getUserById(userId)
        if (!user) throw new NotFoundException(ExceptionMessage.USER_NOT_FOUND)

        const savedPlace = await this.savedPlaceRepository.findOne({
            where: { 
                // @ts-ignore
                geometry: {
                    coordinates: coordinates
                },
                user: user
             }
        })

        return savedPlace;
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
