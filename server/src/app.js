const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');

const positionRouter = require('./routes/position/position.router');
const marketsRouter = require('./routes/markets/markets.router');
const orderRouter = require('./routes/orders/orders.router');

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
//app.use(morgan('combined'));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/position', positionRouter);
app.use('/markets', marketsRouter);
app.use('/orders', orderRouter);

module.exports = app;