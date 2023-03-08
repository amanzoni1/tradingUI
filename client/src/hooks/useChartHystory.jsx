import { useAllGraphsRequest } from './requests';

const useChartHistory = (selectedSymbol, interval) => {
  const symFetch = selectedSymbol ? selectedSymbol.label.replace(/[^a-z]/gi, '') : 'BTCUSDT';
  const urlParams = `symbol=${symFetch}&interval=${interval}`;
  const { data, error, isLoading, mutate } = useAllGraphsRequest(urlParams);

  return {
    chartData: data,
    error,
    chartIsLoading: isLoading,
    mutate,
  };
};

export default useChartHistory;
