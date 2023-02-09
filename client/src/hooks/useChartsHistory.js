import {getAllGraphsRequest, useGetRequest} from "./requests";

const useChartHistory = () => {
    const { data, error, isLoading, mutate } = getAllGraphsRequest();

    return {
        chartData: data,
        error,
        chartIsLoading: isLoading,
        mutate,
        refetchChartHistory() {
            return mutate();
        },
    };
};

export default useChartHistory;
