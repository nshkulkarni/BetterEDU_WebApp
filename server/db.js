const { Pool } = require('pg');

const pool = new Pool({
    user: "nisha_user",
    password: "123PasswordNisha#!",
    host: "postgres-1.ctosago6qug9.us-west-1.rds.amazonaws.com",
    port: "5432",
    database: "postgres",
    ssl: {
        rejectUnauthorized: false, // Use true in production with proper certificates
    },
});

module.exports = pool;
