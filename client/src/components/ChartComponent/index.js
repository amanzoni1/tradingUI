import { createChart, ColorType } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';

export const ChartComponent = (props) => {
  const {
    data,
    colors: {
      backgroundColor = 'linear-gradient(to left, rgb(0, 0, 0) 0%, rgb(28, 28, 28) 100%)',
      lineColor = '#2962FF',
      textColor = 'rgb(61, 61, 61)',
      areaTopColor = 'rgba(255,255,255,0)',
      areaBottomColor = 'rgba(255,255,255,0)',
    } = {},
  } = props;

  const chartContainerRef = useRef();

  useEffect(() => {
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      width: chartContainerRef.current.clientWidth,
      height: 300,
    });
    chart.timeScale().fitContent();

    const newSeries = chart.addCandlestickSeries();
    newSeries.setData(data);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);

      chart.remove();
    };
  }, [data, lineColor, textColor, areaTopColor, areaBottomColor, backgroundColor]);

  return <div ref={chartContainerRef} />;
};
