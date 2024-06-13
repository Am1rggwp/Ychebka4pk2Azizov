import postgres from 'postgres'

export const sql = postgres({
    host: 'localhost',
    port: 5432,
    db: 'ecodolie1',
    username: 'postgres',
    password: '2312'
})
