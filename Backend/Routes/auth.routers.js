const express = require('express');
const {createLogs, getLogs, getLogsById} = require('../Controller/auth.controller');

const router = express.Router();

// Login Route
router.post('/login', createLogs);
router.get('/login', getLogs);
router.get('/login/:id', getLogsById);

module.exports = router;
