import React, { useState, useEffect, useMemo } from 'react';
import useSellBags from '../../hooks/useSellBags';
import useBags from '../../hooks/useBags';
import config from '../../config';
import './bags.css';

const Bags =() => {
  const { data: bags, isLoading, error, refetch } = useBags();
  const { sellBags } = useSellBags();
  const [sortDirection, setSortDirection] = useState('asc');
  const [refreshInterval, setRefreshInterval] = useState(null);

  useEffect(() => {
    const intervalId = setInterval(() => refetch(), 1000);
    setRefreshInterval(intervalId); 
    return () => clearInterval(intervalId); 
  }, []);

  const sortedBag = useMemo(() => {
    if (!bags) {
      return null;
    }

    if (sortDirection === 'asc') {
      return [...bags].sort((a, b) => a.notional - b.notional);
    } else {
      return [...bags].sort((a, b) => b.notional - a.notional);
    }
  }, [bags, sortDirection]);

  const handleSort = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (sortedBag?.length === 0) {
    return <p className='p-pos'>No Open Bags</p>;
  }

  return (
    <div className='tableWrapper'>
      {bags ? ( 
      <table className='pos-table'>
        <thead className='header'>
          <tr className='ordini'>
            <th style={{ width: '20%'}}>Symbol</th>
            <th onClick={handleSort} style={{ width: '20%'}} className='dir-button' >Quantity</th>
            <th style={{ width: '20%'}}>Value</th>
            <th style={{ width: '25%'}}>Reduce</th>
            <th style={{ width: '15%'}}>Close</th>
          </tr>
        </thead>
        <tbody>
          {bags.map((bag, index) => (
            <tr key={index} className='container' >
              <td style={{ width: '20%'}}>{bag.coin}</td>
              <td style={{ width: '20%'}}>{bag.quantity}</td>
              <td style={{ width: '20%'}}>{Number(bag.value).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</td>
              <td style={{ width: '25%'}} className="reduce-container">
                      <button
                        className="reduce-button"
                        onClick={() => sellBags(bag.coin, bag.quantity, config.smallReduce)}
                      >
                        20
                      </button>
                      <button
                        className="reduce-button"
                        onClick={() => sellBags(bag.coin, bag.quantity, config.midReduce)}
                      >
                        33
                      </button>
                      <button
                        className="reduce-button"
                        onClick={() => sellBags(bag.coin, bag.quantity, config.bigReduce)}
                      >
                        50
                      </button>
                    </td>
                    <td style={{ width: '20%'}}>
                    <button
                      className="close-button"
                      onClick={() => sellBags(bag.coin, bag.quantity)}
                    >
                      X
                    </button>
                    </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>No Open Bags</p>
    )}
    </div>
  );
}

export default Bags;
