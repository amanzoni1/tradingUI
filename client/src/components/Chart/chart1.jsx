import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import useChartHistory from '../../hooks/useChartHystory';
import useChartUpdates from '../../hooks/useChartUpdates';
import useChartPositions from '../../hooks/useChartPositions';
import Switcher from '../Switcher/switcher';
import './chart.css';


const ChartComponent = (props) => {
  const { selectedSymbol } = props;
  const chartContainerRef = useRef(null);
  const candlestickSeries = useRef(null);
  const lineSeries = useRef(null);
  const volumeSeries = useRef(null);
  const [interval, setInterval] = useState('1m');
  const { chartData } = useChartHistory(selectedSymbol, interval);
  const { line, candle, volume } = useChartUpdates(selectedSymbol, interval);
  const  { positionLine } = useChartPositions(selectedSymbol);
  const [chart, setChart] = useState(null);

  const newChartDataCandle = () => {
    return chartData.map((cart) => ({ time: cart[0] / 1000 + 3600, open: Number(cart[1]), high: Number(cart[2]), low: Number(cart[3]), close: Number(cart[4]) }));
  };
  const newVolData = () => {
    return chartData.map((cart) => ({ time: cart[0] / 1000 + 3600, value: Number(cart[7]) }));
  };
  const newChartData = () => {
    return chartData.map((cart) => ({ time: cart[0] / 1000 + 3600, value: Number(cart[4]) }));
  };

  useEffect(() => {
    if (!chartData || !chartData[0]) {
      return;
    }
    const newChart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: 'solid', color: 'transparent' },
        textColor: '#808080',
        lineColor: '#29f1ff',
      },
      grid: {
        vertLines: {
          color: 'rgba(42, 46, 57, 0.5)',
         },
        horzLines: {
          color: 'rgba(42, 46, 57, 0.5)',
        },
      },
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: {
          top: 0.2,
          bottom: 0.2,
        },
      },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
        secondsVisible: true,
        rightBarStaysOnScroll: true,
        fixLeftEdge: true,
      },
      crosshair: {
        mode: 0,
        vertLine: {
            labelBackgroundColor: 'rgb(29, 29, 29)',
        },
        horzLine: {
            labelBackgroundColor: 'rgb(29, 29, 29)',
        },
      },
      width: chartContainerRef.current.clientWidth,
      height: 516,
    });
    if (interval === '1s') {
      const newLineSeries = newChart.addAreaSeries({
        lineColor: '#29f1ff',
        topColor: '#29f1ff',
        bottomColor: 'rgba(7, 7, 7, 0.08)',
        lineWidth: 1,
      });
      const newVolumeSeries = newChart.addHistogramSeries({
        color: 'rgb(69, 69, 69)',
        lineWidth: 2,
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: '',
      });

      lineSeries.current = newLineSeries;
      volumeSeries.current = newVolumeSeries;

      const data = newChartData();
      newLineSeries.setData(data);
      const volData = newVolData();
      newVolumeSeries.setData(volData);

      setChart(newChart);

      newLineSeries.applyOptions({
        priceFormat: {
          precision: data[0].value >= 100 ? 2
                  : data[0].value >= 10 ? 3  
                  : data[0].value >= 1 ? 4
                  : data[0].value >= 0.1 ? 5 
                  : 6,
          minMove: data[0].value >= 100 ? 0.01 
                  : data[0].value >= 10 ? 0.001
                  : data[0].value >= 1 ? 0.0001
                  : data[0].value >= 0.1 ? 0.00001 
                  : 0.000001,
        },
        priceLineVisible: false,
        crosshairMarkerVisible: false,
      });
      newVolumeSeries.priceScale().applyOptions({
        scaleMargins: {
          top: 0.82, 
          bottom: 0,
        },
      });
    } else {
      const newCandlestickSeries = newChart.addCandlestickSeries({
        upColor: '#29f1ff',
        downColor: '#808080',
        wickUpColor: '#29f1ff',
        wickDownColor: '#808080',
        borderUpColor: '#29f1ff',
        borderDownColor: '#808080',
      });
      const newVolumeSeries = newChart.addHistogramSeries({
        color: 'rgb(69, 69, 69)',
        lineWidth: 2,
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: '',
      });
    
      candlestickSeries.current = newCandlestickSeries;
      volumeSeries.current = newVolumeSeries;

      const data = newChartDataCandle();
      newCandlestickSeries.setData(data);
      const volData = newVolData();
      newVolumeSeries.setData(volData);

      setChart(newChart);

      newCandlestickSeries.applyOptions({
        priceFormat: {
          precision: data[0].open >= 100 ? 2
                  : data[0].open >= 10 ? 3  
                  : data[0].open >= 1 ? 4
                  : data[0].open >= 0.1 ? 5 
                  : 6,
          minMove: data[0].open >= 100 ? 0.01 
                  : data[0].open >= 10 ? 0.001
                  : data[0].open >= 1 ? 0.0001
                  : data[0].open >= 0.1 ? 0.00001 
                  : 0.000001,
        },
        priceLineVisible: false,
        crosshairMarkerVisible: false,
      });
      newVolumeSeries.priceScale().applyOptions({
        scaleMargins: {
          top: 0.82, 
          bottom: 0,
        },
      });
    }
    
    const handleResize = () => {
      newChart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    newChart.timeScale();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      newChart.remove();
    };
  }, [chartData]);

  useEffect(() => {
    if (candlestickSeries.current && candle) {
      candlestickSeries.current.update(candle);
      volumeSeries.current.update(volume);
    }
  }, [candle]);

  useEffect(() => {
    if (lineSeries.current && line) {
      lineSeries.current.update(line);
      volumeSeries.current.update(volume);
    }
  }, [line]);

  useEffect(() => {
    if(candlestickSeries.current && positionLine) {
     candlestickSeries.current.createPriceLine(positionLine);
    }
  }, [chartData]);


  return (
    <>
      <div className='main-graph-component'>
        <Switcher interval={interval || '1s'} setInterval={setInterval} selectedSymbol={selectedSymbol} />
        <div ref={chartContainerRef} className="tv-lightweight-charts"/>
        <div className="tv-lightweight-charts-volume" />
      </div>
    </>
  );
}


export default ChartComponent;