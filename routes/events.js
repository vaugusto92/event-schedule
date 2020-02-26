const express = require("express");
const router = express.Router();
const controller = require("../controllers/eventController");

// List events route
router.get("/list", controller.listEvents);

// Create event route
router.post("/create", controller.createEvent);

// Update event route
router.put("/update/:id", controller.updateEvent);

module.exports = router;
