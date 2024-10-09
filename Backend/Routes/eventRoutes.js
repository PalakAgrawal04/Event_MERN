const express = require('express');
const { addEvent, getAllEvents, updateEvent, deleteEvent } = require('../Controllers/eventController');
const router = express.Router();

router.post('/add', addEvent);
router.get('/', getAllEvents);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

module.exports = router;
