import { useState, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import useSymbols from './useSymbols';
import config from '../config';

const useSocket = () => {
  const [coins, setCoins] = useState('');
  const { data: symbols } = useSymbols();

  const { lastMessage } = useWebSocket(config.wsUri, {
    shouldReconnect: (closeEvent) => true,
    reconnectAttempts: 100,
    reconnectInterval: 3000,
  });

  const isCoinExistInSymbols = (coin) =>
    symbols.find((symbol) => symbol.label === coin);

  const coinWithOthersQuoteCurr = (coin) => {
    const newCoin = coin.replace(/USDT/gi, 'BUSD');
    symbols.find((symbol) => symbol.label === newCoin);
  }

  useEffect(() => {
    if (lastMessage) {
      const message = JSON.parse(lastMessage?.data);
      const title = message?.actions ? message?.actions[1]?.title : '';

      if (title && title?.length > 0) {
        const newTitle = title.replace(/\/.*/, '/USDT');
        if (isCoinExistInSymbols(newTitle)) {
          setCoins(newTitle);
        } if (coinWithOthersQuoteCurr(newTitle)) {
          const newCoin = newTitle.replace(/USDT/gi, 'BUSD');
          setCoins(newCoin);
        }
      }
    }
  }, [lastMessage]);

  return { coins };
};

export default useSocket;
