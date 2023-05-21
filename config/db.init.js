const User = require('@users/models/users.model');
const Notifications = require('@notifications/models/notifications.model');


const Init = async () => {
    await User.sync({/*alter: true*/});
    await Notifications.sync({/*alter: true*/})
}

module.exports = Init;