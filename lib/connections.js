const pg = require('pg');
require('dotenv').config();
const { Pool } = pg;
const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});

// async function connections() {
//     const clientDb = await pool.connect()
//     return clientDb;
// // }
// const clientDb = pool.connect()
module.exports = pool.connect()
