const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config');
const routes = require('./routes');
const http = require('http');
const bodyParser = require('body-parser');
const noCache = require('nocache');
const compression = require('compression');
const logger = require('./logging/logger');
const slots = require('./controller/slots');



http.globalAgent.maxSockets = 500;
const app = express();

app.use(morgan('short', {stream: logger.stream}));

app.use(cors({
    origin: '*',
    allowedHeaders: config.serverDetails.allowedHeaders,
    exposedHeaders: config.serverDetails.exposedHeaders
}));


app.use(compression());

app.use(noCache());

// support json encoded bodies
app.use(bodyParser.json({limit: '52428800'})); 

// support encoded bodies
app.use(bodyParser.urlencoded({ limit: '52428800', extended: true }));

app.use('/api', routes);

const weeks = config.weeks; // number of weeks you want to check for.

for (let week = 0; week < weeks; week++) {
    /* let date = new Date();
    date = new Date(date.setDate(date.getDate() + week * 7)).toLocaleDateString();
    date = date.split('/');
    const month = date[1].length == 1 ? `0${date[1]}` : date[1];
    const day = date[0].length == 1 ? `0${date[0]}` : date[0];
    const year = date[2];
    const formedDate = `${day}-${month}-${year}`;
    */
    setInterval(() => {
        // slots.checkSlots({query: {pincode: '401201'}}, true, week); // if no email mentioned it will consider mails mentioned in config.js file
        // slots.checkSlots({query: {district_id: '394'}}, false, week);
        slots.checkSlots({query: {pincode: '400602', email: 'abc@gmail.com'}}, true, week);
        slots.checkSlots({query: {pincode: '400063', email: 'xyz@gmail.com'}}, true, week);
    }, 120000);
}

app.listen(config.port, () => {
    logger.info(`Server Initiated on ${config.port}`);
});