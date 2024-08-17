import {Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../users/users.entity";
import {ApiProperty} from "@nestjs/swagger";


@Entity()
export class DatabaseFile {
    
    @ApiProperty()
    @PrimaryGeneratedColumn("uuid")
    id: string;
    
    @ApiProperty()
    @Column({ type: "varchar", nullable: false })
    filename: string;
    
    @ApiProperty()
    @Column({ type: "varchar" })
    path: string;
    
    @ApiProperty()
    @Column({ type: "varchar" })
    mimetype: string;
    
    @ApiProperty()
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @OneToOne(() => User, user => user.file, { onDelete: "CASCADE"})
    user: User

}