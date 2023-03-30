
const Amount = ({ amount, onChange }) => {

  return (
    <div className="blocco amount">
      <div className="selection"> {amount ? amount.toLocaleString('en-US', {style: 'currency', currency: 'USD'}) : 'amount'} </div>

      <div className="option-amount">
        <button className="button-opt" onClick={() => onChange(25000)}>
          25000
        </button>
        <button className="button-opt" onClick={() => onChange(35000)}>
          35000
        </button>
      </div>
      <div className="option-amount">
        <button className="button-opt" onClick={() => onChange(50000)}>
          50000
        </button>
        <button className="button-opt" onClick={() => onChange(80000)}>
          80000
        </button>
      </div>
    </div>
  );
};

export default Amount;
