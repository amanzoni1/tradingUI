import usePosition from '../../hooks/usePositions';
import useClosePosition from '../../hooks/useClosePosition';
import config from '../../config';
import { ChartComponent } from '../ChartComponent';
import useSocketSymbols from '../../hooks/useSocketSymbols';

const Positions = (props) => {
  const { data: positions, isLoading, refetch } = usePosition();
  const { closePosition } = useClosePosition();
  const { trade } = useSocketSymbols();

  console.log("Trade", trade[4])

  const current = new Date();
  const date = `0${current.getDate()}/0${current.getMonth()+1}/${current.getFullYear()}`;
  console.log("date: ", date)

  const date1 = `0${current.getDate() + 1}/0${current.getMonth()+1}/${current.getFullYear()}`;
  console.log("date: ", date1)

  const date2 = `${current.getDate() + 2}/0${current.getMonth()+1}/${current.getFullYear()}`;
  console.log("date: ", date2)

  const date3 = `0${current.getDate() - 1}/0${current.getMonth()+1}/${current.getFullYear()}`;
  console.log("date: ", date3)

  const date4 = `0${current.getDate() - 2}/0${current.getMonth()+1}/${current.getFullYear()}`;
  console.log("date: ", date4)

  const date5 = `0${current.getDate() - 3}/0${current.getMonth()+1}/${current.getFullYear()}`;
  console.log("date: ", date5)

  const date6 = `0${current.getDate() - 4}/0${current.getMonth()+1}/${current.getFullYear()}`;
  console.log("date: ", date6)

  const date7 = `0${current.getDate() - 5}/0${current.getMonth()+1}/${current.getFullYear()}`;
  console.log("date: ", date7)

  const date8 = `0${current.getDate() - 6}/0${current.getMonth()+1}/${current.getFullYear()}`;
  console.log("date: ", date8)

  const date9 = `0${current.getDate() - 7}/0${current.getMonth()+1}/${current.getFullYear()}`;
  console.log("date: ", date9)

  const initialData = [
    {
      time: `${date9}`,
      open: `${trade[0]}`,
      high: `${trade[1]}`,
      low: `${trade[2]}`,
      close: `${trade[3]}`,
    },
    {
      time: `${date8}`,
      open: `${trade[0]}`,
      high: `${trade[1]}`,
      low: `${trade[2]}`,
      close: `${trade[3]}`,
    },
    {
      time: `${date7}`,
      open: `${trade[0]}`,
      high: `${trade[1]}`,
      low: `${trade[2]}`,
      close: `${trade[3]}`,
    },
    {
      time: `${date6}`,
      open: `${trade[0]}`,
      high: `${trade[1]}`,
      low: `${trade[2]}`,
      close: `${trade[3]}`,
    },
    {
      time: `${date5}`,
      open: `${trade[0]}`,
      high: `${trade[1]}`,
      low: `${trade[2]}`,
      close: `${trade[3]}`,
    },
    {
      time: `${date4}`,
      open: `${trade[0]}`,
      high: `${trade[1]}`,
      low: `${trade[2]}`,
      close: `${trade[3]}`,
    },
    {
      time: `${date3}`,
      open: `${trade[0]}`,
      high: `${trade[1]}`,
      low: `${trade[2]}`,
      close: `${trade[3]}`,
    },
    {
      time: `${date}`,
      open: `${trade[0]}`,
      high: `${trade[1]}`,
      low: `${trade[2]}`,
      close: `${trade[3]}`,
    },
    {
      time: `${date1}`,
      open: `${trade[0]}`,
      high: `${trade[1]}`,
      low: `${trade[2]}`,
      close: `${trade[3]}`,
    },
    {
      time: `${date2}`,
      open: `${trade[0]}`,
      high: `${trade[1]}`,
      low: `${trade[2]}`,
      close: `${trade[3]}`,
    },
  ];

  const results = [];

  initialData.forEach((initialDatas) =>{
    results.push(
        initialDatas
    );
  })



  return (
    <>
      <button className="refetch-button" onClick={() => refetch()}>
        &#8634;
      </button>
      <div className="list-wrapper">
        {!isLoading ? (
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
              console.log(position, 'in arr');
              return (
                <div key={index} className="container">
                  <div>
                    {position.side === 'long' ? <div className="green-circle" /> : <div className="red-circle" />}
                  </div>
                  <p>{position.symbol}</p>
                  <p>{position.notional.toFixed(0)}</p>
                  <p>{position.entryPrice.toFixed(2)}</p>
                  <div>
                    {position.unrealizedPnl > 0 ? (
                      <p className="pnl-green">
                        {position.unrealizedPnl.toFixed(2)}$ ({(position.percentage / position.leverage).toFixed(2)}%)
                      </p>
                    ) : (
                      <p className="pnl-red">
                        {position.unrealizedPnl.toFixed(2)}$ ({(position.percentage / position.leverage).toFixed(2)}%)
                      </p>
                    )}
                  </div>
                  <div className="reduce-container">
                    <button
                      className="reduce-button"
                      onClick={() =>
                        closePosition(position.symbol, position.side, position.contracts, config.smallReduce)
                      }
                    >
                      20
                    </button>
                    <button
                      className="reduce-button"
                      onClick={() =>
                        closePosition(position.symbol, position.side, position.contracts, config.midReduce)
                      }
                    >
                      33
                    </button>
                    <button
                      className="reduce-button"
                      onClick={() =>
                        closePosition(position.symbol, position.side, position.contracts, config.bigReduce)
                      }
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
            <ChartComponent {...props} data={results}/>
          </>
        ) : null}
      </div>
    </>
  );
};

export default Positions;
