const express = require('express');
const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');
const FilesController = require('../controllers/FilesController');

const router = express.Router();

router.post('/files', FilesController.postUpload);
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/users', UsersController.postNew);

module.exports = router;