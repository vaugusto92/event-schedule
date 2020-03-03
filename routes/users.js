const express = require("express");
const router = express.Router();
const controller = require("../controllers/mainRoutesController");

// Register Route
router.post("/register", controller.registerController);

// Authentication Route
router.post("/authenticate", controller.authenticationController);

// List Users Route
router.get("/list", controller.listUsers);

module.exports = router;
