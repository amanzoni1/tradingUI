const ccxt = require ('ccxt');
const binanceFuture = new ccxt.pro.binanceusdm({'options': { 'defaultType': 'future' }});

const { createNewOrder, getOpenOrders } = require('../../models/binanceFuture.models');
const { createSpotOrder } = require('../../models/binanceSpot.models');


async function httpCreateNewOrder(req, res) {
  const orderParams = req.body;

  if (!orderParams.symbol || !orderParams.type || !orderParams.side || !orderParams.amount) {
    return res.status(400).json({
      error: 'Missing required order property',
    });
  }

  await binanceFuture.loadMarkets();
  let symbols = binanceFuture.symbols;
  if (symbols.find( e => e === orderParams.symbol )) {
    return res.status(201).json(await createNewOrder(orderParams));
  } else {
    return res.status(201).json(await createSpotOrder(orderParams));
  }
  
}


async function httpGetOpenOrders(req, res) {
  return res.status(200).json(await getOpenOrders());
}


module.exports = {
  httpCreateNewOrder,
  httpGetOpenOrders
};
