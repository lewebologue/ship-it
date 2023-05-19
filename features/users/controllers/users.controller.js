const roles = require('@utils/roles.enum.js');
const User = require('../models/users.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const AES = require('@middlewares/aes-encryption');

exports.create = (req, res, next) => {
    User.findOne({ where: { email: req.body.email } })
        .then(user => {
            if (user) {
                res.status(409).json({ message: 'User already exists' });
            } else {
                const encryptMail = AES.encrypt(req.body.email);
                bcrypt.hash(req.body.password, 10)
                    .then(hash => {
                        const user = new User({
                            email: encryptMail,
                            password: hash,
                            role: roles.RL1
                        });
                        user.save()
                            .then(() => res.status(201).json({ message: 'User created' }))
                            .catch(error => res.status(400).json({ error }));
                    })
                    .catch(error => res.status(500).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    const decryptMail = AES.decrypt(req.body.email);
    User.findOne({ where: { email: decryptMail } })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Incorrect password' });
                    }
                    res.status(200).json({
                        userId: user.id,
                        token: jwt.sign(
                            { 
                                userId: user.id,
                                role: user.role,
                                banned: user.banned 
                            },
                            process.env.JWT_SECRET,
                            { expiresIn: '24h' }
                        ),
                        role: user.role
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.updateByUser = (req, res, next) => {
    if(req.token.userId === req.params.id) {
        const forbidden = ['emailVerified', 'role', 'banned'];
        User.findOne({ where: { id: req.params.id } })
            .then(user => {
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                if ( forbidden.includes(req.body.field) ) {
                    return res.status(403).json({ message: 'Unsuffisant rights' });
                }
                if (user.id === req.token.userId) {
                    const userObject = req.file ?
                    {
                        ...JSON.parse(req.body.user),
                        avatar: `${req.protocol}://${req.get('host')}/public/images/${req.file.filename}`
                    } : { ...req.body };
                    User.update({ ...userObject, id: req.params.id }, { where: { id: req.params.id } })
                        .then(() => res.status(200).json({ message: 'User updated' }))
                        .catch(error => res.status(400).json({ error }));
                } else {
                    return res.status(403).json({ message: 'Not allowed' });
                }
            })
            .catch(error => res.status(500).json({ error }));
    } else {
        return res.status(403).json({ message: 'Not allowed' });
    }    
};

exports.updateByAdmin = (req, res, next) => {
    if(req.token.role === roles.RL5) {
        User.findOne({ where: { id: req.params.id } })
            .then(user => {
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                if (user.id === req.token.userId) {
                    return res.status(403).json({ message: 'Not allowed' });
                }
                const userObject = req.file ?
                {
                    ...JSON.parse(req.body.user),
                    avatar: `${req.protocol}://${req.get('host')}/public/images/${req.file.filename}`
                } : { ...req.body };
                User.update({ ...userObject, id: req.params.id }, { where: { id: req.params.id } })
                    .then(() => res.status(200).json({ message: 'User updated' }))
                    .catch(error => res.status(400).json({ error }));
            })
            .catch(error => res.status(500).json({ error }));
    }
};

exports.delete = (req, res, next) => {
    if( req.token.role !== roles.RL5) {
        return res.status(403).json({ message: 'Not allowed' });
    }
    User.findOne({ where: { id: req.params.id } })
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            } else {
                const filename = user.imageUrl.split('/images/')[1];
                fs.unlink(`public/images/${filename}`, () => {
                    User.destroy({ where: { id: req.params.id } })
                        .then(() => res.status(200).json({ message: 'User deleted' }))
                        .catch(error => res.status(400).json({ error }));
                }
            )}
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getAll = (req, res, next) => {
    if( req.token.role !== roles.RL5 || req.token.role !== roles.RL4) {
        return res.status(403).json({ message: 'Not allowed' });
    }
    User.findAll()
        .then(users => res.status(200).json(users))
        .catch(error => res.status(400).json({ error }));
};

exports.getOne = (req, res, next) => {
    if (req.token.role !== roles.RL4 || req.token.role !== roles.RL5 && req.token.userId === req.params.id) {
        User.findOne({ where: { id: req.params.id } })
            .then(user => {
                // Do not send banned and emailVerified status to user
                const { banned, emailVerified, ...userToSend } = user.dataValues;
                res.status(200).json(userToSend);
            })
            .catch(error => res.status(404).json({ error }));
    } else if ( req.token.role === roles.RL5 || req.token.role === roles.RL4 ) {
        User.findOne({ where: { id: req.params.id } })
            .then(user => {
                res.status(200).json(user);
            })
            .catch(error => res.status(404).json({ error }));
    }
};