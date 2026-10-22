const express = require('express');
const router = express.Router();
const { getStatus, listar } = require('../controllers/producto.controller');

router.get('/status', getStatus);
router.get('/ropa', listar);

module.exports = router;
