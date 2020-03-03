const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const mongoose = require("mongoose");
const config = require("./config/database");

// Connect To Database
mongoose.connect(config.database, { useMongoClient: true }).then(
	() => {
		console.log("Connected to Database " + config.database);
	},
	err => {
		if (err) {
			console.log("Database error " + err);
		}
	}
);

const app = express();

const users = require("./routes/users");
const events = require("./routes/events");

// Port Number
const port = process.env.PORT || 8080;

// CORS Middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, "public")));

// Body Parser Middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require("./config/passport")(passport);

///Users/Routes
app.use("/", express.static(path.join(__dirname, "dist/event-schedule-app")));
app.use("/users", users);
app.use("/events", events);

// Index Route
app.get("/", (req, res) => {
	res.send("invaild endpoint");
});

//production only
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "public/index.html"));
});

// Start Server
app.listen(port, () => {
	console.log("Server started on port " + port);
});
