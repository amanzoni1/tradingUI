import { useEffect, useState } from 'react';
import useFutureSymbols from './useFutureSymbols';


const useChartHistory = (selectedSymbol, interval) => {
  const [chartData, setChartData] = useState(null);
  const { data: futSymbols } = useFutureSymbols();

  const isCoinExistInFutureSymbols = selectedSymbol ? futSymbols.find(e => e.label === selectedSymbol.label) : '';
  const binApi = !selectedSymbol ? 'future' : isCoinExistInFutureSymbols ? 'future' : 'spot';

  useEffect(() => {
    if (binApi === 'future') {
      const fetchChartHistory = async () => {
        try {
          const symbFut = selectedSymbol ? selectedSymbol.label.replace(/[^a-z]/gi, '').toLowerCase() : 'btcusdt';
          const response = await fetch(`https://fapi.binance.com/fapi/v1/klines?symbol=${symbFut}&interval=${interval}`);
          const data = await response.json();
          setChartData(data); 
        } catch (error) {
          console.error(error);
        }
      }
      fetchChartHistory()
    } else {
        const fetchChartHistory = async () => {
        try {
          const symSpot = selectedSymbol ? selectedSymbol.label.replace(/[^a-z]/gi, '') : 'BTCUSDT';
          const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symSpot}&interval=${interval}`);
          const data = await response.json();
          setChartData(data); 
        } catch (error) {
          console.error(error);
        }
      }
      fetchChartHistory()
      }

  }, [selectedSymbol, interval])

  return { chartData };
};

export default useChartHistory;