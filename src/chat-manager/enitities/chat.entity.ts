import {Column, Entity, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../../users/users.entity";
import {ChatRequest} from "./chat-request.entity";


@Entity()
export class Chat {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, user => user.chats, { onDelete: "CASCADE"})
    @JoinTable()
    user: User;

    @OneToMany(() => ChatRequest, chatRequests => chatRequests.chat, { onDelete: "CASCADE"})
    chatRequests: ChatRequest[];

}