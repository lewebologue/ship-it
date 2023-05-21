const express = require('express');
const router = express.Router();

const userRouter = require('@users/routes/users.routes');
const notificationRouter = require('@notifications/routes/notifications.routes')

router.use('/users', userRouter);
router.user('/notifications', notificationRouter);