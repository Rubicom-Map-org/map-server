import { Chat } from './enitities/chat.entity';
import { CreateChatRequestDto } from '../open-ai/dto/create-message.dto';
import { ChatRequest } from './enitities/chat-request.entity';

export abstract class ChatManagerRepository {
    abstract createChat(userId: string): Promise<Chat>;
    abstract getChatById(userId: string, chatId: string): Promise<Chat>;
    abstract getChats(userId: string): Promise<Chat[]>;
    abstract createChatRequest(userId: string, chatId: string, createChatRequestDto: CreateChatRequestDto): Promise<ChatRequest>;
    abstract getChatRequest(userId: string, chatId: string, chatRequestId: string): Promise<ChatRequest>;
    abstract getChatRequests(userId: string, chatId: string): Promise<ChatRequest[]>;
}