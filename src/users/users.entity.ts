import {Column, Entity, JoinColumn, JoinTable, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Token} from "../tokens/tokens.entity";
import {ApiProperty} from "@nestjs/swagger";
import {GetUserProfileDto} from "./dto/get-user-profile.dto";


@Entity()
export class User {

    @ApiProperty({example: "432er2-4234-423e34-2342e"})
    @PrimaryGeneratedColumn("uuid")
    id: string

    @ApiProperty({example: "yura"})
    @Column({type: "varchar", nullable: false, unique: true})
    username: string

    @ApiProperty({example: "yura.ilchyshyn06@gmail.com"})
    @Column({type: "varchar", nullable: false})
    email: string

    @ApiProperty({example: "favok3kockwrk0a3rpka;kr;oc3w;klklkewlkflkasdfa4f"})
    @Column({type: "varchar", nullable: false})
    password: string

    @ApiProperty({example: "kd0230d-0oo-3f-s0-f0oo023-20ro-03r.png"})
    @Column({type: "varchar", nullable: true})
    avatarImageUrl: string

    @Column({type: "boolean", default: false})
    isAvatarSet: string

    @OneToOne(() => Token, token => token.user)
    token: Token

    getUserProfile(getUserProfileDto: GetUserProfileDto) {
        const user = new User()
        user.username = getUserProfileDto.username
        user.email = getUserProfileDto.email
        user.avatarImageUrl = getUserProfileDto.avatarImageUrl
        console.log(user)
        return user
    }

}