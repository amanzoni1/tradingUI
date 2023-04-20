const http = require('http');
const app = require('./app');

const { loadFutureMarkets } = require('./models/binanceFuture.models');
const { loadFutureMarkets1 } = require('./models/binanceFuture1.models');
const { loadSpotMarkets } = require('./models/binanceSpot.models');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
  await loadSpotMarkets();
  await loadFutureMarkets1();
  await loadFutureMarkets();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}
startServer();