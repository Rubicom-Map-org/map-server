import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn, Unique, UpdateDateColumn,
} from 'typeorm';
import {Token} from "../tokens/tokens.entity";
import {ApiProperty} from "@nestjs/swagger";
import {GetUserProfileDto} from "./dto/get-user-profile.dto";
import {SavedPlace} from "../saved-places/saved-places.entity";
import {Chat} from "../chat-manager/enitities/chat.entity";
import {ChatRequest} from "../chat-manager/enitities/chat-request.entity";
import {DatabaseFile} from "../files/files.entity";

@Entity({ name: "user" })
@Unique(["email"])
export class User {

    @ApiProperty({example: "432er2-4234-423e34-2342e"})
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ApiProperty({example: "yura"})
    @Column({type: "varchar", nullable: false})
    username: string;

    @ApiProperty({example: "yura.ilchyshyn06@gmail.com"})
    @Column({type: "varchar", nullable: false, unique: true})
    email: string;

    @ApiProperty({example: "favok3kockwrk0a3rpka;kr;oc3w;klklkewlkflkasdfa4f"})
    @Column({type: "varchar", nullable: false})
    password: string;

    @ApiProperty({example: "kd0230d-0oo-3f-s0-f0oo023-20ro-03r.png"})
    @Column({type: "varchar", nullable: true})
    avatarImageUrl: string;

    @Column({type: "boolean", default: false})
    isAvatarSet: boolean;

    @Column({ type: "varchar", nullable: true, default: null })
    confirmationCode: string;

    @OneToOne(() => Token, token => token.user, {
        cascade: true
    })
    token: Token;

    @OneToMany(() => SavedPlace, savedPlaces => savedPlaces.user, {
        cascade: true
    })
    savedPlaces: SavedPlace[];

    @OneToMany(() => Chat, chat => chat.user, {
        cascade: true
    })
    chats: Chat[];

    @OneToMany(() => ChatRequest, chatRequests => chatRequests.user, {
        cascade: true
    })
    chatRequests: ChatRequest[];

    @OneToOne(() => DatabaseFile, file => file.user, {
        cascade: true
    })
    @JoinColumn()
    file: DatabaseFile;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    getUserProfile(getUserProfileDto: GetUserProfileDto) {
        const user = new User()
        user.username = getUserProfileDto.username
        user.email = getUserProfileDto.email
        user.avatarImageUrl = getUserProfileDto.avatarImageUrl
        console.log(user)
        return user
    }
}