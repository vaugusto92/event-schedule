const express = require("express");
const router = express.Router();
const routeCtrl = require("../controllers/mainRoutesController");

//Register Route
router.post("/register", routeCtrl.registerController);
//Authentication Route
router.post("/authenticate", routeCtrl.authenticationController);
//Profile Route
router.get("/profile", routeCtrl.profileController);
//Forgot password route
router.post("/forgot", routeCtrl.forgotController);
//Reset password Route
router.post("/reset/:token", routeCtrl.resetController);

module.exports = router;
