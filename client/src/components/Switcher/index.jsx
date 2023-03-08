import React from 'react';

const options = {
  OneSec: '1s',
  OneMin: '1m',
};
function Switcher(props) {
  const { interval, setInterval } = props;

  return (
    <div className="switcher">
      <div className={`switcher-item ${interval === '1s' ? 'active' : 'switcher-item'}`} onClick={() => setInterval(options.OneSec)}>
        1s
      </div>
      <div className={`switcher-item ${interval === '1m' ? 'active' : ''}`} onClick={() => setInterval(options.OneMin)}>
        1m
      </div>
    </div>
  );
}

export default Switcher;
