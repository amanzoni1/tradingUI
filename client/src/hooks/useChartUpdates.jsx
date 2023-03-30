import { useState, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import config from '../config';
import useFutureSymbols from './useFutureSymbols';


const useChartUpdates = (selectedSymbol, interval) => {
  const [line, setLine] = useState({});
  const [candle, setCandle] = useState({});
  const [volume, setVolume] = useState({});
  const { data: futSymbols } = useFutureSymbols();
  const symbSocket = selectedSymbol ? selectedSymbol.label.replace(/[^a-z]/gi, '').toLowerCase() : 'btcusdt';

  const isCoinExistInFutureSymbols = selectedSymbol ? futSymbols.find(e => e.label === selectedSymbol.label) : '';
  const binApi = (isCoinExistInFutureSymbols && interval != '1s') ? config.binanceFutSocket : config.binanceSocket;

  const { lastMessage } = useWebSocket(binApi + `${symbSocket}@kline_${interval}`, {
    shouldReconnect: (closeEvent) => false,
    reconnectAttempts: 0,
    reconnectInterval: 30,
    onReconnectStop: 2,
  });

  useEffect(() => {
    if (lastMessage) {
      const message = JSON.parse(lastMessage?.data);
      const time = message.k.t / 1000 + 3600;
      const value = Number(message.k.c);

      setLine({ time, value });
    }
  }, [lastMessage]);

  useEffect(() => {
    if (lastMessage) {
      const message = JSON.parse(lastMessage?.data);
      const time = message.k.t / 1000 + 3600;
      const open = Number(message.k.o);
      const high = Number(message.k.h);
      const low = Number(message.k.l);
      const close = Number(message.k.c);

      setCandle({ time, open, high, low, close });
    }
  }, [lastMessage]);

  useEffect(() => {
    if (lastMessage) {
      const message = JSON.parse(lastMessage?.data);
      const time = message.k.t / 1000 + 3600;
      const value = Number(message.k.q);

      setVolume({ time, value });
    }
  }, [lastMessage]);

  return { line, candle, volume };
};

export default useChartUpdates;
