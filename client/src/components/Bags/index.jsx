import { useEffect } from 'react';
import useSellBags from '../../hooks/useSellBags';
import useBags from '../../hooks/useBags';
import config from '../../config';

const Bags = () => {
  const { data: bags, isLoading, refetch, mutate } = useBags();
  const { sellBags } = useSellBags();

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 1000);

    return () => clearInterval(interval);
  }, [mutate]);  
  
  return (
    <>
      <div className="list-wrapper">
        {!isLoading ? (
          <>
            {bags.length > 0 ? (
              <>
                <div className="ordini">
                  <div>Entry Price</div>
                  <div>Symbol</div>
                  <div>Quantity</div>
                  <div>Value</div>
                  <div>PNL</div>
                  <div>Reduce</div>
                  <div>Close</div>
                </div>
                {bags.map((bag, index) => {
                  return (
                    <div key={index} className="container">
                      <p> img </p>
                      <p>{bag.coin}</p>
                      <p>{bag.quantity}</p>
                      <p>{Number(bag.value).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</p>
                      <div>eventual pnl</div>
                      <div className="reduce-container">
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
                      </div>
                      <button
                        className="close-button"
                        onClick={() => sellBags(bag.coin, bag.quantity)}
                      >
                        X
                      </button>
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="no-positions">No Open Bags</div>
            )}
          </>
        ) : null}
      </div>
    </>
  );
};

export default Bags;
