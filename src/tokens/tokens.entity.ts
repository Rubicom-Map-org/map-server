import {Column, Entity, JoinColumn, JoinTable, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./users.entity";
import {ApiProperty} from "@nestjs/swagger";


@Entity()
export class Token {

    @ApiProperty({example: "432er2-4234-423e34-2342e"})
    @PrimaryGeneratedColumn("uuid")
    id: string

    @ApiProperty({
        example: "iodc032cd90ispodfc93i9qfcos0030cs0pf0,c04i9r9i0394i90ri3c" +
            "r4032erqd3a3dsefjlselfwefcsfsfsefsefw3flpsf.sdfsepkfopsekofsf" +
            "diaisodiaijdijailsdfe0w030er30d00ad0pspe0f0ls0ldf0j930ir9099mfscmrem9fvi03m9iwr0,cm9sf,p"
    })
    @Column({type: "varchar", nullable: false})
    token: string

    @OneToOne(() => User, user => user.token)
    @JoinColumn()
    user: User

}