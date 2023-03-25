import React from 'react';
import useBoxTicker from '../../hooks/useBoxTicker';
import useFutureSymbols from '../../hooks/useFutureSymbols';
import './boxTicker.css';

const Ticker = ({ selectedSymbol }) => {
  const { tickerData, fundingRate, openInterest, topTLSRatio, longShortRatio } = useBoxTicker(selectedSymbol);
  const { data: futSymbols } = useFutureSymbols();

  const isCoinExistInFutureSymbols = selectedSymbol ? futSymbols.find(e => e.label === selectedSymbol.label) : '';
  const binApi = !selectedSymbol ? 'future' : isCoinExistInFutureSymbols ? 'future' : 'spot';

  if (binApi === 'future') {
    if (!tickerData || !fundingRate || !openInterest|| !topTLSRatio|| !longShortRatio) {
      return <p>Loading ticker data...</p>;
    }
    return (
      <div className='box-ticker'>
        <div className='bt-title'>
          <p className='bt-coin'>{selectedSymbol?.label}</p> <p className='bt-mark'>Future</p>
        </div>
        <div className='bt-info'>
          <div className='bt-info-title'>
            <p>Open interest:</p>
            <p>Funding rate:</p>
            <p>24h change:</p>
            <p>24h volume(USDT):</p>
            <p>Long/Short ratio:</p>
            <p>TopTrader l/s ratio:</p>
          </div>
          <div className='bt-info-value'>
            <p>{openInterest}</p>
            <p className='bt-fr'>{fundingRate*100}%</p>
            <div>
              {tickerData.priceChange > 0 ? (
                <p className='bt-pc-green'>{tickerData.priceChange} / {tickerData.priceChangePercent}%</p>
              ) : (
                <p className='bt-pc-red'>{tickerData.priceChange} / {tickerData.priceChangePercent}%</p>
              )}
            </div>
            <p>{tickerData.quoteVolume}</p>
            <p>{longShortRatio}</p>
            <p>{topTLSRatio}</p>      
          </div>
        </div>
      </div>
    );
  } else {
    if (!tickerData) {
    return <p>Loading ticker data...</p>;
    }
    return (
      <div className='box-ticker'>
        <div className='bt-title'>
          <p className='bt-coin'>{selectedSymbol?.label}</p> <p className='bt-mark'>Spot</p>
        </div>
        <div className='bt-info'>
          <div className='bt-info-title-spot'>
            <p>24h change:</p>
            <p>24h High:</p>
            <p>24h Low:</p>
            <p>24h volume(USDT):</p>
          </div>
          <div className='bt-info-value-spot'>
            <div>
              {tickerData.priceChange > 0 ? (
                <p className='bt-pc-green'>{tickerData.priceChange} / {tickerData.priceChangePercent}%</p>
              ) : (
                <p className='bt-pc-red'>{tickerData.priceChange} / {tickerData.priceChangePercent}%</p>
              )}
            </div>
            <p>{tickerData.highPrice}</p>
            <p>{tickerData.lowPrice}</p>
            <p>{tickerData.quoteVolume}</p>      
          </div>
        </div>
      </div>
    );
  }
};

export default Ticker;