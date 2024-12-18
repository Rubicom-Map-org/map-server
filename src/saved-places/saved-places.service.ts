import {
    BadRequestException,
    HttpException,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {SavedPlace} from "./saved-places.entity";
import {DeleteResult, InsertResult, Repository} from "typeorm";
import {SavePlaceDto} from "./dto/save-place.dto";
import {UsersService} from "../users/users.service";
import { ExceptionMessage } from 'src/utils/exception-message.enum';
import { log } from 'console';
import { User } from 'src/users/users.entity';

@Injectable()
export class SavedPlacesService {

    constructor(
        @InjectRepository(SavedPlace)
        private readonly savedPlaceRepository: Repository<SavedPlace>,
        private readonly usersService: UsersService
    ) {}

    async savePlace(userId: string, savePlaceDto: SavePlaceDto): Promise<SavedPlace> {
        const user = await this.usersService.getUserById(userId);
            
        const insertionResult: InsertResult = await this.savedPlaceRepository
            .createQueryBuilder()
            .insert()
            .into(SavedPlace)
            .values({
                ...savePlaceDto,
                user: user
            })
            .execute();
            
        const savedPlace = await this.getSavedPlace(user.id, insertionResult.raw[0]);
        return await this.savedPlaceRepository.save(savedPlace);
    }

    async getSavedPlace(userId: string, savedPlaceId: string): Promise<SavedPlace> {
        const user = await this.usersService.getUserById(userId);
        const savedPlace = await this.savedPlaceRepository
            .createQueryBuilder()
            .where("id = :id AND user = :userId", {
                id: savedPlaceId,
                userId: user.id
            })
            .getOne();

        if (!savedPlace) throw new NotFoundException(ExceptionMessage.PLACE_NOT_FOUND);
        return savedPlace;
    }

    async getSavedPlaceByCoordinates(userId: string, coordinates: [number, number]): Promise<SavedPlace> {
        const user = await this.usersService.getUserById(userId);
        if (!user) {
            throw new NotFoundException(ExceptionMessage.USER_NOT_FOUND);
        }
            
        const savedPlace = await this.savedPlaceRepository
            .createQueryBuilder()
            .where('geometry.coordinates = :coordinates', { coordinates })
            .getOne();

        return savedPlace;
    }

    async getSavedPlaces(userId: string): Promise<SavedPlace[]> {
        const user = await this.usersService.getUserById(userId);
        const savedPlaces = await this.savedPlaceRepository
            .createQueryBuilder()
            .where("user = :userId", { userId: user.id })
                .getMany();

        if (!savedPlaces) throw new NotFoundException(ExceptionMessage.PLACE_NOT_FOUND);
        return savedPlaces;
    }

    async deleteSavedPlace(userId: string, savedPlaceId: string): Promise<void> {
        const user = await this.usersService.getUserById(userId)

        await this.savedPlaceRepository
            .createQueryBuilder()
            .delete()
            .where("id = :id AND user = :userId", {
                id: savedPlaceId,
                userId: user.id
            })
            .execute();
    }
}
