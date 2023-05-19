const express = require('express');
const router = express.Router();
const controller = require('../controllers/users.controller');
const multer = require('@middlewares/multer-config');
const authentication = require('@middlewares/authentication');

router.post('/signup', controller.create);
router.post('/login', controller.login);
router.get('/profile/:id', authentication, controller.getOne);
router.get('/', authentication, controller.getAll);
router.patch('/profile/:id', multer, controller.updateByUser);
router.patch('/admin/profile/:id', authentication, multer, controller.updateByAdmin);
router.delete('/profile/:id', authentication, controller.delete);

module.exports = router;