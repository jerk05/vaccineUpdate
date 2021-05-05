
const express = require('express');
const controller = require('../controller');
const router = express.Router();

router.get('/getSlotsByDistrict/', controller.slots.getSlotsByDistrict);
router.get('/getSlotsByPincode/', controller.slots.getSlotsByPincode);

module.exports = router;
