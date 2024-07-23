import {Inject, Injectable, InternalServerErrorException} from "@nestjs/common";
import {CACHE_MANAGER} from "@nestjs/common/cache";
import {ExceptionMessage} from "../utils/exception-message.enum";
import {SaveLastVisitedPlacesDto} from "./dto/save-last-visited-place.dto";
import {GetLastVisitedPlaceDto} from "./dto/get-last-visited-place.dto";
import { Cache } from "cache-manager"


@Injectable()
export class LastVisitedPlacesService {
    
    constructor(
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
    ) {
    }
    
    async cacheLastVisitedPlace(saveLastVisitedPlaceDto: SaveLastVisitedPlacesDto): Promise<void>
    {
        const cacheKey = `lastVisitedPlace_${saveLastVisitedPlaceDto.id}`
        await this.cacheManager.set(cacheKey, JSON.stringify(saveLastVisitedPlaceDto));
    }
    
    async getLastVisitedPlace(placeId: string): Promise<GetLastVisitedPlaceDto>
    {
        const cacheKey = `lastVisitedPlace_${placeId}`
        const cachedValue = await this.cacheManager.get(cacheKey)
        
        if (cachedValue) {
            return JSON.parse(cacheKey) as GetLastVisitedPlaceDto
        } else {
            return null
        }
    }
    
    async clearCache(placeId: string): Promise<void>
    {
        const cacheKey = `lastVisitedPlace_${placeId}`
        await this.cacheManager.del(cacheKey)
    }
    
}