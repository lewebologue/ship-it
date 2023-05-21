const express = require('express');
const router = express.Router();
const controller = require('../controllers/notification.controller');
const authentication = require('@middlewares/authentication');

router.post('/', authentication, controller.create);
router.get('/', authentication, controller.getAll);
router.get('/:id', authentication, controller.getOne);
router.patch('/:id', authentication, controller.update);

module.exports = router;