const express = require('express');

const { httpCreateNewOrder, httpGetOpenOrders } = require('./orders.controller');

const orderRouter = express.Router();

orderRouter.post('/', httpCreateNewOrder);
orderRouter.get('/', httpGetOpenOrders);

module.exports = orderRouter;
