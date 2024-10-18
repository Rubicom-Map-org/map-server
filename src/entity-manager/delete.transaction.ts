import { EntityManager, Repository } from 'typeorm';
import {User} from "../users/users.entity";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class DeleteTransaction {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly entityManager: EntityManager
    ) {}

    async findEntityById(userId: string, entity: any): Promise<any | null> {
        const repository = this.entityManager.getRepository(entity);
        return await repository.findOne({ where: {id: userId}})
    }

    async deleteEntityWithRelations(userId: string) {}

}