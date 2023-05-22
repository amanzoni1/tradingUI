import { useState, useEffect } from 'react';
import { useGetRequest } from './requests';

const useAccountInfo = () => {
  const [marginBalance, setMarginBalance] = useState(null);
  const [pnl, setPnl] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { data, error: requestError, isLoading: requestIsLoading, mutate  } = useGetRequest('/account/future');

  useEffect(() => {
    if (data) {
      const { marginBalance, pnl } = data;
      setMarginBalance(marginBalance);
      setPnl(pnl);
      setIsLoading(false);
    }
  }, [data]);

  useEffect(() => {
    if (requestError) {
      setError(requestError);
      setIsLoading(false);
    }
  }, [requestError]);

  useEffect(() => {
    setIsLoading(requestIsLoading);
  }, [requestIsLoading]);

  return {
    marginBalance,
    pnl,
    error,
    isLoading,
    mutate,
    refetch() {
      return mutate();
    },
  };
};

export default useAccountInfo;