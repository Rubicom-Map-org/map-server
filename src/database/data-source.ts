import {DataSource, DataSourceOptions} from "typeorm";
import {User} from "../users/users.entity";
import {Token} from "../tokens/tokens.entity";
import * as dotenv from "dotenv"
import {SavedPlace} from "../saved-places/saved-places.entity";
import {Chat} from "../chat-manager/enitities/chat.entity";
import {ChatRequest} from "../chat-manager/enitities/chat-request.entity";
import {DatabaseFile} from "../files/files.entity";
dotenv.config()


export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: String(process.env.POSTGRES_PASSWORD),
    database: process.env.POSTGRES_DB,
    entities: [User, Token, SavedPlace, Chat, ChatRequest, DatabaseFile],
    synchronize: Boolean(process.env.TYPEORM_SYNCHRONIZE),
    migrations: [__dirname + process.env.TYPEORM_MIGRATIONS],

}

const dataSource = new DataSource(dataSourceOptions)
export default dataSource;