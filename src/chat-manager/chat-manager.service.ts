import {HttpException, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Chat} from "./enitities/chat.entity";
import { InsertResult, Repository } from 'typeorm';
import {ChatRequest} from "./enitities/chat-request.entity";
import {CreateChatRequestDto} from "../open-ai/dto/create-message.dto";
import {UsersService} from "../users/users.service";
import {ExceptionMessage} from "../utils/exception-message.enum";
import { ChatManagerRepository } from './chat-manager-repository.abstract';

@Injectable()
export class ChatManagerService extends ChatManagerRepository {

    constructor(
        @InjectRepository(Chat)
        private readonly chatRepository: Repository<Chat>,
        @InjectRepository(ChatRequest)
        private readonly chatRequestRepository: Repository<ChatRequest>,
        private readonly usersService: UsersService
    )
    {
        super();
    }

    async createChat(userId: string): Promise<Chat>
    {
        try {
            const user = await this.usersService.getUserById(userId)
            if (!user) throw new NotFoundException(ExceptionMessage.USER_NOT_FOUND)

            const chatInsertionResult: InsertResult = await this.chatRepository
                .createQueryBuilder()
                .insert()
                .into(Chat)
                .values({ user })
                .returning("id")
                .execute();

            console.log(typeof chatInsertionResult);

            const chat: Chat = chatInsertionResult.raw[0];
            return await this.chatRepository.save(chat)
        } catch (error) {
            if (error instanceof HttpException) {
                throw error
            }
            throw new InternalServerErrorException(error.message)
        }
    }

    async getChatById(userId: string, chatId: string): Promise<Chat>
    {
        try {
            const user = await this.usersService.getUserById(userId)

            const chat =  await this.chatRepository
                .createQueryBuilder()
                .where("user.id = :userId AND chat.id = :chatId", {
                    userId: user.id,
                    chatId: chatId
                })
                .getOne();

            if (!chat) throw new NotFoundException(ExceptionMessage.CHAT_NOT_FOUND);

            return chat
        } catch (error) {
            if (error instanceof HttpException) {
                throw error
            }
            throw new InternalServerErrorException(error.message)
        }
    }

    async getChats(userId: string): Promise<Chat[]>
    {
        try {
            const user = await this.usersService.getUserById(userId)

            const chats =  await this.chatRepository
                .createQueryBuilder()
                .where("user.id = :userId", { userId: user.id, })
                .getMany();

            if (!chats) throw new NotFoundException("Not found");

            return chats;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error
            }
            throw new InternalServerErrorException(error.message)
        }
    }

    async createChatRequest(
        userId: string,
        chatId: string,
        createChatRequestDto: CreateChatRequestDto
    ): Promise<ChatRequest>
    {
        try {
            const user = await this.usersService.getUserById(userId)
            const chat = await this.getChatById(userId, chatId)

            const chatRequestInsertResult: InsertResult = await this.chatRequestRepository
                .createQueryBuilder()
                .insert()
                .into(ChatRequest)
                .values({
                    ...createChatRequestDto,
                    user,
                    chat
                })
                .execute();

            const chatRequest = chatRequestInsertResult.raw[0];
            return await this.chatRequestRepository.save(chatRequest);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error
            }
            throw new InternalServerErrorException(error.message)
        }
    }

    async getChatRequest(
        userId: string,
        chatId: string,
        chatRequestId: string
    ): Promise<ChatRequest>
    {
        
        try {
            const user = await this.usersService.getUserById(userId)
            const chat = await this.getChatById(userId, chatId)

            const chatRequest = await this.chatRequestRepository
                .createQueryBuilder()
                .where("id =: id AND user.id = :userId AND chat.id = :chatId", {
                    id: chatRequestId,
                    userId: user.id,
                    chatId: chat.id
                })
                .getOne();

            if (!chatRequest)  throw new NotFoundException(ExceptionMessage.CHAT_NOT_FOUND);

            return chatRequest;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error
            }
            throw new InternalServerErrorException(error.message)
        }
    }

    async getChatRequests(userId: string, chatId: string): Promise<ChatRequest[]>
    {
        try {
            const user = await this.usersService.getUserById(userId);
            const chat = await this.getChatById(userId, chatId);

            const chatRequests =  await this.chatRequestRepository
                .createQueryBuilder()
                .where("user.id = :userId AND chat.id = :chatId", {
                    userId: user.id,
                    chatId: chat.id
                })
                .getMany();

            if (!chatRequests) throw new NotFoundException("Not found");
            console.log(JSON.stringify({
                requests: chatRequests,
                type: typeof chatRequests
            }));

            return chatRequests;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error
            }
            throw new InternalServerErrorException(error.message)
        }
    }

}
