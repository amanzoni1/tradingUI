const config = {
  // TODO: Use from environment variable
  apiEndpoint: 'http://localhost:8000',
  wsUri: 'wss://www.madnews.io/ws',
  wsUri1: 'wss://stream.binance.com:9443/ws/btcusdt@kline_1m',
  defaultAmount: 'amount',
  smallReduce: 0.2,
  midReduce: 0.33,
  bigReduce: 0.5,
  swr: {
    revalidateOnFocus: false,
  },
  binLinkPRD: 'http://binance.com/en/futures/',
  binLinkTest: 'https://testnet.binancefuture.com/en/futures/',
};

export default config;