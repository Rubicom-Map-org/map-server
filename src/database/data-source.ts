import {DataSource, DataSourceOptions} from "typeorm";
import {User} from "../users/users.entity";
import {Token} from "../tokens/tokens.entity";
import * as dotenv from "dotenv";
import {SavedPlace} from "../saved-places/saved-places.entity";
import {Chat} from "../chat-manager/enitities/chat.entity";
import {ChatRequest} from "../chat-manager/enitities/chat-request.entity";
import {DatabaseFile} from "../files/files.entity";
dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT),
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    entities: [User, Token, SavedPlace, Chat, ChatRequest, DatabaseFile],
    synchronize: false,
    migrations: [__dirname + "dist/migrations/**/*.js"],
}

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;