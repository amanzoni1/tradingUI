const { getMarginBalance } = require('../../models/binanceFuture.models');
//const { getAllSymbols } = require('../../models/binanceSpot.models');


async function httpGetSpotAccountInfo(req, res) {
  return res.status(200).json(await getMarginBalance());
}

async function httpGetFuturesAccountInfo(req, res) {
  return res.status(200).json(await getMarginBalance());
}



module.exports = {
  httpGetSpotAccountInfo,
  httpGetFuturesAccountInfo
};

