import { useState } from 'react';
import './tabs.css';
import Positions from '../Positions';
import Bags from '../Bags';
import usePosition from '../../hooks/usePositions';
import useBags from '../../hooks/useBags';

const tabNames = {
  Positions: 'Positions',
  Orders: 'Orders',
  Bags: 'Bags',
};

const Tabs = () => {
  const [tabName, setTabName] = useState('Positions');
  const { data: positions } = usePosition();
  const { data: bags } = useBags();

  const handleTabChange = (event) => setTabName(event.target.value);

  return (
    <div className="tab">
      <button 
        className={`tab-button ${tabName === tabNames.Positions ? 'active1' : ''}`}
        value={tabNames.Positions} 
        onClick={handleTabChange}
      >
        Positions ({positions?.length})
      </button>
      <button 
        className={`tab-button ${tabName === tabNames.Orders ? 'active1' : ''}`}
        value={tabNames.Orders} 
        onClick={handleTabChange}
      >
        Orders (0)
      </button>
      <button 
        className={`tab-button ${tabName === tabNames.Bags ? 'active1' : ''}`}
        value={tabNames.Bags} 
        onClick={handleTabChange}
      >
        Bags ({bags?.length})
      </button>
      <div className="content">
        {tabName === tabNames.Positions && <Positions />}
        {tabName === tabNames.Orders && 'No Open Orders'}
        {tabName === tabNames.Bags && <Bags />}
      </div>
    </div>
  );
};

export default Tabs;
