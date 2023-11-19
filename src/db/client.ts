import { Pool } from 'pg';

const { DATABASE_PASSWORD, DATABASE_USERNAME, DATABASE_NAME, DATABASE_PORT, DATABASE_HOST } = process.env;
const CONNECTION_TIMEOUT = 10000;

const options = {
    host: DATABASE_HOST,
    port: Number(DATABASE_PORT),
    database: DATABASE_NAME,
    user: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    ssl: {
        rejectUnauthorized: false,
    },
    connectionTimeoutMillis: CONNECTION_TIMEOUT,
};

let pool;

export const lookup = async (query: string) => {
    if (!pool) {
        pool = new Pool(options);
    }
    const client = await pool.connect();

    try {
        return await client.query(query);
    } catch (error) {
        console.log(error);
    } finally {
        client.release();
    }
};