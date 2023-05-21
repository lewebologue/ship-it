const express = require('express');
const path = require('path');
const router = require('./features/index');
const app = express();
const InitDB = require('./config/db.init');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

InitDB().then(() => {
    app.use(express.json());

    app.use('/api', router);

    app.use('/public/images', express.static(path.join(__dirname, 'images')));
    
    })
    .catch((error) => { console.log("error" + error);
});

module.exports = app;