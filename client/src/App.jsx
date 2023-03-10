import { useState } from 'react';
import { SWRConfig } from 'swr';

import config from './config';
import Symbols from './components/Symbols';
import OrderType from './components/OrderType';
import Amount from './components/Amount';
import Tabs from './components/Tabs/tabs';
import CreateOrder from './components/CreateOrder';
import TradingPair from './components/TradingPair/TradingPair';
import ChartComponent from './components/Chart/chart';
import BoxTicker from './components/BoxTicker/boxTicker';
import AccountInfo from './components/AccountInfo/accountInfo';

import './App.css';

const App = () => {
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [orderType, setOrderType] = useState(null);
  const [amount, setAmount] = useState(null);

  return (
    <SWRConfig value={config.swr}>
      <div className="App">
        <h1 className="app-title"> MENU </h1>

        <div className='mainview'>
          <div className='optionside'>
            <AccountInfo />
            <div className='options-tab'>
              <div className="contenitore-top">
                <Symbols onChange={setSelectedSymbol} selectedSymbol={selectedSymbol} onChangeAm={setAmount} />
                <TradingPair selectSymbol={setSelectedSymbol}/>
              </div>
              <div className="contenitore">
                <Amount amount={amount} onChange={setAmount} />
                <OrderType type={orderType} onChange={setOrderType} />
              </div>
              <CreateOrder selectedSymbol={selectedSymbol} orderType={orderType} amount={amount} />
            </div>
          </div>
          <div className='graphside'>
            <div className='main-graph-component'>
              <ChartComponent selectedSymbol={selectedSymbol}></ChartComponent>
            </div>
          </div>
        </div>
        
        <div className='second-line-big-view'>
          <Tabs />
          <BoxTicker />
        </div>
      </div>
    </SWRConfig>
  );
};

export default App;
