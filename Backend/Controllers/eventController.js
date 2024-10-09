const Event = require('../models/Event');

exports.addEvent = async (req, res) => {
  try {
    const { name, description, date, time, organization } = req.body;
    const newEvent = new Event({ name, description, date, time, organization });
    await newEvent.save();
    res.json(newEvent);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getAllEvents = async (req, res) => {
  const events = await Event.find({});
  res.json(events);
};

exports.updateEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ msg: 'Event not found' });

  Object.assign(event, req.body);
  await event.save();
  res.json(event);
};

exports.deleteEvent = async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Event deleted' });
};
