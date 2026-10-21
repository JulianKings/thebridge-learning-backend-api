const express = require('express');
const router = express.Router();
const { getStatus } = require('../controllers/ropa.controller');

router.get('/status', getStatus);

module.exports = router;