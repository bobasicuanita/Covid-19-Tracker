const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();
const router = express.Router();
const compression = require('compression');

// Log req status and time
app.use(morgan('dev'));

// Handle static pages to this route
app.use(express.static(path.join(__dirname, '/public')));

// Send html file when this route is requested
router.get('/', (req, res) => {
    res.status(200).sendFile('index.html');
});

app.all('*', (req, res) => {
    res.status(404).sendFile(__dirname + '/public/error.html', {
        title: 'Something went wrong!',
        msg: `Cannot find ${req.originalUrl} in this server`,
    });
});

app.use(compression());
module.exports = app;
