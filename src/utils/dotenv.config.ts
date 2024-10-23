import * as dotenv from 'dotenv';
import process from 'node:process';

process.env.NODE_ENV = process.env.NODE_ENV === "production" ? "production" : 'development';
dotenv.config({ path: `.${process.env.NODE_ENV}.env` });

export default {};