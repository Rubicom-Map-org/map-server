import {Column, CreateDateColumn, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../../users/users.entity";
import {Chat} from "./chat.entity";


@Entity()
export class ChatRequest {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({type: "varchar", nullable: false})
    request: string;

    @Column({type: "varchar", nullable: false})
    response: string;

    @CreateDateColumn({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    createdAt: Date;

    @CreateDateColumn({type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"})
    updatedAt: Date;

    @ManyToOne(() => User, user => user.chatRequests, { onDelete: "CASCADE" })
    @JoinTable()
    user: User;

    @ManyToOne(() => Chat, chat => chat.chatRequests, { onDelete: "CASCADE"})
    @JoinTable()
    chat: Chat;
}