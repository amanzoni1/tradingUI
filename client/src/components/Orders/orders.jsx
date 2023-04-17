import React, { useState, useEffect, useMemo } from 'react';
import useClosePosition from '../../hooks/useClosePosition';
import useOpenOrders from '../../hooks/useOpenOrders';
import config from '../../config';
import './orders.css';

const Orders =() => {
  const { data: orders, isLoading, error, refetch } = useOpenOrders();
  //const { closePosition } = useClosePosition();
  const [sortDirection, setSortDirection] = useState('asc');
  const [refreshInterval, setRefreshInterval] = useState(null);

  useEffect(() => {
    const intervalId = setInterval(() => refetch(), 10000);
    setRefreshInterval(intervalId); 
    return () => clearInterval(intervalId); 
  }, []);

  /*
  const sortedPositions = useMemo(() => {
    if (!positions) {
      return null;
    }

    if (sortDirection === 'asc') {
      return [...positions].sort((a, b) => a.notional - b.notional);
    } else {
      return [...positions].sort((a, b) => b.notional - a.notional);
    }
  }, [positions, sortDirection]);

  const handleSort = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };*/

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
            <th style={{ width: '15%'}}>Symbol</th>
            <th style={{ width: '15%'}}>Type</th>
            <th style={{ width: '12%'}}>Side</th>
            <th style={{ width: '16%'}}>Price</th>
            <th style={{ width: '16%'}}>Amount</th>
            <th style={{ width: '16%'}}>Filled</th>
            <th style={{ width: '15%'}}>TriggerCond</th>
            <th style={{ width: '12%'}}>Cancel</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index} className='container' >
              <td style={{ width: '15%'}}>{order.symbol}</td>
              <td style={{ width: '15%'}}>{order.origType}</td>
              <td style={{ width: '12%'}}>{order.side === 'BUY' ? <div className="green-str">BUY</div> : <div className="red-str">SELL</div>}</td>
              <td style={{ width: '16%'}}>{(order.price).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</td>
              <td style={{ width: '16%'}}>{(order.stopPrice * order.origQty).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</td>
              <td style={{ width: '16%'}}>{(order.stopPrice * order.executedQty).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</td>
              <td style={{ width: '15%'}}>{order.stopPrice.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</td>
              <td style={{ width: '12%'}}>
                <button
                  className="close-button"
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
