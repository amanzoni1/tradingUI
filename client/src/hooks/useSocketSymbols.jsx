import { useState, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import config from '../config';

const useSocketSymbols = () => {
  const [trade, setTrade] = useState({});

  const { lastMessage } = useWebSocket(config.wsUri1, {
    shouldReconnect: (closeEvent) => false,
    reconnectAttempts: 0,
    reconnectInterval: 30,
    onReconnectStop: 2,
  });

  useEffect(() => {
    if (lastMessage) {
      const message = JSON.parse(lastMessage?.data);
      console.log("Message", message)
        const time =  message.k.t;
        const open = message.k.o;
        const close = message.k.c;
        const high = message.k.h;
        const low = message.k.l;
      const array = {time,
          open,
          close,
          high,
          low
      }

        setTrade(array)
    }
  }, [lastMessage]);

  return { trade };
};

export default useSocketSymbols;
