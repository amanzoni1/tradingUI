const config = {
  // TODO: Use from environment variable
  apiEndpoint: 'http://localhost:8000',
  wsUri: 'wss://news.treeofalpha.com/ws',
  smallReduce: 0.2,
  midReduce: 0.33,
  bigReduce: 0.5,
  swr: {
    revalidateOnFocus: false,
  },
  binFutureLinkPRD: 'https://binance.com/en/futures/',
  binSpotLinkPRD: 'https://www.binance.com/en/trade/',
  binLinkTest: 'https://testnet.binancefuture.com/en/futures/',
  binanceChart: 'https://api.binance.com/api/v1/klines?',
};

export default config;