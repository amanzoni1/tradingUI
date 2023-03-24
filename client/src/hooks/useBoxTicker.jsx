import { useState, useEffect } from 'react';
import useFutureSymbols from './useFutureSymbols';

const useBoxTicker = (selectedSymbol) => {
  const [tickerData, setTickerData] = useState(null);
  const [fundingRate, setFundingRate] = useState(null);
  const [openInterest, setOpenInterest] = useState(null);
  const [topTLSRatio, setTopTLSRatio] = useState(null);
  const [longShortRatio, setLongShortRatio] = useState(null);
  const { data: futSymbols } = useFutureSymbols();

  const isCoinExistInFutureSymbols = selectedSymbol ? futSymbols.find(e => e.label === selectedSymbol.label) : '';
  const binApi = !selectedSymbol ? 'future' : isCoinExistInFutureSymbols ? 'future' : 'spot';

  useEffect(() => {
    if (binApi === 'future') {
      const symbSocket = selectedSymbol ? selectedSymbol.label.replace(/[^a-z]/gi, '').toLowerCase() : 'btcusdt';
      const fetchTickerData = async () => {
        try {
          const response = await fetch(`https://fapi.binance.com/fapi/v1/ticker/24hr?symbol=${symbSocket}`);
          const data = await response.json();
          setTickerData({
            priceChange: data.priceChange,
            priceChangePercent: data.priceChangePercent,
            volume: data.volume,
            quoteVolume: data.quoteVolume,
          });
        } catch (error) {
          console.error(error);
        }
      };

      const fetchFundingRate = async () => {
        try {
          const response = await fetch(`https://fapi.binance.com/fapi/v1/fundingRate?symbol=${symbSocket}`);
          const data = await response.json();
          setFundingRate(data[99]['fundingRate']);
        } catch (error) {
          console.error(error);
        }
      };

      const fetchOpenInterest = async () => {
        try {
          const response = await fetch(`https://fapi.binance.com/fapi/v1/openInterest?symbol=${symbSocket}`);
          const data = await response.json();
          setOpenInterest(data.openInterest);
        } catch (error) {
          console.error(error);
        }
      };

      const fetchTTLSRatio = async () => {
        try {
          const response = await fetch(`https://fapi.binance.com/futures/data/topLongShortPositionRatio?symbol=${symbSocket}&period=1h`);
          const data = await response.json();
          setTopTLSRatio(data[0]['longShortRatio']);
        } catch (error) {
          console.error(error);
        }
      };

      const fetchLSRatio = async () => {
        try {
          const response = await fetch(`https://fapi.binance.com/futures/data/globalLongShortAccountRatio?symbol=${symbSocket}&period=1h`);
          const data = await response.json();
          setLongShortRatio(data[0]['longShortRatio']);
        } catch (error) {
          console.error(error);
        }
      };

      fetchTickerData();
      fetchFundingRate();
      fetchOpenInterest();
      fetchTTLSRatio();
      fetchLSRatio();
      const intervalId = setInterval(() => {
        fetchTickerData();
        fetchFundingRate();
        fetchOpenInterest();
        fetchTTLSRatio();
        fetchLSRatio();
      }, 1000 * 5);
      return () => clearInterval(intervalId);
    } else {
      const symbSocket = selectedSymbol ? selectedSymbol.label.replace(/[^a-z]/gi, '') : 'BTCUSDT';
      const fetchTickerData = async () => {
        try {
          const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbSocket}`);
          const data = await response.json();
          setTickerData({
            priceChange: data.priceChange,
            priceChangePercent: data.priceChangePercent,
            highPrice: data.highPrice,
            lowPrice: data.lowPrice,
            volume: data.volume,
            quoteVolume: data.quoteVolume,
          });
        } catch (error) {
          console.error(error);
        }
      };
      fetchTickerData();
      const intervalId = setInterval(() => fetchTickerData(), 1000 * 5);
      return () => clearInterval(intervalId);
    }
  }, [selectedSymbol]);


  return { tickerData, fundingRate, openInterest, topTLSRatio, longShortRatio };

  
};

export default useBoxTicker;