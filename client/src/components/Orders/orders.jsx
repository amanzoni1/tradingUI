import React, { useState, useEffect, useMemo } from 'react';
import useOpenOrders from '../../hooks/useOpenOrders';
import useDeleteOrder from '../../hooks/useDeleteOrder';
import config from '../../config';
import './orders.css';


function dynamicToFixed(value) {
  if (value === 0) { return '-'}
  let decimals;
  const absValue = Math.abs(value);

  if (absValue >= 100) { decimals = 2 } 
  else if (absValue >= 10) { decimals = 3 } 
  else if (absValue >= 1) { decimals = 4 } 
  else if (absValue >= 0.1) { decimals = 5 } 
  else { decimals = 6 }

  return parseFloat(value.toFixed(decimals)).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function formatText(text) {
  if (text === 'STOP') {
    return 'Stop Limit';
  }

  return text
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
}



const Orders =() => {
  const { data: orders, isLoading, error, refetch } = useOpenOrders();
  const { deleteOrder } = useDeleteOrder();
  const [refreshInterval, setRefreshInterval] = useState(null);


  useEffect(() => {
    const intervalId = setInterval(() => refetch(), 5 * 1000);
    setRefreshInterval(intervalId); 
    return () => clearInterval(intervalId); 
  }, []);

 
  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (orders?.length === 0) {
    return <p className='p-pos'>No Open Orders</p>;
  }

  return (
    <div className='tableWrapper'>
      {orders ? ( 
      <table className='pos-table'>
        <thead className='header'>
          <tr className='ordini'>
            <th style={{ width: '14%'}}>Symbol</th>
            <th style={{ width: '15%'}}>Type</th>
            <th style={{ width: '12%'}}>Side</th>
            <th style={{ width: '14%'}}>Price</th>
            <th style={{ width: '14%'}}>Amount</th>
            <th style={{ width: '14%'}}>Filled</th>
            <th style={{ width: '18%'}}>TriggerCond</th>
            <th style={{ width: '8%'}}>Cancel</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index} className='container' >
              <td style={{ width: '14%'}}>{order.symbol}</td>
              <td style={{ width: '15%', fontSize: '12px'}}>{formatText(order.type)}</td>
              <td style={{ width: '12%'}}>{order.side === 'BUY' ? <div className="green-str">Buy</div> : <div className="red-str">Sell</div>}</td>
              <td style={{ width: '14%', fontSize: '12px'}}>{dynamicToFixed(parseFloat(order.price))}</td>
              <td style={{ width: '14%', fontSize: '12px'}}>
                {dynamicToFixed(
                  parseFloat(
                    order.type === 'STOP_MARKET'
                      ? order.stopPrice * order.origQty
                      : order.price * order.origQty
                  )
                )}
              </td>
              <td style={{ width: '14%', fontSize: '12px'}}>
                {dynamicToFixed(
                  parseFloat(
                    order.type === 'STOP_MARKET'
                      ? order.stopPrice * order.executedQty
                      : order.price * order.executedQty
                  )
                )}
              </td>
              <td style={{ width: '18%', fontSize: '12px'}}>
                {order.origType === 'STOP' || order.origType === 'STOP_MARKET'
                  ? ((order.origType === 'STOP' ? 'Last Price' : 'Mark Price') +
                    (order.side === 'SELL' ? ' <= ' : ' >= ') +
                    dynamicToFixed(parseFloat(order.stopPrice)))
                  : dynamicToFixed(parseFloat(order.stopPrice))}
              </td>
              <td style={{ width: '8%'}}>
                <button
                  className="close-button"
                  onClick={() => deleteOrder(order.symbol, order.orderId)}
                >
                 X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>No open Orders</p>
    )}
    </div>
  );
}

export default Orders;
