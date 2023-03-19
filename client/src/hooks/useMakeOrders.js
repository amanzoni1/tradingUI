import { usePostRequest } from './requests';
import { ORDER_SIDE_CLOSE } from '../constants';
import usePositions from './usePositions';
import useSnackbar from './useSnackbar';

function useMakeOrders() {
  const { data, error, trigger, reset, isMutating } = usePostRequest('/orders');
  const { refetch: refetchPositions } = usePositions();
  const { openSnackbar, openErrorSnackbar } = useSnackbar();

  const createLongOrder = async (symbol, type, amount) => {
    try {
      const order = await trigger({
        type,
        amount,
        symbol: symbol.label,
        side: ORDER_SIDE_CLOSE.BUY,
      });

      openSnackbar(`Order created successfully. Status: ${order.status}`);
      await refetchPositions();
    } catch (error) {
      openErrorSnackbar(`Error: ${error.message}`);
    }
  };

  const createShortOrder = async (symbol, type, amount) => {
    try {
      const order = await trigger({
        type,
        amount,
        symbol: symbol.label,
        side: ORDER_SIDE_CLOSE.SELL,
      });

      openSnackbar(`Order created successfully. Status: ${order.status}`);
      await refetchPositions();
    } catch (error) {
      openErrorSnackbar(`Error: ${error.message}`);
    }
  };

  return {
    createLongOrder,
    createShortOrder,
    data,
    error,
    isMutating,
    reset,
    trigger,
  };
}

export default useMakeOrders;
