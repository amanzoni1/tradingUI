import React, { useState, useEffect, useMemo } from 'react';
import useClosePosition from '../../hooks/useClosePosition';
import usePositions from '../../hooks/usePositions';
import config from '../../config';
import './positions.css';

const Positions =() => {
  const { data: positions, isLoading, error, refetch } = usePositions();
  const { closePosition } = useClosePosition();
  const [sortDirection, setSortDirection] = useState('asc');
  const [refreshInterval, setRefreshInterval] = useState(null);

  useEffect(() => {
    const intervalId = setInterval(() => refetch(), 1000);
    setRefreshInterval(intervalId); 
    return () => clearInterval(intervalId); 
  }, []);

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
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (sortedPositions?.length === 0) {
    return <p className='p-pos'>No Open Positions</p>;
  }

  return (
    <div className='tableWrapper'>
      {positions ? ( 
      <table className='pos-table'>
        <thead className='header'>
          <tr className='ordini'>
            <th style={{ width: '3%'}}>Side</th>
            <th style={{ width: '15%'}}>Symbol</th>
            <th onClick={handleSort} style={{ width: '15%'}} className='dir-button' >Size</th>
            <th style={{ width: '20%'}}>Entry price</th>
            <th style={{ width: '20%'}}>PNL</th>
            <th style={{ width: '16%'}}>Reduce</th>
            <th style={{ width: '15%'}}>Close</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((position, index) => (
            <tr key={index} className='container' >
              <td style={{ width: '3%'}}> {position.side === 'long' ? <div className="green-circle" /> : <div className="red-circle" />}</td>
              <td style={{ width: '15%'}}>{position.symbol}</td>
              <td style={{ width: '15%'}}>{position.notional.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</td>
              <td style={{ width: '20%'}}>{position.entryPrice}</td>
              <td style={{ width: '20%'}}>
                {position.unrealizedPnl > 0 ? ( 
                  <p className="pnl-green">
                    {position.unrealizedPnl.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}
                    ({(position.percentage / position.leverage).toFixed(2)}%)
                  </p>
                ) : (  
                  <p className="pnl-red">
                    {position.unrealizedPnl.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}
                    ({(position.percentage / position.leverage).toFixed(2)}%)
                  </p>
                )}
              </td>
              <td style={{ width: '16%'}} className="reduce-container">
                      <button
                        className="reduce-button"
                        onClick={() => closePosition(position.symbol, position.side, position.contracts, config.smallReduce)}
                      >
                        20
                      </button>
                      <button
                        className="reduce-button"
                        onClick={() => closePosition(position.symbol, position.side, position.contracts, config.midReduce)}
                      >
                        33
                      </button>
                      <button
                        className="reduce-button"
                        onClick={() => closePosition(position.symbol, position.side, position.contracts, config.bigReduce)}
                      >
                        50
                      </button>
                    </td>
                    <td style={{ width: '15%'}}>
                    <button
                      className="close-button"
                      onClick={() => closePosition(position.symbol, position.side, position.contracts)}
                    >
                      X
                    </button>
                    </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>No open positions</p>
    )}
    </div>
  );
}

export default Positions;
