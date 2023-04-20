const axios = require('axios');
const WebSocket = require('ws');
const crypto = require('crypto');
const querystring = require('querystring');
require('dotenv').config();

const baseURL = 'https://fapi.binance.com';
const apiKey = process.env.BINANCE_API_KEY;
const secretKey = process.env.BINANCE_SECRET_KEY;
const priceObj = {};
const infoObj = {};


// make everything start
async function loadFutureMarkets1() { 
  console.log('future markets have been started!');
  
  keepBinanceFutAlive();
  binSocket();
  setinfoObj();
  setInterval(setinfoObj, 6 * 60 * 60 * 1000);
  setInterval(optimalLeverage, 12 * 60 * 60 * 1000);
}



// BACKGROUND SETTING PROPERTY

//keep sending ping
function keepBinanceFutAlive() {
  setInterval(() => {
    try {
      axios.get(`${baseURL}/fapi/v1/ping`);
    } catch (error) {
      console.log('Error sending ping request:', error);
    }
  }, 1000*20);
}

// Track real time price of the coin and save them in an array, first price is the last
function binSocket() {
  const socket = new WebSocket('wss://fstream.binance.com/ws/!ticker@arr');
  socket.on('message', (data) => {
    const dataArray = JSON.parse(data);
    dataArray.forEach((priceData) => {
      const symbol = priceData.s;
      const price = parseFloat(priceData.c);
      if (!priceObj.hasOwnProperty(symbol)) {
        priceObj[symbol] = { price: [price] };
      } else {
        priceObj[symbol].price = priceObj[symbol].price.length < 20 ? [price, ...priceObj[symbol].price] : [price, ...priceObj[symbol].price.slice(0, -1)];
      }
    });
  });
  socket.on('close', (code) => {
    console.log(`WebSocket connection closed with code ${code}`);
    setTimeout(() => binSocket(), 1000);
  });
  socket.on('error', (e) => {
    console.log('WebSocket connection error: ' + e);
    setTimeout(() => binSocket(), 1000);
  });
}

//Create an object with the orders filters
async function setinfoObj() {
  try {
    const response = await axios.get(`${baseURL}/fapi/v1/exchangeInfo`);
    const tradingSymbols = response.data.symbols.filter((e) => e.status === "TRADING");
    tradingSymbols.forEach((symbol) => { infoObj[symbol.symbol] = symbol.filters });
    return infoObj;
  } catch (error) {
    console.error("Error fetching exchange info:", error);
    throw error;
  }
}

