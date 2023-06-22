import React from 'react';
import './switcher.css';
import useTicker from '../../hooks/useTicker';


const options = {
  OneSec: '1s',
  OneMin: '1m',
  FiveMin: '5m',
  FifteenMin: '15m',
  ThirtyMin: '30m',
  OneHour: '1h',
  FourHour: '4h',
  OneDay: '1d',
  OneWeek: '1w',
  OneMonth: '1M',
};

function Switcher(props) {
  const { interval, setInterval, selectedSymbol } = props;
  const { price } = useTicker(selectedSymbol);

  return (
    <>
      <div className="switcher">
        <div className="switcher-row">
          {['1s', '1m', '5m', '15m', '30m'].map(time => (
            <div 
              className={`switcher-item ${interval === time ? 'active' : ''}`} 
              onClick={() => setInterval(time)}
            >
              {time}
            </div>
          ))}
        </div>
        <div className="switcher-row">
          {['1h', '4h', '1d', '1w', '1M'].map(time => (
            <div 
              className={`switcher-item ${interval === time ? 'active' : ''}`} 
              onClick={() => setInterval(time)}
            >
              {time}
            </div>
          ))}
        </div>
      </div>
      <div className='legend'>
        { price }
      </div>
    </>
  );
}

export default Switcher;
