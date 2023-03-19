import { useBinanceRequest, useBinanceFutRequest } from './requests';
import useFutureSymbols from './useFutureSymbols';


const useChartHistory = (selectedSymbol, interval) => {
  const { data: futSymbols } = useFutureSymbols();

  const symFetch = selectedSymbol ? selectedSymbol.label.replace(/[^a-z]/gi, '') : 'BTCUSDT';
  const urlParams = `v1/klines?symbol=${symFetch}&interval=${interval}`;

  const isCoinExistInFutureSymbols = selectedSymbol ? futSymbols.find(e => e.label === selectedSymbol.label) : '';
  const binApi = isCoinExistInFutureSymbols ? 'future' : 'spot';

  const { data: spotData } = useBinanceRequest(urlParams);
  const { data: futData } = useBinanceRequest(urlParams);

  if (binApi === 'future') {
    return { chartData: futData };
  } else {
    return { chartData: spotData };
  }
};

export default useChartHistory;
