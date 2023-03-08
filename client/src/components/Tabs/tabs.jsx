import { useState } from 'react';
import './tabs.css';
import Positions from '../Positions';
import Bags from '../Bags';


const tabNames = {
  Positions: 'Positions',
  Orders: 'Orders',
  Bags: 'Bags',
};

const Tabs = () => {
  const [tabName, setTabName] = useState('Positions');

  const handleTabChange = (event) => setTabName(event.target.value);

  return (
    <div className="tab">
      <button className='tab-button' value={tabNames.Positions} onClick={handleTabChange}>
        Positions
      </button>
      <button className='tab-button' value={tabNames.Orders} onClick={handleTabChange}>
        Orders
      </button>
      <button className='tab-button' value={tabNames.Bags} onClick={handleTabChange}>
        Bags
      </button>
      <div className="content">
        {tabName === tabNames.Positions && <Positions />}
        {tabName === tabNames.Orders && 'No open orders'}
        {tabName === tabNames.Bags && <Bags />}
      </div>
    </div>
  );
};

export default Tabs;
