const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Event = require("../models/Event");
const RSVP = require("../models/RSVP");

/* CREATE EVENT */
router.post("/", auth, async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      createdBy: req.userId
    });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET ALL EVENTS */
router.get("/", async (req, res) => {
  const events = await Event.find().sort({ dateTime: 1 });
  res.json(events);
});

/* UPDATE EVENT (OWNER ONLY) */
router.put("/:id", auth, async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });

  if (event.createdBy.toString() !== req.userId) {
    return res.status(403).json({ message: "Not authorized" });
  }

  Object.assign(event, req.body);
  await event.save();
  res.json(event);
});

/* DELETE EVENT (OWNER ONLY) */
router.delete("/:id", auth, async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });

  if (event.createdBy.toString() !== req.userId) {
    return res.status(403).json({ message: "Not authorized" });
  }

  await RSVP.deleteMany({ eventId: event._id });
  await event.deleteOne();
  res.json({ message: "Event deleted" });
});

/* RSVP JOIN (CAPACITY + CONCURRENCY SAFE) */
router.post("/:id/rsvp", auth, async (req, res) => {
  try {
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, attendeesCount: { $lt: "$capacity" } },
      { $inc: { attendeesCount: 1 } },
      { new: true }
    );

    if (!event) {
      return res.status(400).json({ message: "Event full" });
    }

    await RSVP.create({ userId: req.userId, eventId: event._id });
    res.json({ message: "RSVP successful" });
  } catch {
    res.status(400).json({ message: "Already RSVPed" });
  }
});

/* RSVP LEAVE */
router.post("/:id/leave", auth, async (req, res) => {
  await RSVP.deleteOne({
    userId: req.userId,
    eventId: req.params.id
  });

  await Event.findByIdAndUpdate(
    req.params.id,
    { $inc: { attendeesCount: -1 } }
  );

  res.json({ message: "Left event" });
});

module.exports = router;
