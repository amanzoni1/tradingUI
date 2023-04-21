import { useState, useEffect } from 'react';
import usePositions from './usePositions';


const useChartPositions = (selectedSymbol) => {
  const { data: positions } = usePositions();
  const [positionLine, setPositionLine] = useState({});

  const symbol = selectedSymbol?.label.replace(/\//g, '');


  useEffect(() => {
    if(selectedSymbol) {
      const positionN = positions.find(e => e.symbol === symbol)
      if (positionN) {
        const positionLine = {
          price: Number(positionN['entryPrice']),
		      color: Number(positionN['positionAmt']) > 0 ? 'rgb(14, 203, 129)' : 'rgb(246, 70, 93)',
          lineWidth: 2,
          lineStyle : 0,
		      axisLabelVisible: true,
        } 
         setPositionLine({positionLine});
      } else {
        setPositionLine({});
      }
    } else {
      setPositionLine({});
    }
  }, [selectedSymbol, positions]);


 return positionLine;
  
};

export default useChartPositions;
