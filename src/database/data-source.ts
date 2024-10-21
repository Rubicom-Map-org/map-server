import {DataSource, DataSourceOptions} from "typeorm";
import {User} from "../users/users.entity";
import {Token} from "../tokens/tokens.entity";
import * as dotenv from "dotenv";
import {SavedPlace} from "../saved-places/saved-places.entity";
import {Chat} from "../chat-manager/enitities/chat.entity";
import {ChatRequest} from "../chat-manager/enitities/chat-request.entity";
import {DatabaseFile} from "../files/files.entity";
import { join } from 'path';
dotenv.config();

const migrationPath = join(__dirname, 'migrations/*.{js,ts}');

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT),
    username: process.env.PGUSER,
    password: "register",
    database: process.env.PGDATABASE,
    entities: [User, Token, SavedPlace, Chat, ChatRequest, DatabaseFile],
    synchronize: true,
    migrations: [migrationPath],
    logging: true
}

console.log(migrationPath);
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;