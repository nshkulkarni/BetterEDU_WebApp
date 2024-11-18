const router = require("express").Router()
const pool = require("../db")
const bcrypt = require("bcryptjs");

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
        const userResult = await pool.query("SELECT * FROM users WHERE email_address = $1", [email_address]);

        if (userResult.rows.length === 0) {
            return res.status(401).send("Invalid Email or Password");
        }

        const user = userResult.rows[0]; // Get the user data from the query result

        // Compare the hashed password with the provided one
        const validPassword = await bcrypt.compare(pw, user.pw);

        if (!validPassword) {
            return res.status(401).send("Invalid Email or Password");
        }

        // Destructure the necessary fields from the user data
        const { uid, user_name } = user;

        // Send user data upon successful login
        res.status(200).json({
            uid,
            user_name,
            email_address: user.email_address,
            message: "Login successful!"
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


//Get all Groups
router.get("/groups", async (req, res) => {
    try {
      const groups = await pool.query("SELECT * FROM groups");
  
      // Construct full image URL for each group
      const groupsWithImages = groups.rows.map(group => ({
        ...group,
        group_image: `/brand_images/${group.group_image}`
      }));
  
      res.json(groupsWithImages);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  });

// Get all groups in "my groups" for a specific user
router.get("/mygroups/:uid", async (req, res) => {
    try {
        const { uid } = req.params;

        // Query to get groups associated with the user
        const userGroups = await pool.query(
            `SELECT g.* 
            FROM groups g
            JOIN my_groups mg ON g.gid = mg.gid
            WHERE mg.uid = $1;
            `,
            [uid]
        );

        if (userGroups.rows.length === 0) {
            return res.status(404).send("No groups found for this user.");
        }

        // Add the image path prefix to each group's image URL
        const groupsWithImages = userGroups.rows.map(group => ({
            ...group,
            group_image: `/brand_images/${group.group_image}`
        }));

        res.json(groupsWithImages);  // Send back the list of groups with updated image paths
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


router.post("/mygroups/:uid/:gid", async (req, res) => {
    try {
        const { uid, gid } = req.params;
        // Check if the user already has the group in my groups
        const existingEntry = await pool.query(
            "SELECT * FROM my_groups WHERE uid = $1 AND gid = $2", 
            [uid, gid]
        );

        if (existingEntry.rows.length !== 0) {
            return res.status(400).send("Group already added to My Groups");
        }

        // Insert the new group into "mygroups"
        const addGroup = await pool.query(
            "INSERT INTO my_groups (uid, gid) VALUES ($1, $2) RETURNING *",
            [uid, gid]
        );
        res.json(addGroup.rows[0]);  // Send back the newly added group as confirmation
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Delete a group from mygroups
router.delete("/mygroups/:uid/:gid", async (req, res) => {
    try {
        const { uid, gid } = req.params;
        
        // Delete the group from "mygroups"
        const deleteGroup = await pool.query(
            "DELETE FROM my_groups WHERE uid = $1 AND gid = $2 RETURNING *",
            [uid, gid]
        );

        if (deleteGroup.rows.length === 0) {
            return res.status(404).send("Group not found in My Groups.");
        }

        res.json({ message: "Group successfully removed from My Groups" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Get a single group by ID
router.get("/groups/:gid", async (req, res) => {
    try {
        const { gid } = req.params;

        // Query to get the group by its ID
        const group = await pool.query("SELECT * FROM groups WHERE gid = $1", [gid]);

        // Check if the group was found
        if (group.rows.length === 0) {
            return res.status(404).send("Group not found");
        }

        // Construct full image URL for the group
        const groupWithImage = {
            ...group.rows[0],
            group_image: `/brand_images/${group.rows[0].group_image}`
        };

        res.json(groupWithImage); // Respond with the group's details
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Get user information by UID
router.get("/user/:uid", async (req, res) => {
    try {
        const { uid } = req.params;

        // Query to get the user's information
        const user = await pool.query("SELECT * FROM users WHERE uid = $1", [uid]);

        // Check if user was found
        if (user.rows.length === 0) {
            return res.status(404).send("User not found");
        }

        // Respond with user information
        res.json(user.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// In your backend router file
router.get("/resources", async (req, res) => {
    try {
        const resources = await pool.query("SELECT * FROM resources");
        res.json(resources.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Endpoint to handle contact form submissions
router.post('/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;
  
    try {
      // Insert the contact form submission into the contacts table
      const result = await pool.query(
        `INSERT INTO contacts (name, email, subject, message) VALUES ($1, $2, $3, $4) RETURNING *`,
        [name, email, subject, message]
      );
  
      res.status(201).json({ message: 'Message saved successfully!', data: result.rows[0] });
    } catch (error) {
      console.error('Error saving contact form message:', error);
      res.status(500).json({ message: 'Failed to save message.' });
    }
  });

module.exports = router;