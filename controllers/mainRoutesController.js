const User = require("../models/user");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../config/database");
const async = require("async");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");


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
      if (err.name === 'MongoError' && err.code === 11000) {
        // Duplicate username
        return res.json({
          success: false,
          msg: 'Email address or Username already exists!'
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
}

// Profile Get Controller
module.exports.profileController = passport.authenticate("jwt", {
  session: false
}), (req, res, next) => {
  res.json({
    user: req.user
  });
}

//Forgot Password Post Controller
module.exports.forgotController = function(req, res, next) {
  async.waterfall(
    [
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString("hex");
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne(
          {
            email: req.body.email
          },
          function(err, user) {
            if (!user) {
              res.json({
                success: false,
                msg: "No account with that email address exists."
              });
            }

            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

            user.save(function(err) {
              done(err, token, user);
            });
          }
        );
      },
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: "Mailgun",
          auth: {
            user:"postmaster@sandboxf942b60cd232410fa8ac03288b26a5dc.mailgun.org",
            pass: "727877e9638fb9c92c298f2237c2aaa1"
          }
        });
        var mailOptions = {
          to: user.email,
          from: "passwordreset@frozen-escarpment-49237.herokuapp.com/",
          subject: "MEAN Auth App Password Reset",
          text:
            "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
            "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
            "http://" +
            req.headers.host +
            "/reset/" +
            token +
            "\n\n" +
            "If you did not request this, please ignore this email and your password will remain unchanged.\n"
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          res.json({
            success: true,
            msg: "Password reset email sent!"
          }); //req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          done(err, "done");
        });
      }
    ],
    function(err) {
      if (err) return next(err);
      res.json({
        success: false,
        msg: this.err
      });
    }
  );
}

// Reset Password Post Controller
module.exports.resetController = function(req, res) {
  let password = req.body.password;
  async.waterfall(
    [
      function(done) {
        User.findOne(
          {
            resetPasswordToken: req.body.token,
            resetPasswordExpires: {
              $gt: Date.now()
            }
          },
          function(err, user) {
            if (!user) {
              res.json({
                success: false,
                msg: "Password reset token is invalid or has expired."
              });
            }
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(password, salt, (err, hash) => {
                if (err) throw err;
                user.password = hash;
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;
                user.save(function(err) {
                  done(err, user);
                });
              });
            });
          }
        );
      },

      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: "Mailgun",
          auth: {
            user:"postmaster@sandboxf942b60cd232410fa8ac03288b26a5dc.mailgun.org",
            pass: "727877e9638fb9c92c298f2237c2aaa1"
          }
        });
        var mailOptions = {
          to: user.email,
          from: "passwordreset@frozen-escarpment-49237.herokuapp.com/",
          subject: "Your password has been changed",
          text:
            "Hello,\n\n" +
            "This is a confirmation that the password for your account " +
            user.email +
            " has just been changed.\n"
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          res.json({
            success: true,
            msg: "Success! Your password has been changed."
          });
          done(err);
        });
      }
    ],
    function(err) {
      res.json({
        success: false,
        msg: this.err
      });
    }
  );
}

// Retrieve all users
module.exports.listUsers = async (req, res) => {
  try {
    const docs = await User.find({});
    res.status(200).json(docs);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
