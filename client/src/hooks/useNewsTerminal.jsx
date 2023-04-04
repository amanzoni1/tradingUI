import { useState, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import useSymbols from './useSymbols';
import config from '../config';

const useNewsTerminal = () => {
  const [coins, setCoins] = useState('');
  const { data: symbols } = useSymbols();

  const { sendMessage, lastMessage } = useWebSocket(config.wsUri, {
    shouldReconnect: (closeEvent) => true,
    reconnectAttempts: 100,
    reconnectInterval: 3000,
  });

  useEffect(() => {
    const res = sendMessage('login 842752f3f9b8271110aa50829407762f536b8a34e43661db7f3e3ff4cb8ca772');
  }, []);

  useEffect(() => {
  if (lastMessage) {
    const message = JSON.parse(lastMessage?.data);

    if(message?.suggestions?.length > 0) {
      //for (let i = 0; i < message?.suggestions?.length; i++) {
        const coin = message.suggestions[0]['coin'];
        const coinSym = coin + '/USDT';
        setCoins(coinSym);
      
    }  else {
      for (let x in symbols) {
        let coin = symbols[x].label.replace(/\/USDT|\/BUSD/gi, '');
        let coinEx = '[^A-Za-z0-9_]' + coin + '[^A-Za-z0-9_]';
        let regex = new RegExp(coinEx, 'gi'); 
        if (message?.title?.match(regex) || message?.body?.match(regex)) {
          if(coin !== 'T' && coin !== 'FOR') {
            const coinSy = coin + '/USDT';
            setCoins(coinSy);
          }
        }
      } 
    }
  }
}, [lastMessage]);

  return { coins };
};

export default useNewsTerminal;



/*
if (lastMessage) {
      const message = JSON.parse(lastMessage?.data);
      const action = message?.actions ? message?.actions[1]?.title : '';

      if (action && action?.length > 0) {
        const newAction = action.replace(/\/.*/   
       /*, '/USDT');      <---------------------------------------------------
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
            if(coin !== 'T' && coin !== 'FOR') {
              const coinSy = coin + '/USDT';
              setCoins(coinSy);
            }
          } else {
            for (let x in symbols) {
              let coin = symbols[x].label.replace(/\/USDT|\/BUSD/gi, '');
              let coinEx = '[^A-Za-z0-9_]' + coin + '[^A-Za-z0-9_]';
              let regex = new RegExp(coinEx, 'gi'); 
                if (message?.title?.match(regex) || message?.body?.match(regex)) {
                  if(coin !== 'T' && coin !== 'FOR') {
                    const coinSy = coin + '/USDT';
                    setCoins(coinSy);
                  }
                }
            } 
          }
        }
     }  
    }
    */



