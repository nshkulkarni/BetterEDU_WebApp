const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
const allowedOrigins = [
    "http://localhost:3000", // Local development
    "https://better-edu-web-app-new.vercel.app",
    "https://bettereduweb.com", // Deployed frontend
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true); // Allow requests from valid origins
        } else {
            callback(new Error("Not allowed by CORS")); // Deny other origins
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // Allow cookies if needed
}));


// Health check
app.get("/", (req, res) => {
    res.send("Server is running!");
});

// Routes
app.use("/auth", require("./routes/auth"));

// Listen on dynamic port
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