//Optimal leverage for all symbol
async function optimalLeverage() {
  try {
    const accountMarginBalance = await getMarginBalance();
    const response = await axios.get(`${baseURL}/fapi/v1/exchangeInfo`);
    const symbolsArr = response.data.symbols.filter(e => e.status === 'TRADING').map(e => e.symbol);

    for (let i = 0; i < symbolsArr.length; i++) {
      const symbol = symbolsArr[i];
      const timestamp = Date.now();
      const url = 'https://fapi.binance.com/fapi/v1/leverageBracket';
      const params = { timestamp, symbol };
      const signature = generateSignature(params);
      const config = {
        headers: { 'X-MBX-APIKEY': apiKey },
        params: { ...params, signature },
      };

      const response = await axios.get(url, config);
      const leverageOptions1 = response.data;
      const leverageOptions = leverageOptions1[0].brackets;

      const result = leverageOptions.reduce((acc, bracket) => {
        const notionalCap = parseFloat(bracket.notionalCap);
        const maxLeverage = parseFloat(bracket.initialLeverage);
        const currentMaxPosition = (accountMarginBalance * maxLeverage) > notionalCap ? notionalCap : (accountMarginBalance * maxLeverage);

        if (currentMaxPosition > acc.maxPosition) {
          return { maxLeverage, maxPosition: currentMaxPosition };
        } else {
          return acc;
        }
      }, { maxLeverage: 0, maxPosition: 0 });

      const maxL = result.maxLeverage;
      await setLeverage(symbol, maxL);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

//Set the optimal leverage for any coins
async function setLeverage(symbol, leverage) {
  try {
    const timestamp = Date.now();
    const params = { timestamp, symbol, leverage };
    const signature = generateSignature(params);
    const config = {
      headers: { 'X-MBX-APIKEY': apiKey },
      params: { ...params, signature },
    };

    const response = await axios.post(`${baseURL}/fapi/v1/leverage`, null, config);
    //console.log(`Successfully set leverage for ${symbol}`);
  } catch (error) {
    console.error(`Failed to set leverage for ${symbol}`);
    console.error(error);
  }
}










// GENERAL FUNCTIONS

//Generate signature when needed
function generateSignature(params) {
  try {
    const queryString = Object.keys(params)
      .map((key) => {
        if (key === 'orderIdList') {
          return `${key}=${encodeURIComponent(JSON.stringify(params[key]))}`;
        } else {
          return `${key}=${params[key]}`;
        }
      })
      .join('&');

    const signature = crypto.createHmac('sha256', secretKey).update(queryString).digest('hex');
    return signature;
  } catch (error) {
    console.error('Error generating signature:', error);
    throw error;
  }
}

//Get all symbols
async function getAllFutureSymbols() {
  try {
    const response = await axios.get(`${baseURL}/fapi/v1/exchangeInfo`);
    const symbols = response.data.symbols
      .filter(e => e.status === 'TRADING')
      .map(e => e.symbol);

    const modifiedSymbols = symbols.map(e => {
      if (e.endsWith('USDT')) {
        return e.slice(0, -4) + '/' + 'USDT';
      } else if (e.endsWith('BUSD')) {
        return e.slice(0, -4) + '/' + 'BUSD';
      } else {
        return e;
      }
    });

    const renderSymbols = modifiedSymbols.map(e => ({ label: e, value: e }));
    return renderSymbols;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

//Get available margin
async function getMarginBalance() {
  try {
    const timestamp = Date.now();
    const url = `${baseURL}/fapi/v2/account`;
    const params = { timestamp };
    const signature = generateSignature(params);
    const config = {
      headers: { 'X-MBX-APIKEY': apiKey },
      params: { ...params, signature },
    };

    const response = await axios.get(url, config);
    const accountData = response.data;
    const marginBalance = accountData.assets.find(asset => asset.asset === 'USDT').crossWalletBalance;
    console.log('Margin Balance Available:', marginBalance);
    return marginBalance;
  } catch (error) {
    console.error(error);
    throw error;
  }
}













// FETCH DELLE VARIE POSIZIONI E ORDINI

//Get all open positions
async function getOpenPositions() {
  try {
    const timestamp = Date.now();
    const url = `${baseURL}/fapi/v2/positionRisk`;
    const params = { timestamp };
    const signature = generateSignature(params);
    const config = {
      headers: { 'X-MBX-APIKEY': apiKey },
      params: { ...params, signature },
    };

    const response = await axios.get(url, config);
    const positions = response.data.filter(position => position.notional !== '0');
    return positions;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

//Get all open orders or a specific symbol if given
async function getOpenOrders(symbol) {
  const timestamp = Date.now();
  const url = `${baseURL}/fapi/v1/openOrders`;
  const params = { timestamp };
  if (symbol) { params.symbol = symbol }
  const signature = generateSignature(params);
  const config = {
    headers: { 'X-MBX-APIKEY': apiKey },
    params: { ...params, signature },
  };

  try {
    const response = await axios.get(url, config);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// query the status of a specific order
async function queryOrders(symbol, orderId) {
  const timestamp = Date.now();
  const url = `${baseURL}/fapi/v1/order`;
  const params = { timestamp, symbol, orderId };
  const signature = generateSignature(params);
  const config = {
    headers: { 'X-MBX-APIKEY': apiKey },
    params: { ...params, signature },
  };

  try {
    const response = await axios.get(url, config);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}















// CREARE E CHIUDERE ORDINI

//create orders
async function createOrder(orderParams) {
  const preparedParams = await prepareOrderParams(orderParams);
  const url = `${baseURL}/fapi/v1/order`;
  const signature = generateSignature(preparedParams);
  const config = {
    headers: { 'X-MBX-APIKEY': apiKey },
    params: { ...preparedParams, signature },
  };

  try {
    const response = await axios.post(url, null, config);
    const order = await queryOrders(response.data.symbol, response.data.orderId);

    if (orderParams.type === 'LIMIT_UP') {
      const stopMarketOrderParams = {
        symbol: orderParams.symbol,
        type: 'STOP',
        side: orderParams.side === 'BUY' ? 'SELL' : 'BUY',
        quantity: order.executedQty,
        stopPrice: orderParams.side === 'BUY' ? parseFloat(order.avgPrice * 0.98) : parseFloat(order.avgPrice * 1.02),
      };
      await createOrder(stopMarketOrderParams);
    }

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Close or reduce open Positions and adj SL
async function closePosition(orderParams) {
  const { symbol, type, sideClose, contracts, reduction } = orderParams;
  const rawQuantity = contracts * reduction;
  const params = { symbol, type, side: sideClose, quantity: rawQuantity };

  try {
    const closedPosition = await createOrder(params);
    const orders = await getOpenOrders(symbol);
    const stopMarketOrders = orders.filter(order => order.type === 'STOP_MARKET' && order.side === sideClose);

    let newQuantity = 0;
    let totalWeightedPrice = 0;

    stopMarketOrders.forEach(order => {
      const remainingQuantity = order.origQty - order.executedQty;
      newQuantity += remainingQuantity;
      totalWeightedPrice += order.stopPrice * remainingQuantity;
    });

    let weightedStopPrice = 0;
    if (newQuantity > 0) {
      weightedStopPrice = totalWeightedPrice / newQuantity;
    }

    const newOrderParams = {
      symbol: symbol,
      type: 'STOP',
      side: sideClose,
      quantity: newQuantity - (newQuantity * reduction),
      stopPrice: weightedStopPrice,
    };

    if (stopMarketOrders.length > 0) { await closeMultipleOrders(stopMarketOrders) }
    if(reduction !== 1) { await createOrder(newOrderParams) }

    return closedPosition;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Close multiple orders
async function closeMultipleOrders(orders) {
  const timestamp = Date.now();
  const symbol = orders[0].symbol;
  const orderIdList = orders.map(order => order.orderId);
  const params = { symbol, timestamp, orderIdList };
  const url = `${baseURL}/fapi/v1/batchOrders`;
  const signature = generateSignature(params);
  const config = {
    headers: { 
      'X-MBX-APIKEY': apiKey,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };
  const data = querystring.stringify({ ...params, signature, orderIdList: JSON.stringify(orderIdList) });

  try {
    const response = await axios.delete(url, { ...config, data });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}











// SETTING PARAMETRI E FILTRI

// set the right params for any kind of orders
async function prepareOrderParams(orderParams) {
  const { symbol, type } = orderParams;
  const priceNow = priceObj[symbol]?.price[0];
  const pricePre = priceObj[symbol]?.price[10];
  const symbolFilters = infoObj[symbol];
  const timestamp = Date.now();
  const params = { timestamp, symbol, ...orderParams };

  switch (type) {
    case 'MARKET':
      setMarketOrderParams(params, priceNow, symbolFilters);
      break;
    case 'LIMIT':
      setLimitOrderParams(params, symbolFilters);
      break;
    case 'LIMIT_UP':
      setLimitUpOrderParams(params, pricePre, symbolFilters);
      break;
    case 'STOP':
      setStopOrderParams(params, symbolFilters);
      break;
    default:
      throw new Error(`Invalid order type: ${type}`);
  }

  return params;
}

//function for setting specific params for any type order
function setMarketOrderParams(params, priceNow, symbolFilters) {
  params.type = 'MARKET';
  const { formattedQuantity } = formatMarketQuantity(params.quantity ? params.quantity : params.amount / priceNow, symbolFilters);
  params.quantity = formattedQuantity;
}

function setLimitOrderParams(params, symbolFilters) {
  params.type = 'LIMIT';
  const formattedPrice = formatPrice(params.price, symbolFilters);
  const { formattedQuantity } = formatQuantity(params.quantity ? params.quantity : params.amount / params.price, symbolFilters);
  params.price = formattedPrice;
  params.quantity = formattedQuantity;
  params.timeInForce = 'GTC';
}

function setLimitUpOrderParams(params, pricePre, symbolFilters) {
  params.type = 'LIMIT';
  const targetPrice = params.side === 'BUY' ? (pricePre * 1.03) : (pricePre * 0.97);
  const formattedPrice = formatPrice(targetPrice, symbolFilters);
  const { formattedQuantity } = formatQuantity(params.quantity ? params.quantity : params.amount / pricePre, symbolFilters);
  params.price = formattedPrice;
  params.quantity = formattedQuantity;
  params.timeInForce = 'IOC';
}

function setStopOrderParams(params, symbolFilters) {
  if (params.price) {
    const formattedPrice = formatPrice(params.price, symbolFilters);
    const formattedStopPrice = formatPrice(params.stopPrice, symbolFilters);
    const { formattedQuantity } = formatQuantity(params.quantity ? params.quantity : params.amount / params.price, symbolFilters);
    params.type = 'STOP';
    params.price = formattedPrice;
    params.stopPrice = formattedStopPrice;
    params.quantity = formattedQuantity;
  } else {
    const formattedStopPrice = formatPrice(params.stopPrice, symbolFilters);
    const { formattedQuantity } = formatQuantity(params.quantity ? params.quantity : params.amount / params.stopPrice, symbolFilters);
    params.type = 'STOP_MARKET';
    params.stopPrice = formattedStopPrice;
    params.quantity = formattedQuantity;
  }
}

// set a price in line with filters
function formatPrice(price, symbolFilters) {
  const priceFilter = symbolFilters.find((filter) => filter.filterType === "PRICE_FILTER");

  if (!priceFilter) { throw new Error("PRICE_FILTER not found for this symbol."); }

  const { minPrice, maxPrice, tickSize } = priceFilter;
  const priceNumber = parseFloat(price);
  const tickSizeNumber = parseFloat(tickSize);

  if (tickSizeNumber === 0) { return price; }

  const adjustedPrice = Math.round((priceNumber - parseFloat(minPrice)) / tickSizeNumber) * tickSizeNumber + parseFloat(minPrice);
  const formattedPrice = adjustedPrice.toFixed((tickSize.split('.')[1] || []).length);

  return formattedPrice;
}

// set a qty in line with filters
function formatQuantity(quantity, symbolFilters) {
  const lotSizeFilter = symbolFilters.find((filter) => filter.filterType === "LOT_SIZE");

  if (!lotSizeFilter) { throw new Error("LOT_SIZE filter not found for this symbol."); }

  const { minQty, maxQty, stepSize } = lotSizeFilter;
  const quantityNumber = parseFloat(quantity);
  const stepSizeNumber = parseFloat(stepSize);
  const maxQtyNumber = parseFloat(maxQty);

  if (stepSizeNumber === 0) { return { formattedQuantity: quantity, ordersRequired: 1 }; }

  let ordersRequired = 1;
  let adjustedQuantity;

  if (quantityNumber > maxQtyNumber) {
    ordersRequired = Math.ceil(quantityNumber / maxQtyNumber);
    adjustedQuantity = maxQtyNumber;
  } else {
    adjustedQuantity = Math.round((quantityNumber - parseFloat(minQty)) / stepSizeNumber) * stepSizeNumber + parseFloat(minQty);
  }
  const formattedQuantity = adjustedQuantity.toFixed((stepSize.split('.')[1] || []).length);

  return { formattedQuantity, ordersRequired };
}

// set a qty in line with filters with markets orders
function formatMarketQuantity(quantity, symbolFilters) {
  const marketLotSizeFilter = symbolFilters.find((filter) => filter.filterType === "MARKET_LOT_SIZE");

  if (!marketLotSizeFilter) { throw new Error("MARKET_LOT_SIZE filter not found for this symbol."); }

  const { minQty, maxQty, stepSize } = marketLotSizeFilter;
  const quantityNumber = parseFloat(quantity);
  const stepSizeNumber = parseFloat(stepSize);
  const maxQtyNumber = parseFloat(maxQty);

  if (stepSizeNumber === 0) { return { formattedQuantity: quantity, ordersRequired: 1 }; }

  let ordersRequired = 1;
  let adjustedQuantity;

  if (quantityNumber > maxQtyNumber) {
    ordersRequired = Math.ceil(quantityNumber / maxQtyNumber);
    adjustedQuantity = maxQtyNumber;
  } else {
    adjustedQuantity = Math.round((quantityNumber - parseFloat(minQty)) / stepSizeNumber) * stepSizeNumber + parseFloat(minQty);
  }
  const formattedQuantity = adjustedQuantity.toFixed((stepSize.split('.')[1] || []).length);

  return { formattedQuantity, ordersRequired };
}








module.exports = {
  loadFutureMarkets1,
  getAllFutureSymbols,
  createOrder,
  getOpenPositions,
  getOpenOrders,
  closePosition
};



