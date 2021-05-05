const express = require('express');
const router = express.Router();

const slots = require('./slots');

router.use('/slots', slots);
module.exports = router;