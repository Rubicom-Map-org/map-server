import "./../utils/dotenv.config";
import {DataSource, DataSourceOptions} from "typeorm";
import {User} from "../users/users.entity";
import {Token} from "../tokens/tokens.entity";
import {SavedPlace} from "../saved-places/saved-places.entity";
import {Chat} from "../chat-manager/enitities/chat.entity";
import {ChatRequest} from "../chat-manager/enitities/chat-request.entity";
import {DatabaseFile} from "../files/files.entity";
import { join } from 'path';
import { Client } from "pg";

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [User, Token, SavedPlace, Chat, ChatRequest, DatabaseFile],
    synchronize: false,
    migrations: [join(__dirname, 'migrations/*.{js,ts}')],
    logging: true,
    ssl: {
        rejectUnauthorized: false,
    }
}

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

client.connect()
    .then(() => console.log('Connected successfully'))
    .catch(e => console.error('Connection error', e.stack))
    .finally(() => client.end());

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;