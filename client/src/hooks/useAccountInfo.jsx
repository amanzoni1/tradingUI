import { useGetRequest } from './requests';

const useAccountInfo = () => {
  const { data: marginBalance, error, isLoading } = useGetRequest('/account/future');

  return {
    marginBalance,
    error,
    isLoading,
  };
};

export default useAccountInfo;
