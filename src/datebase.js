import postgres from 'postgres';

export const sql = postgres({
    host: 'localhost',
    database: 'awaproject',
    username: 'postgres',
    password: 'postgres'
});