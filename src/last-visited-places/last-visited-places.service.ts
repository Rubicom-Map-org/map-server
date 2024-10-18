import {HttpException, HttpStatus, Inject, Injectable} from "@nestjs/common";
import {SaveLastVisitedPlacesDto} from "./dto/save-last-visited-place.dto";
import {GetLastVisitedPlaceDto} from "./dto/get-last-visited-place.dto";
import {UsersService} from "../users/users.service";
import {CACHE_MANAGER} from "@nestjs/common/cache";
import { Cache } from "cache-manager";

@Injectable()
export class LastVisitedPlacesService {
    
    constructor(
        private readonly userService: UsersService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
    ) {}
    
    async cacheLastVisitedPlace(userId: string, saveLastVisitedPlaceDto: SaveLastVisitedPlacesDto): Promise<void> {
        try {
            const user = await this.userService.getUserById(userId);
            const cacheKey = `userId:${user.id}/lastVisitedPlace:${saveLastVisitedPlaceDto.id}`;
            const ttl = 7 * 24 * 60 * 60;
            
            const savedLastVisitedPlace = {
                ...saveLastVisitedPlaceDto,
                userId: user.id
            }
            await this.cacheManager.set(cacheKey, JSON.stringify(savedLastVisitedPlace), ttl);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    async getLastVisitedPlace(placeId: string): Promise<GetLastVisitedPlaceDto> {
        try {
            const cacheKey = `lastVisitedPlace_${placeId}`
            const cachedValue = await this.cacheManager.get(cacheKey)
            
            if (cachedValue) {
                return JSON.parse(cacheKey) as GetLastVisitedPlaceDto
            } else {
                return null
            }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    async clearCache(placeId: string): Promise<void> {
        try {
            const cacheKey = `lastVisitedPlace_${placeId}`
            await this.cacheManager.del(cacheKey)
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
}