const crypto = require('crypto');
const axios = require('axios');
require('dotenv').config();

const baseURL = 'https://fapi.binance.com';
const endpoint = '/fapi/v1/order';
const pingPoint = '/fapi/v1/ping';
const apiKey = process.env.BINANCE_API_KEY;
const secretKey = process.env.BINANCE_SECRET_KEY;