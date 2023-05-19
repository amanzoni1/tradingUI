import React from 'react';
import useAccountInfo from '../../hooks/useAccountInfo';
import './accountInfo.css';


const AccountInfo = () => {
  const { marginBalance } = useAccountInfo();
  const futurePnl = 500;
  const total = Number(marginBalance) + futurePnl;

  return (
    <div className="box-info">
      <div className='acc-info'>
          <div className='acc-info-title'>
            <p className='p-acc'>Spot Balance:</p>
            <p className='p-acc'>Futures Margin Balance :</p>
            <p className='p-acc'>--Futures PNL:</p>
            <p className='p-accT'>Total:</p>
          </div>
          <div className='acc-info-value'>
            <p className='p-acc'>{(1000).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</p>
            <p className='p-acc'>{Number(marginBalance).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</p>
            <div>
              {futurePnl > 0 ? (
                <p className='acc-pc-green'>{(futurePnl).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</p>
              ) : (
                <p className='acc-pc-red'>{(futurePnl).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</p>
              )}
            </div>
            <p className='p-accT'>{(total).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</p>
          </div>
        </div>
    </div>
  );
};

export default AccountInfo;
