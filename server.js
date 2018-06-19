const express = require("express");
const mongoose = require("mongoose");

// Bring in files from routes/api
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

// App Initialization
const app = express();

// DB config, mongoURI is the key in keys.js
const db = require("./config/keys").mongoURI;

// Connect to mongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Test Route, should see this on localhost:5000
app.get("/", (req, res) => res.send("Hello world"));

// Use routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

// Server setup
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
