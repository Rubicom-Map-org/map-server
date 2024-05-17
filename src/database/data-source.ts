import {DataSource, DataSourceOptions} from "typeorm";
import {User} from "../users/users.entity";
import {Token} from "../tokens/tokens.entity";
import * as dotenv from "dotenv"
dotenv.config()


export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: String(process.env.POSTGRES_PASSWORD),
    database: process.env.POSTGRES_DB,
    entities: [User, Token],
    synchronize: Boolean(process.env.TYPEORM_SYNCHRONIZE),
    migrations: [__dirname + process.env.TYPEORM_MIGRATIONS],

}

const dataSource = new DataSource(dataSourceOptions)
export default dataSource;