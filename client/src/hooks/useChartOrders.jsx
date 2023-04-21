import { useState, useEffect } from 'react';
import useOpenOrders from './useOpenOrders';

const useChartOrders = (selectedSymbol) => {
  const { data: orders } = useOpenOrders();
  const [orderLines, setOrderLines] = useState([]);

  const symbol = selectedSymbol?.label.replace(/\//g, '');

  useEffect(() => {
    if (selectedSymbol) {
      const symbolOrders = orders.filter((e) => e.symbol === symbol);
      
      const newOrderLines = symbolOrders.map(order => {
        const price = Number(order.stopPrice) !== 0 ? Number(order.stopPrice) : Number(order.price);
        return {
          price: price,
          color: order.side === 'BUY' ? 'rgb(14, 203, 129)' : 'rgb(246, 70, 93)',
          lineWidth: 1,
          lineStyle: Number(order.stopPrice) !== 0 ? 3 : 1,
          axisLabelVisible: true,
        };
      });

      setOrderLines(newOrderLines);
    } else {
      setOrderLines([]);
    }
  }, [selectedSymbol, orders]);

  return orderLines;
};

export default useChartOrders;