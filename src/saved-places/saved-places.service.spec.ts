import { Test, TestingModule } from '@nestjs/testing';
import { SavedPlacesService } from './saved-places.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SavedPlace } from './saved-places.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { BadRequestException } from '@nestjs/common';
import { SavePlaceDto } from './dto/save-place.dto';
import { User } from '../users/users.entity';
import {ExceptionMessage} from "../utils/exception-message.enum";

describe('SavedPlacesService', () => {
    let service: SavedPlacesService;
    let savedPlaceRepository: Repository<SavedPlace>;
    let usersService: UsersService;
    
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SavedPlacesService,
                {
                    provide: getRepositoryToken(SavedPlace),
                    useClass: Repository,
                },
                {
                    provide: UsersService,
                    useValue: {
                        getUserById: jest.fn(),
                    },
                },
            ],
        }).compile();
        
        service = module.get<SavedPlacesService>(SavedPlacesService);
        savedPlaceRepository = module.get<Repository<SavedPlace>>(getRepositoryToken(SavedPlace));
        usersService = module.get<UsersService>(UsersService);
    });
    
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    
    
    describe('getSavedPlace', () => {
        it('should return a saved place by id', async () => {
            const userId = '1';
            const savedPlaceId = '1';
            const user = { id: userId } as User;
            const savedPlace = { id: savedPlaceId, user } as SavedPlace;
            
            jest.spyOn(usersService, 'getUserById').mockResolvedValue(user);
            jest.spyOn(savedPlaceRepository, 'findOne').mockResolvedValue(savedPlace);
            
            const result = await service.getSavedPlace(userId, savedPlaceId);
            
            expect(result).toEqual(savedPlace);
            expect(usersService.getUserById).toHaveBeenCalledWith(userId);
            expect(savedPlaceRepository.findOne).toHaveBeenCalledWith({ where: { id: savedPlaceId, user } });
        });
    });
    
    describe('getSavedPlaces', () => {
        it('should return an array of saved places for a user', async () => {
            const userId = '1';
            const user = { id: userId } as User;
            const savedPlaces = [{ id: '1', user }, { id: '2', user }] as SavedPlace[];
            
            jest.spyOn(usersService, 'getUserById').mockResolvedValue(user);
            jest.spyOn(savedPlaceRepository, 'find').mockResolvedValue(savedPlaces);
            
            const result = await service.getSavedPlaces(userId);
            
            expect(result).toEqual(savedPlaces);
            expect(usersService.getUserById).toHaveBeenCalledWith(userId);
            expect(savedPlaceRepository.find).toHaveBeenCalledWith({ where: { user } });
        });
    });
    
    describe('deleteSavedPlace', () => {
        it('should delete a saved place', async () => {
            const userId = '1';
            const savedPlaceId = '1';
            const user = { id: userId } as User;
            const savedPlace = { id: savedPlaceId, user } as SavedPlace;
            
            jest.spyOn(usersService, 'getUserById').mockResolvedValue(user);
            jest.spyOn(savedPlaceRepository, 'findOne').mockResolvedValue(savedPlace);
            jest.spyOn(savedPlaceRepository, 'remove').mockResolvedValue(savedPlace);
            
            await service.deleteSavedPlace(userId, savedPlaceId);
            
            expect(usersService.getUserById).toHaveBeenCalledWith(userId);
        });
    });
});
