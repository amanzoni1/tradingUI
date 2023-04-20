import React, { useState, useEffect, useMemo } from 'react';
import useClosePosition from '../../hooks/useClosePosition';
import usePositions from '../../hooks/usePositions';
import config from '../../config';
import './positions.css';




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



const Positions =() => {
  const { data: positions, isLoading, error, refetch } = usePositions();
  const { closePosition } = useClosePosition();
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortBy, setSortBy] = useState('notional');
  const [refreshInterval, setRefreshInterval] = useState(null);


  useEffect(() => {
    const intervalId = setInterval(() => refetch(), 1000);
    setRefreshInterval(intervalId); 
    return () => clearInterval(intervalId); 
  }, []);


  const getValueByIdentifier = (position, identifier) => {
    if (identifier === 'positionValue') {
      return Math.abs(position.positionAmt * position.markPrice);
    }
    return position[identifier];
  };

  const sortedPositions = useMemo(() => {
    if (!positions) {
      return null;
    }

    return [...positions].sort((a, b) => {
      const valueA = getValueByIdentifier(a, sortBy);
      const valueB = getValueByIdentifier(b, sortBy);
      return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
    });
  }, [positions, sortBy, sortDirection]);


  const handleSort = (sortingKey) => {
    if (sortingKey === sortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(sortingKey);
      setSortDirection('asc');
    }
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
            <th style={{ width: '17%'}}>Symbol</th>
            <th style={{ width: '16%'}} onClick={() => handleSort('positionValue')} className='dir-button'>Size</th>
            <th style={{ width: '13%'}}>EntryPrice</th>
            <th style={{ width: '13%'}}>MarkPrice</th>
            <th style={{ width: '13%'}}>LiqPrice</th>
            <th style={{ width: '18%'}} onClick={() => handleSort('unRealizedProfit')} className='dir-button'>PNL</th>
            <th style={{ width: '11%'}}>Reduce</th>
            <th style={{ width: '7%'}}>Close</th>
          </tr>
        </thead>
        <tbody>
          {sortedPositions.map((position, index) => (
            <tr key={index} className='container' >
              <td style={{ width: '17%'}}>
                <div style={{ display: 'flex', alignItems: 'center' }} >
                  {position.positionAmt > 0 ? <div className="green-circle" /> : <div className="red-circle" />}
                  <span style={{ marginRight: '4px' }}>{position.symbol}</span>
                  <span className='leverage'>{position.leverage}x</span>
              </div>
              </td>
              <td
                className={position.positionAmt * position.markPrice > 0 ? 'green-text' : 'red-text'}
                style={{ width: '16%' }}
              >
                {(position.positionAmt * position.markPrice).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </td>
              <td style={{ width: '13%', fontSize: '12px'}}>{dynamicToFixed(parseFloat(position.entryPrice))}</td>
              <td style={{ width: '13%', fontSize: '12px'}}>{dynamicToFixed(parseFloat(position.markPrice))}</td>
              <td className='liqui' style={{ width: '13%'}}>{dynamicToFixed(parseFloat(position.liquidationPrice))}</td>
              <td style={{ width: '18%'}}>
                {position.unRealizedProfit > 0 ? ( 
                  <p className="pnl-green">
                    {parseFloat(position.unRealizedProfit).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}
                    ({parseFloat((position.unRealizedProfit / (Math.abs(position.positionAmt * position.markPrice)) * 100).toFixed(2))}%)
                  </p>
                ) : (  
                  <p className="pnl-red">
                    {parseFloat(position.unRealizedProfit).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}
                    ({parseFloat((position.unRealizedProfit / (Math.abs(position.positionAmt * position.markPrice)) * 100).toFixed(2))}%)
                  </p>
                )}
              </td>
              <td style={{ width: '11%'}} className="reduce-container">
                      <button
                        className="reduce-button"
                        onClick={() => closePosition(position.symbol, position.positionAmt, config.smallReduce)}
                      >
                        20
                      </button>
                      <button
                        className="reduce-button"
                        onClick={() => closePosition(position.symbol, position.positionAmt, config.midReduce)}
                      >
                        33
                      </button>
                      <button
                        className="reduce-button"
                        onClick={() => closePosition(position.symbol, position.positionAmt, config.bigReduce)}
                      >
                        50
                      </button>
                    </td>
                    <td style={{ width: '7%'}}>
                    <button
                      className="close-button"
                      onClick={() => closePosition(position.symbol, position.positionAmt)}
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
