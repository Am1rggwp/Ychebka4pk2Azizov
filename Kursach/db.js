import postgres from 'postgres'

export const sql = postgres({
    host: 'localhost',
    port: 5432,
    db: 'SchoolCircle',
    username: 'postgres',
    password: '2312'
})
