import SymbolsDropdown from './SymbolsDropdown';
import useFutureSymbols from '../../hooks/useFutureSymbols';
import config from '../../config';

const Symbols = ({ onChange, selectedSymbol, onChangeAm }) => {
  const { data: futSymbols } = useFutureSymbols();

  const isCoinExistInFutureSymbols = selectedSymbol ? futSymbols.find(e => e.label === selectedSymbol.label) : '';
  const getLinkToBinanceFut = selectedSymbol ? config.binFutureLinkPRD + selectedSymbol.label.replace(/[^a-z0-9]/gi, '') : '';
  const getLinkToBinanceSpot = selectedSymbol ? config.binSpotLinkPRD + selectedSymbol.label.replace(/[/]/gi, '_') + '?theme=dark&type=spot' : '';
  const binLink = isCoinExistInFutureSymbols ? getLinkToBinanceFut : getLinkToBinanceSpot;


  return (
    <div className="blocco-symbols">
      <div className="selection-wrapper">
        <div className="selectionSy" id="symbol" name="symbol">
          {selectedSymbol ? selectedSymbol.label : 'BTC/USDT'}
        </div>
        <a
          role="button"
          style={!selectedSymbol ? { pointerEvents: 'none' } : null}
          href={binLink}
          target="_blank"
          className={`bin-link ${!selectedSymbol ? 'is-disable' : ''}`}
          rel="noreferrer"
        >
          <img 
            className='bin-logo'
            width={24} 
            height={24} 
            src="https://cdn.pixabay.com/photo/2021/04/30/16/47/binance-logo-6219389_1280.png" 
            alt="" 
          />
        </a>
      </div>
      <div className="basic">
        <SymbolsDropdown onChange={onChange} selected={selectedSymbol} />
      </div>
      <input 
        className="input-amount"
        type="number" 
        onChange={(event) => onChangeAm(event?.target?.value * 1000)} 
      />
    </div>
  );
};

export default Symbols;
