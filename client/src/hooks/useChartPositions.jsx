import { useState, useEffect, useMemo } from 'react';
import usePositions from './usePositions';


const useChartPositions = (selectedSymbol) => {
  const { data: positions } = usePositions();
  const [positionLine, setPositionLine] = useState({});


  useEffect(() => {
    if(selectedSymbol) {
      if (positions.find(e => e.symbol === selectedSymbol.label)) {
        const positionLine = {
          price: positions.filter(e => e.symbol === selectedSymbol.label)[0]['entryPrice'],
		      color: positions.filter(e => e.symbol === selectedSymbol.label)[0]['side'] === 'long' ? 'rgb(14, 203, 129)' : 'rgb(246, 70, 93)',
          lineWidth: 2,
          lineStyle : 0,
		      axisLabelVisible: true,
        } 
         setPositionLine({positionLine});
      } else {
        setPositionLine({});
      }
    }
  }, [selectedSymbol, positions]);


 return positionLine;
  
};

export default useChartPositions;
