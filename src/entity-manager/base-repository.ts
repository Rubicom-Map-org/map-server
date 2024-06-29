import {DataSource, EntityManager, Repository} from "typeorm";
import {ENTITY_MANAGER} from "./transaction.interceptor";


export class BaseRepository {

    constructor(private readonly dataSource: DataSource,
                private readonly request: Request) {
    }

    protected getRepository<T>(entityClass: new () => T): Repository<T> {
        const entityManager: EntityManager =
            this.request[ENTITY_MANAGER] ?? this.dataSource.manager
        return entityManager.getRepository(entityClass)
    }

}