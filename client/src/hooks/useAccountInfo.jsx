import { useState, useEffect } from 'react';
import { useGetRequest } from './requests';

const useAccountInfo = () => {
  const [spotBalance, setSpotBalance] = useState(null);
  const [marginBalance, setMarginBalance] = useState(null);
  const [pnl, setPnl] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { data: spotData, error: spotError, isLoading: spotIsLoading, mutate: mutateSpot } = useGetRequest('/account/spot');
  const { data: futureData, error: futureError, isLoading: futureIsLoading, mutate: mutateFuture } = useGetRequest('/account/future');

  useEffect(() => {
    if (spotData !== null) {
      setSpotBalance(spotData); 
    }
    if (futureData) {
      const { marginBalance, pnl } = futureData;
      setMarginBalance(marginBalance);
      setPnl(pnl);
    }
    setIsLoading(spotIsLoading || futureIsLoading);
  }, [spotData, futureData, spotIsLoading, futureIsLoading]);

  useEffect(() => {
    if (spotError || futureError) {
      setError(spotError || futureError);
      setIsLoading(false);
    }
  }, [spotError, futureError]);

  return {
    spotBalance,
    marginBalance,
    pnl,
    error,
    isLoading,
    refetchSpot: mutateSpot,
    refetchFuture: mutateFuture,
  };
};

export default useAccountInfo;