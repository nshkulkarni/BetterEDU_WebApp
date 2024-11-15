const { Pool } = require('pg');

<<<<<<< HEAD
const pool = new Pool({
=======
const pool = new Pool ({
>>>>>>> cdd5fcc49dd360313385948ff94d155c3bffc4bf
    user: "nisha_user",
    password: "123PasswordNisha#!",
    host: "postgres-1.ctosago6qug9.us-west-1.rds.amazonaws.com",
    port: "5432",
    database: "postgres",
    ssl: {
<<<<<<< HEAD
        rejectUnauthorized: false, // Use true in production with proper certificates
    },
});

module.exports = pool;
=======
        rejectUnauthorized: false // Optional: Disable SSL certificate validation (only for testing)
      }
});

module.exports = pool; 


>>>>>>> cdd5fcc49dd360313385948ff94d155c3bffc4bf
