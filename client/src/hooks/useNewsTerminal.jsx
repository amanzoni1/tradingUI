import { useState, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import useSymbols from './useSymbols';
import useFutureSymbols from './useFutureSymbols';
import config from '../config';

const useNewsTerminal = () => {
  const [coins, setCoins] = useState('');
  const { data: symbols } = useSymbols();
  const { data: futSymbols } = useFutureSymbols();

  const { sendMessage, lastMessage } = useWebSocket(config.wsUri, {
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
    sendMessage('login 842752f3f9b8271110aa50829407762f536b8a34e43661db7f3e3ff4cb8ca772');
  }, []);

  useEffect(() => {
    if (lastMessage) {
      const message = JSON.parse(lastMessage?.data);
      const action = message?.actions ? message?.actions[1]?.title : '';

      if (action && action?.length > 0) {
        const newAction = action.replace(/\/.*/, '/USDT');
        if (isCoinExistInSymbols(newAction)) {
          setCoins(newAction);
          return;
        } if (coinWithOthersQuoteCurr(newAction)) {
          const newCoin = newAction.replace(/USDT/gi, 'BUSD');
          setCoins(newCoin);
          return;
          } 
      }
      if(!action) {
        for (let x in futSymbols) {
          let coin = futSymbols[x].label.replace(/\/USDT|\/BUSD/gi, '');
          let coinEx = '[^A-Za-z0-9_]' + coin + '[^A-Za-z0-9_]';
          let regex = new RegExp(coinEx, 'gi'); 
          if (message?.title?.match(regex) || message?.body?.match(regex)) {
            if(coin != 'T' && coin !='FOR') {
              const coinSy = coin + '/USDT';
              setCoins(coinSy);
            }
          } else {
            for (let x in symbols) {
              let coin = symbols[x].label.replace(/\/USDT|\/BUSD/gi, '');
              let coinEx = '[^A-Za-z0-9_]' + coin + '[^A-Za-z0-9_]';
              let regex = new RegExp(coinEx, 'gi'); 
                if (message?.title?.match(regex) || message?.body?.match(regex)) {
                  if(coin != 'T' && coin !='FOR') {
                    const coinSy = coin + '/USDT';
                    setCoins(coinSy);
                  }
                }
            } 
          }
        }
     }  
    }
  }, [lastMessage]);

  return { coins };
};

export default useNewsTerminal;
