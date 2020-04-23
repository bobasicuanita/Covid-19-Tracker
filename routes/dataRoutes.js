const express = require('express');
const dataController = require('../controllers/dataController.js');
const router = express.Router();

router.route('/').get(dataController.getData);

module.exports = router;