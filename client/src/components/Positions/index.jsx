import { useEffect } from 'react';
import '../../App.css';

import useClosePosition from '../../hooks/useClosePosition';
import usePosition from '../../hooks/usePositions';
import config from '../../config';

const Positions = () => {
  const { data: positions, isLoading, refetch } = usePosition();
  const { closePosition } = useClosePosition();

  useEffect(() => {
    setTimeout(() => {
      if (positions?.length > 0) {
        refetch();
      }
    }, 1000);
  }, [positions]);

  return (
    <>
      <div className="list-wrapper">
      {!isLoading ? (
        <>
          {positions?.length > 0 ? (
            <>
              <div className="ordini">
                <div>Side</div>
                <div>Symbol</div>
                <div>Size</div>
                <div>Entry Price</div>
                <div>PNL</div>
                <div>Reduce</div>
                <div>Close</div>
              </div>
              {positions.map((position, index) => {
                //console.log(position, 'in arr');
                return (
                  <div key={index} className="container">
                    <div>
                      {position.side === 'long' ? <div className="green-circle" /> : <div className="red-circle" />}
                    </div>
                  <p>{position.symbol}</p>
                  <p>{position.notional.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</p>
                  <p>{position.entryPrice.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</p>
                  <div>
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
                    </div>
                    <div className="reduce-container">
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
                    </div>
                    <button
                      className="close-button"
                      onClick={() => closePosition(position.symbol, position.side, position.contracts)}
                    >
                      X
                    </button>
                  </div>
                );
              })}
            </>
          ) : (
            <div className="no-positions">No Open Positions</div>
          )}
        </>
      ) : null}
      </div>
    </>
  );
};

export default Positions;
