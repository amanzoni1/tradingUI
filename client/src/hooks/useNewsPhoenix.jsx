import { useState, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import config from '../config';

const getCoinsFromMessage = (message) => {
  const coinsSet = new Set();

  if (message.coin) {
    coinsSet.add(message.coin);
  }

  if (message.suggestions) {
    message.suggestions.forEach(suggestion => {
      if (suggestion.coin) {
        coinsSet.add(suggestion.coin);
      }
    });
  }
  return Array.from(coinsSet);
};

const useNewsPhoneix = () => {
  const [coins, setCoins] = useState(['', '', '', '', '']);
  const [messages, setMessages] = useState([]);

  const { sendMessage, lastMessage } = useWebSocket(config.wsPhoenixUrl, {
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
    if (lastMessage) {
      try {
        let parsedMessage = JSON.parse(lastMessage?.data);

        if (parsedMessage.body) {
          parsedMessage = {
            ...parsedMessage,
            source: parsedMessage.name,
            title: parsedMessage.body,
            body: undefined,
          };
        }

        if (parsedMessage.source === 'Webs' || parsedMessage.source === 'Crypto' || parsedMessage.source === 'Blogs') {
          let title = parsedMessage.coin ? parsedMessage.coin + ': ' + parsedMessage.title : parsedMessage.sourceName + ': ' + parsedMessage.title;
          parsedMessage = {
            ...parsedMessage,
            source: 'Blogs',
            title: title,
          };
        }
        setMessages(prevMessages => [parsedMessage, ...prevMessages]);

        const newCoins = getCoinsFromMessage(parsedMessage);
        setCoins(prevCoins => {
          const updatedCoins = newCoins.filter(newCoin => !prevCoins.includes(newCoin));
          return [...updatedCoins, ...prevCoins].slice(0, 5);
        });

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

export default useNewsPhoneix;

















/*
import { useState, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import useSymbols from './useSymbols';
import config from '../config';

const useNewsPhoneix = () => {
  const [coins, setCoins] = useState(['', '', '', '', '']);
  const [messages, setMessages] = useState([]);
  const { data: symbols } = useSymbols();

  const { sendMessage, lastMessage } = useWebSocket(config.wsPhoenixUrl, {
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
    if (lastMessage) {
      try {
        let parsedMessage = JSON.parse(lastMessage?.data);

        if (parsedMessage.body) {
          parsedMessage = {
            ...parsedMessage,
            source: parsedMessage.name,
            title: parsedMessage.body,
            body: undefined,
          };
        }

        if (parsedMessage.source === 'Webs' || parsedMessage.source === 'Crypto' || parsedMessage.source === 'Blogs') {
          let title = parsedMessage.coin ? parsedMessage.coin + ': ' + parsedMessage.title : parsedMessage.sourceName + ': ' + parsedMessage.title;
          parsedMessage = {
            ...parsedMessage,
            source: 'Blogs',
            title: title,
          };
        }
        setMessages(prevMessages => {
          const newMessages = [parsedMessage, ...prevMessages];
          return newMessages.slice(0, 50);
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

export default useNewsPhoneix;
*/