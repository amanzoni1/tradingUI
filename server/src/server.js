const http = require('http');
const app = require('./app');

const WebSocket = require('ws');
const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_1m');

ws.on('message', function incoming(data) {
  if (data) {
    const trade = JSON.parse(data); // parsing single-trade record
    //console.log(trade);
  }
});

const { loadMarkets } = require('./models/binance.models');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
  await loadMarkets();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}
startServer();