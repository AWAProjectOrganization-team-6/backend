import postgres from 'postgres';

let _sql;

if (process.env.DATABASE_URL) _sql = postgres(process.env.DATABASE_URL, { ssl: { rejectUnauthorized: false } });
else
    _sql = postgres({
        host: 'localhost',
        database: 'awaproject',
        username: 'postgres',
        password: 'postgres',
    });

export const sql = _sql;
