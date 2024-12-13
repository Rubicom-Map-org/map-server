import * as dotenv from 'dotenv';
import process from 'node:process';

process.env.NODE_ENV = 'development';
dotenv.config({ path: `.${process.env.NODE_ENV}.env` });

export default {};