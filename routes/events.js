const express = require("express");
const router = express.Router();
const controller = require("../controllers/eventController");

// List events route
router.get("/list", controller.listEvents);

// List events by user id route
router.get("/list/:id", controller.listEventsByUser);

// Create event route
router.post("/create", controller.createEvent);

// Update event route
router.put("/update/:id", controller.updateEvent);

// Delete event route
router.delete("/delete/:id", controller.deleteEvent);

module.exports = router;
