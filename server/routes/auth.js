const router = require("express").Router()
const pool = require("../db")
const bcrypt = require("bcrypt");

//registering
router.post("/register", async(req, res) => {
    try {
        // destructure req.body (name, email, age)
        const { user_name, email_address, pw, age,  } = req.body;
        // check if user exists
        const user = await pool.query("SELECT * FROM users WHERE email_address = $1", [
            email_address
        ]);

        if (user.rows.length !== 0) {
            return res.status(401).send("User already exists"); //throw error because user already exists
        }
        // encrypt the password using bcrypt
        const saltRounds = 10; // Higher is more secure but takes longer to compute
        const salt = await bcrypt.genSalt(saltRounds); // Generate a salt
        const hashedPassword = await bcrypt.hash(pw, salt); // Hash the password

        // Insert the new user with hashed password
        const newUser = await pool.query(
            "INSERT INTO users (email_address, pw, user_name, age) VALUES ($1, $2, $3, $4) RETURNING *", 
            [email_address, hashedPassword, user_name, age]
        );

        res.json(newUser.rows[0]);

    } catch(err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        // Destructure req.body (email, password)
        const { email_address, pw } = req.body;

        // Check if user exists
        const user = await pool.query("SELECT * FROM users WHERE email_address = $1", [
            email_address
        ]);

        if (user.rows.length === 0) {
            return res.status(401).send("Invalid Email or Password");
        }

        // Compare the hashed password with the provided one
        const validPassword = await bcrypt.compare(pw, user.rows[0].pw);

        if (!validPassword) {
            return res.status(401).send("Invalid Email or Password");
        }

        res.status(200).send("Login successful!");

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


module.exports = router;