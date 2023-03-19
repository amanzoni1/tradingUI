const { getAllFutureSymbols } = require('../../models/binanceFuture.models');



function httpGetAllMarkets(req, res) {
  return res.status(200).json(getAllSymbols());
}


module.exports = {

};

