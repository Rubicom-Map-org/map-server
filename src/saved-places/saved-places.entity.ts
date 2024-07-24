import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../users/users.entity";


@Entity()
export class SavedPlace {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({type: "varchar", nullable: true})
    type: string;

    @Column({type: "jsonb", nullable: true})
    properties: any;

    @Column({type: "jsonb", nullable: true})
    geometry: {
        type: string;
        coordinates: [number, number];
    };

    @ManyToOne(() => User, user => user.savedPlaces, { onDelete: "CASCADE"})
    user: User;

}