import { useState } from 'react';
import './tabs.css';
import Positions from '../Positions/positions';
import Bags from '../Bags';
import usePositions from '../../hooks/usePositions';
import useBags from '../../hooks/useBags';
import ReLoader from '../ReLoader';

const tabNames = {
  Positions: 'Positions',
  Orders: 'Orders',
  Bags: 'Bags',
};

const Tabs = () => {
  const [tabName, setTabName] = useState('Positions');
  const { data: positions } = usePositions();
  const { data: bags } = useBags();

  const handleTabChange = (event) => setTabName(event.target.value);

  return (
    <div className="tab">
      <div className='container-leg'>
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
        <ReLoader />
      </div>
      <div className="content">
        {tabName === tabNames.Positions && <Positions />}
        {tabName === tabNames.Orders && <p>No Open Orders</p>}
        {tabName === tabNames.Bags && <Bags />}
      </div>
    </div>
  );
};

export default Tabs;
