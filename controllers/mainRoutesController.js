const User = require("../models/user");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../config/database");

// Register Get Controller
module.exports.registerController = (req, res, next) => {
	let newUser = new User({
		name: req.body.name,
		email: req.body.email,
		username: req.body.username,
		password: req.body.password
	});

	User.addUser(newUser, (err, user) => {
		if (err) {
			if (err.name === "MongoError" && err.code === 11000) {
				// Duplicate username
				return res.json({
					success: false,
					msg: "Email address or Username already exists!"
				});
			} else {
				res.json({
					success: false,
					msg: "Fail to register user"
				});
			}
		} else {
			res.json({
				success: true,
				msg: "User registered!"
			});
		}
	});
};

// Authentication Post Controller
module.exports.authenticationController = (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;

	User.getUsername(username, (err, user) => {
		if (err) throw err;
		if (!user) {
			return res.json({
				success: false,
				msg: "User not found."
			});
		}

		User.comparePassword(password, user.password, (err, isMatch) => {
			if (err) throw err;
			if (isMatch) {
				// using JSON.parse(JSON.stringify(doc)) as Passport have changed methods and now just passing user won't work
				const token = jwt.sign(
					JSON.parse(JSON.stringify(user)),
					config.secret,
					{
						expiresIn: 604800 //1 week
					}
				);
				res.json({
					success: true,
					token: `JWT ${token}`,
					user: {
						id: user._id,
						name: user.name,
						email: user.email
					}
				});
			} else {
				return res.json({
					success: false,
					msg: "Wrong Password!"
				});
			}
		});
	});
};

// Profile Get Controller
(module.exports.profileController = passport.authenticate("jwt", {
	session: false
})),
	(req, res, next) => {
		res.json({
			user: req.user
		});
	};

// Retrieve all users
module.exports.listUsers = async (req, res) => {
	try {
		const docs = await User.find({});
		res.status(200).json(docs);
	} catch (err) {
		return res.status(400).json({ error: err.message });
	}
};
