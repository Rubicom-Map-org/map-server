import "./../utils/dotenv.config";
import {DataSource, DataSourceOptions} from "typeorm";
import {User} from "../users/users.entity";
import {Token} from "../tokens/tokens.entity";
import {SavedPlace} from "../saved-places/saved-places.entity";
import {Chat} from "../chat-manager/enitities/chat.entity";
import {ChatRequest} from "../chat-manager/enitities/chat-request.entity";
import {DatabaseFile} from "../files/files.entity";
import { join } from 'path';

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT),
    username: process.env.PGUSER,
    password: String(process.env.PGPASSWORD),
    database: process.env.PGDATABASE,
    entities: [User, Token, SavedPlace, Chat, ChatRequest, DatabaseFile],
    synchronize: false,
    migrations: [join(__dirname, 'migrations/*.{js,ts}')],
    logging: true,
    ssl: {
        rejectUnauthorized: false,
    }
}

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;