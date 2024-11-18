const express = require("express");
const app = express();
const cors = require("cors");

// MIDDLEWARE //
app.use(express.json()) //req.body
app.use(cors())

// ROUTES //

// register and login routes

app.use("/auth", require("./routes/auth"));

app.listen(5001, () => {
    console.log("server is running on port 5001")
})