import usePositions from './usePositions';


const useChartOrders = (selectedSymbol) => {
  const { data: positions } = usePositions();

  const start = selectedSymbol ? positions.find(e => e.symbol === selectedSymbol.label) : 'no';
  
  if (start === 'no') {
    return {}
  } else {
    if (positions.find(e => e.symbol === selectedSymbol.label)) {
      const positionLine = {
        price: positions.filter(e => e.symbol === selectedSymbol.label)[0]['entryPrice'],
		    color: positions.filter(e => e.symbol === selectedSymbol.label)[0]['side'] === 'long' ? 'rgb(14, 203, 129)' : 'rgb(246, 70, 93)',
        lineWidth: 1,
        lineStyle : 2,
		    axisLabelVisible: true,
      } 
      return { positionLine };
    } else {
      return {};
    }
  }
  
};

export default useChartOrders;