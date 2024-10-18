import {Column, CreateDateColumn, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../../users/users.entity";
import {Chat} from "./chat.entity";
import {ApiProperty} from "@nestjs/swagger";


@Entity()
export class ChatRequest {

    @ApiProperty()
    @PrimaryGeneratedColumn("uuid")
    id: string;
    
    @ApiProperty()
    @Column({type: "varchar", nullable: false})
    request: string;
    
    @ApiProperty()
    @Column({type: "varchar", nullable: false})
    response: string;
    
    @ApiProperty()
    @CreateDateColumn()
    createdAt: Date;
    
    @ApiProperty()
    @CreateDateColumn()
    updatedAt: Date;
    
    @ManyToOne(() => User, user => user.chatRequests, { onDelete: "CASCADE" })
    @JoinTable()
    user: User;

    @ManyToOne(() => Chat, chat => chat.chatRequests, { onDelete: "CASCADE"})
    @JoinTable()
    chat: Chat;
}