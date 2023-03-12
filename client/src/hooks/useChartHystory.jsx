import { useBinanceRequest, useBinanceFutRequest } from './requests';
//import useFutureSymbols from './useFutureSymbols';


const useChartHistory = (selectedSymbol, interval) => {
  //const { data: futSymbols } = useFutureSymbols();

  const symFetch = selectedSymbol ? selectedSymbol.label.replace(/[^a-z]/gi, '') : 'BTCUSDT';
  //const isCoinExistInFutureSymbols = selectedSymbol ? futSymbols.find(e => e.label === selectedSymbol.label) : '';
  //const binApi = isCoinExistInFutureSymbols ? useBinanceFutRequest : useBinanceRequest;

  const urlParams = `v1/klines?symbol=${symFetch}&interval=${interval}`;
  const { data, error, isLoading, mutate } = useBinanceRequest(urlParams);

  return {
    chartData: data,
    error,
    chartIsLoading: isLoading,
    mutate,
  };
};

export default useChartHistory;
