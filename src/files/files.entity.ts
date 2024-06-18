import {Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../users/users.entity";


@Entity()
export class DatabaseFile {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({type: "varchar", nullable: false})
    filename: string;

    @Column({type: "bytea" })
    data: Uint8Array

    @CreateDateColumn({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    createdAt: Date;

    @OneToOne(() => User, user => user.file, { onDelete: "CASCADE"})
    user: User

}