import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import useChartHistory from '../../hooks/useChartHystory';
import useChartUpdates from '../../hooks/useChartUpdates';
import Switcher from '../Switcher/switcher';
import './chart.css'

const ChartComponent = (props) => {
	const {
		colors: {
			background = { type: 'solid', color: 'transparent' },
			lineColor = '#29f1ff',
      upColor = '#29f1ff',
      downColor = '#808080',
      wickUpColor = '#29f1ff',
      wickDownColor = '#808080',
      borderUpColor = '#29f1ff',
      borderDownColor = '#808080',
			textColor = '#808080',
			areaTopColor = '#29f1ff',
			areaBottomColor = 'rgba(7, 7, 7, 0.08)',
		} = {},
		selectedSymbol,
	} = props;

	const chartContainerRef = useRef();
  const [interval, setInterval] = useState('1m');
  const { chartData } = useChartHistory(selectedSymbol, interval);
  const { line, candle, volume } = useChartUpdates(selectedSymbol, interval);
  const [results, setResults] = useState([]);
  const [volResult, setVolResult] = useState([]);
  const [chartInstance, setChartInstance] = useState({});
  const [chartInitialize, setChartInitialize] = useState({});

  
	useEffect(() => {
    if (interval === '1s') {
      if (!line?.time) {
        return;
      }
      chartInstance.update(line);
      setResults((prevState) => {
        prevState[prevState.length - 1] = line;
        return [...prevState];
      });
    } else {
      if (!candle?.time) {
        return;
      }
      chartInstance.update(candle);
      setResults((prevState) => {
        prevState[prevState.length - 1] = candle;
        return [...prevState];
      });
    }
  }, [line, candle]);


  const newChartData = () => {
    return chartData.map((cart) => ({ time: cart[0] / 1000 + 3600, value: Number(cart[4]) }));
  };

  const newChartDataCandle = () => {
    return chartData.map((cart) => ({ time: cart[0] / 1000 + 3600, open: Number(cart[1]), high: Number(cart[2]), low: Number(cart[3]), close: Number(cart[4]) }));
  };

  const newVolData = () => {
    return chartData.map((cart) => ({ time: cart[0] / 1000 + 3600, value: Number(cart[7]) }));
  };

  useEffect(() => {
    if (interval === '1s') {
      if (!chartData || !chartData[0]) {
        return;
      }

      const formattedChartData = newChartData();
      setResults((prevState) => [...prevState, ...chartData]);

      const handleResize = () => {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      };
      const chart = createChart(chartContainerRef.current, {
        layout: {
          background,
          textColor,
          lineColor,
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
        },
        width: chartContainerRef.current.clientWidth,
        height: 516,
      });

      setChartInitialize(chart);

      const newSeries = chart.addAreaSeries({
        lineColor,
        topColor: areaTopColor,
        bottomColor: areaBottomColor,
        lineWidth: 1,
      });
      setChartInstance(newSeries);

      newSeries.setData(formattedChartData);
      newSeries.applyOptions({
        priceFormat: {
          precision: formattedChartData[0].value >= 100 ? 2
                  : formattedChartData[0].value >= 10 ? 3  
                  : formattedChartData[0].value >= 1 ? 4
                  : formattedChartData[0].value >= 0.1 ? 5 
                  : 6,
          minMove: formattedChartData[0].value >= 100 ? 0.01 
                  : formattedChartData[0].value >= 10 ? 0.001
                  : formattedChartData[0].value >= 1 ? 0.0001
                  : formattedChartData[0].value >= 0.1 ? 0.00001 
                  : 0.000001,
        },
        priceLineVisible: false,
        crosshairMarkerVisible: false,
      });
      chart.timeScale().fitContent();

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chart.remove();
      };
    } else {
      if (!chartData || !chartData[0]) {
        return;
      }

      const formattedChartData = newChartDataCandle();
      setResults((prevState) => [...prevState, ...chartData]);

      const formattedVolData = newVolData();
      setVolResult((prevState) => [...prevState, ...chartData]);

      const handleResize = () => {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      };
      const chart = createChart(chartContainerRef.current, {
        layout: {
          background,
          textColor,
          lineColor,
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
		      bottom: 0.1,
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
        },
        width: chartContainerRef.current.clientWidth,
        height: 516,
      });

      setChartInitialize(chart);

      const newSeries = chart.addCandlestickSeries({
        upColor,
        downColor,
        wickUpColor,
        wickDownColor,
        borderUpColor,
        borderDownColor,
      });
      setChartInstance(newSeries);

      /*
      const volumeSeries = chart.addHistogramSeries({
	      color: '#26a69a',
	      priceFormat: {
		      type: 'volume',
	      },
        priceScaleId: '',
	      scaleMargins: {
		      top: 0.8,
		      bottom: 0,
	      },
      });
      */

      newSeries.setData(formattedChartData);
      //volumeSeries.setData(formattedVolData);

      newSeries.applyOptions({
        priceFormat: {
          precision: formattedChartData[0].open >= 100 ? 2
                  : formattedChartData[0].open >= 10 ? 3  
                  : formattedChartData[0].open >= 1 ? 4
                  : formattedChartData[0].open >= 0.1 ? 5 
                  : 6,
          minMove: formattedChartData[0].open >= 100 ? 0.01 
                  : formattedChartData[0].open >= 10 ? 0.001
                  : formattedChartData[0].open >= 1 ? 0.0001
                  : formattedChartData[0].open >= 0.1 ? 0.00001 
                  : 0.000001,
        },
        priceLineVisible: false,
        crosshairMarkerVisible: false,
      });


      chart.timeScale().fitContent();

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chart.remove();
      };
    }
  }, [chartData]);

  return (
    <>
      <div className='main-graph-component'>
        <Switcher interval={interval || '1s'} setInterval={setInterval} selectedSymbol={selectedSymbol} />
        <div ref={chartContainerRef} />
      </div>
    </>
  );
};

export default ChartComponent;

