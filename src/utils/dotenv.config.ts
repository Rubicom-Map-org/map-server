import * as dotenv from 'dotenv';
import process from 'node:process';

dotenv.config({ path: `.${process.env.NODE_ENV}.env` });

export default {};