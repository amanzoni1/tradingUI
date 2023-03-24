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
        <p>  - Binance Future </p>
        <p>24h change: {tickerData.priceChange}/{tickerData.priceChangePercent}%</p>
        <p>24h volume(USDT): {tickerData.quoteVolume}</p>
        <p>Funding rate: {fundingRate}%</p>
        <p>Open interest: {openInterest}</p>
        <p>long/short ratio: {longShortRatio}</p>
        <p>Top trader long/short ratio: {topTLSRatio}</p>
      </div>
    );
  } else {
    if (!tickerData) {
    return <p>Loading ticker data...</p>;
    }
    return (
      <div className='box-ticker'>
        <p>  - Binance Spot </p>
        <p>24h change: {tickerData.priceChange}/{tickerData.priceChangePercent}%</p>
        <p>24h High: {tickerData.highPrice}</p>
        <p>24h Low: {tickerData.lowPrice}</p>
        <p>24h volume(USDT): {tickerData.quoteVolume}</p>
      </div>
    );
  }
};

export default Ticker;