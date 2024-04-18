import { useState, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import useSymbols from './useSymbols';
import config from '../config';

const useNewsTerminal = () => {
  const [coins, setCoins] = useState(['', '', '', '', '']);
  const [messages, setMessages] = useState([]);
  const { data: symbols } = useSymbols();

  const { sendMessage, lastMessage } = useWebSocket(config.wsUri, {
    shouldReconnect: (closeEvent) => true,
    reconnectAttempts: 100,
    reconnectInterval: 3000,
  });

  useEffect(() => {
    const heartbeat = setInterval(() => {
      sendMessage('ping');
    }, 10 * 1000);

    return () => clearInterval(heartbeat);
  }, [sendMessage]);

  useEffect(() => {
    const res = sendMessage('login 842752f3f9b8271110aa50829407762f536b8a34e43661db7f3e3ff4cb8ca772');
  }, []);

  useEffect(() => {
    if (lastMessage) {
      try {
        let parsedMessage = JSON.parse(lastMessage?.data);

        if (parsedMessage.body) {
          parsedMessage = {
            ...parsedMessage,
            source: parsedMessage.title,
            title: parsedMessage.body,
            body: undefined,
          };
        }
        setMessages(prevMessages => {
          const newMessages = [parsedMessage, ...prevMessages];
          return newMessages;
        });
        const newCoinsSet = new Set();

        if (parsedMessage?.suggestions?.length > 0) {
          const newCoins = parsedMessage.suggestions.map(suggestion => suggestion.coin + '/USDT');
          setCoins(prevCoins => [...newCoins, ...prevCoins]);
          //parsedMessage.suggestions.forEach(suggestion => newCoinsSet.add(suggestion.coin + '/USDT'));
        }

        for (let x in symbols) {
          let coin = symbols[x].label.replace(/\/USDT|\/BUSD/gi, '');
          let coinEx = '(?<![A-Za-z0-9_])[$]?' + coin + '(?:[Uu][Ss][Dd][A-Za-z]*)?(?![A-Za-z0-9_])';
          let regex = new RegExp(coinEx, 'gi');
          if (parsedMessage?.title?.match(regex) || parsedMessage?.body?.match(regex)) {
            if (coin !== 'T' && coin !== 'FOR') {
              newCoinsSet.add(coin + '/USDT');
            }
          }
        }

        if (newCoinsSet.size > 0) {
          const newCoins = Array.from(newCoinsSet);
          setCoins(prevCoins => {
            const lastCoin = prevCoins[0];
            const filteredNewCoins = newCoins.filter(coin => !prevCoins.includes(coin) && coin !== lastCoin);
            return [...filteredNewCoins, ...prevCoins];
          });

        }
      } catch (e) {
        if (lastMessage?.data === 'pong') {
          //console.log('Pong received');
        } else {
          console.error('Received non-JSON message:', lastMessage?.data);
        }
      }
    }
  }, [lastMessage]);

  return { coins, messages };
};

export default useNewsTerminal;





