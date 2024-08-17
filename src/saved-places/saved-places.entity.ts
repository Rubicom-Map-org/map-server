import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../users/users.entity";
import {ApiProperty} from "@nestjs/swagger";


@Entity()
export class SavedPlace {

    @ApiProperty()
    @PrimaryGeneratedColumn("uuid")
    id: string;
    
    @ApiProperty()
    @Column({type: "varchar", nullable: true})
    type: string;
    
    @ApiProperty()
    @Column({type: "jsonb", nullable: true})
    properties: any;
    
    @ApiProperty()
    @Column({type: "jsonb", nullable: true})
    geometry: {
        type: string;
        coordinates: [number, number];
    };

    @ManyToOne(() => User, user => user.savedPlaces, { onDelete: "CASCADE"})
    user: User;

}