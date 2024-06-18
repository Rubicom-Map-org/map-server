import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from "@nestjs/common";
import {DataSource} from "typeorm";
import {catchError, concatMap, finalize, Observable} from "rxjs";
import {Request} from "express";
import * as process from "node:process";

export const ENTITY_MANAGER = String(process.env.ENTITY_MANAGER)

@Injectable()
export class TransactionInterceptor implements NestInterceptor {

    constructor(private readonly dataSource: DataSource) {}

    async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {

        const request = context.switchToHttp().getRequest<Request>()

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        request[ENTITY_MANAGER] = queryRunner.manager

        return next.handle().pipe(
            concatMap(async data => {
                await queryRunner.commitTransaction()
                return data
            }),
            catchError(async error => {
                await queryRunner.rollbackTransaction()
                throw error
            }),
            finalize(async () => {
                await queryRunner.release()
            })
        )


    }



}