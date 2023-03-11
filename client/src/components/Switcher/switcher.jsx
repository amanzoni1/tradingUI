import React from 'react';
import './switcher.css';
import useTicker from '../../hooks/useTicker';


const options = {
  OneSec: '1s',
  OneMin: '1m',
  FifteenMin: '15m',
  OneHour: '1h',
  FourHour: '4h'
};

function Switcher(props) {
  const { interval, setInterval, selectedSymbol } = props;
  const { price } = useTicker(selectedSymbol);

  return (
    <>
      <div className="switcher">
        <div 
          className={`switcher-item ${interval === '1s' ? 'active' : ''}`} 
          onClick={() => setInterval(options.OneSec)}
        >
          1s
        </div>
        <div 
          className={`switcher-item ${interval === '1m' ? 'active' : ''}`} 
          onClick={() => setInterval(options.OneMin)}
        >
          1m
        </div>
        <div 
          className={`switcher-item ${interval === '15m' ? 'active' : ''}`} 
          onClick={() => setInterval(options.FifteenMin)}
        >
          15m
        </div>
        <div 
          className={`switcher-item ${interval === '1h' ? 'active' : ''}`} 
          onClick={() => setInterval(options.OneHour)}
        >
          1H
        </div>
        <div 
          className={`switcher-item ${interval === '4h' ? 'active' : ''}`} 
          onClick={() => setInterval(options.FourHour)}
        >
          4H
        </div>
      </div>
      <div className='legend'>
        { price }
      </div>
    </>
  );
}

export default Switcher;
