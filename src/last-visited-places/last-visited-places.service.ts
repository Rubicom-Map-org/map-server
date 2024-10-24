import {Inject, Injectable} from "@nestjs/common";
import { CACHE_MANAGER } from '@nestjs/common/cache';
import { UsersService } from '../users/users.service';
import { SaveLastVisitedPlacesDto } from './dto/save-last-visited-place.dto';
import { GetLastVisitedPlaceDto } from './dto/get-last-visited-place.dto';

@Injectable()
export class LastVisitedPlacesService {

    // constructor(
    //     private readonly userService: UsersService,
    //     @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
    // ) {}
    //
    // async cacheLastVisitedPlace(userId: string, saveLastVisitedPlaceDto: SaveLastVisitedPlacesDto): Promise<void> {
    //     const user = await this.userService.getUserById(userId);
    //     const cacheKey = `userId:${user.id}/lastVisitedPlace:${saveLastVisitedPlaceDto.id}`;
    //     const ttl = 7 * 24 * 60 * 60;
    //
    //     const savedLastVisitedPlace = {
    //         ...saveLastVisitedPlaceDto,
    //         userId: user.id
    //     }
    //     await this.cacheManager.set(cacheKey, JSON.stringify(savedLastVisitedPlace), ttl);
    // }
    //
    // async getLastVisitedPlace(placeId: string): Promise<GetLastVisitedPlaceDto> {
    //     const cacheKey = `lastVisitedPlace_${placeId}`
    //     const cachedValue = await this.cacheManager.get(cacheKey)
    //
    //     return cachedValue ? JSON.parse(cacheKey) as GetLastVisitedPlaceDto : null;
    // }
    //
    // async clearCache(placeId: string): Promise<void> {
    //     const cacheKey = `lastVisitedPlace_${placeId}`
    //     await this.cacheManager.delete(cacheKey)
    // }
}