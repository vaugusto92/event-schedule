var Event = require("../models/event");

// Retrieve all events
module.exports.listEvents = async (req, res) => {
	try {
		const docs = await Event.find({});
		res.status(200).json(docs);
	} catch (err) {
		return res.status(400).json({ error: err.message });
	}
};

// Retrieve all events
module.exports.listEventsByUser = async (req, res) => {
	try {
		var query = { invitations: { $elemMatch: { userId: req.params.id } } };
		const docs = await Event.find(query);
		res.status(200).json(docs);
	} catch (err) {
		return res.status(400).json({ error: err.message });
	}
};

// Create Event
module.exports.createEvent = (req, res, next) => {
	let newEvent = new Event({
		description: req.body.description,
		start: req.body.start,
		end: req.body.end,
		createdBy: req.body.createdBy,
		invitations: req.body.invitations
	});

	Event.addEvent(newEvent, (err, user) => {
		if (err) {
			res.json({
				success: false,
				msg: "Failed to create event."
			});
		} else {
			res.json({
				success: true,
				msg: "Event created!"
			});
		}
	});
};

// Update event by id
module.exports.updateEvent = async (req, res) => {
	try {
		await Event.findByIdAndUpdate({ _id: req.params.id }, req.body);
		res.sendStatus(200);
	} catch (err) {
		return res.status(400).json({ error: err.message });
	}
};

// Delete event by id
module.exports.deleteEvent = async (req, res) => {
	try {
		await Event.findByIdAndRemove({ _id: req.params.id });
		res.sendStatus(200);
	} catch (err) {
		return res.status(400).json({ error: err.message });
	}
};
