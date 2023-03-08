import { useState, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';

const useChartUpdates = (selectedSymbol, interval) => {
  const [trade, setTrade] = useState({});
  const symbSocket = selectedSymbol ? selectedSymbol.label.replace(/[^a-z]/gi, '').toLowerCase() : 'btcusdt';
  const { lastMessage } = useWebSocket(`wss://stream.binance.com:9443/ws/${symbSocket}@kline_${interval}`, {
    shouldReconnect: (closeEvent) => false,
    reconnectAttempts: 0,
    reconnectInterval: 30,
    onReconnectStop: 2,
  });

  useEffect(() => {
    if (lastMessage) {
      const message = JSON.parse(lastMessage?.data);
      const time = message.k.t / 1000 + 3600;
      const value = Number(message.k.l);

      setTrade({ time, value });
    }
  }, [lastMessage]);

  return { trade };
};

export default useChartUpdates;
