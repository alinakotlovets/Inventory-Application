import {Pool} from "pg";
import 'dotenv/config';

const dbUrl = process.env.NODE_ENV === 'production'
    ? process.env.PROD_DATABASE_URL
    : process.env.DEV_DATABASE_URL;

export const pool = new Pool({
    connectionString: dbUrl
});
