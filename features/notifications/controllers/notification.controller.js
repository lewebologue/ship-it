const Notification = require('../models/notification.model');
const roles = require('@config/roles.enum.js');

exports.create = (req, res, next) => {
    if( req.token.role !== roles.RL4 || req.token.role !== roles.RL5 ) {
        return res.status(403).send({ message: 'Forbidden' });
    }
    Notification.create({
        title: req.body.title,
        content: req.body.content,
        publish: req.body.publish || true
    })
    .then( notification => {
        res.send(notification);
    })
    .catch( err => {
        res.status(500).send({ message: err.message });
    });
};

exports.getAll = (req, res, next) => {
    if ( !req.token.userId ) {
        return res.status(403).send({ message: 'Forbidden' });
    }
    Notification.find()
    .then(notifications => { res.send(notifications);
    })
    .catch(err => {res.status(500).send({ message: err.message });
    });
};

exports.getOne = (req, res, next) => {
    if (!req.token.userId) {
        return res.status(403).send({ message: 'Forbidden' });
    }
    Notification.findOne({ where: { id: req.params.id }})
    .then(notification => {
        if(!notification) {
            return res.status(404).send({ message: 'Notification not found' });
        }
        res.send(notification);
    })
    .catch(err => { res.status(500).send({ message: err.message });
    });
};

exports.update = (req, res, next) => {
    if ( req.token.role !== roles.RL4 || req.token.role !== roles.RL5 ) {
        return res.status(403).send({ message: 'Forbidden' });
    }
    Notification.findOne({ where: { id: req.params.id}})
    .then(notification => {
        if(!notification) {
            return res.status(404).json({ message: 'Notification not found'})
        }
        const notificationObject = req.body;
        Notification.save({...notificationObject})
        .then(() =>{ res.status(201).json({message : 'Update sucess'})
        })
        .catch(error => res.status(400).json({ error}));
    })
    .catch(error => res.status(500).json({error}));
}

exports.delete = (req, res, next) => {
    if ( req.token.role !== roles.RL4 || req.token.role !== roles.RL5 ) {
        return res.status(403).send({ message: 'Forbidden' });
    }
    Notification.destroy({where: {id: req.params.id}})
    .then(() =>{ res.status(201).json({message : 'Deleted'})
    })
    .catch(error => res.status(400).json({ error}));
}
