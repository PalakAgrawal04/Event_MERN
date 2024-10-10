const express = require('express');
const { sendInvitation } = require('../Controllers/inviteController');
const router = express.Router();

router.post('/invite', sendInvitation);

module.exports = router;
