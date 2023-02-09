import {ColorType, createChart} from 'lightweight-charts';
import React, {useEffect, useRef, useState} from 'react';
import useChartHistory from "../../hooks/useChartsHistory";
import useSocketSymbols from "../../hooks/useSocketSymbols";

export const ChartComponent = () => {
  const chartContainerRef = useRef();
  const { chartData, chartIsLoading, refetchChartHistory } = useChartHistory();
  const { trade } = useSocketSymbols();

  const [results, setResults] = useState([])
  const [chartSettings, setChartSettings] = useState({
    backgroundColor: 'linear-gradient(to left, rgb(0, 0, 0) 0%, rgb(28, 28, 28) 100%)',
    lineColor: '#2962FF',
    textColor: 'rgb(61, 61, 61)',
    areaTopColor: 'rgba(255,255,255,0)',
    areaBottomColor: 'rgba(255,255,255,0)',
  })
  const [chartInstance, setChartInstance] = useState({})
  const [chartInitialize, setChartInitialize] = useState({})

  useEffect(() => {
    if (!trade?.time) {
      return
    }
    chartInstance.update(trade)
    setResults((prevState) => {
      prevState[prevState.length -1] = trade;
      return [...prevState]})
  }, [trade])

  const newChartData = () => {
    return chartData.map(cart => {
      return {
        time: cart[0],
        open: cart[1],
        high: cart[2],
        low: cart[3],
        close: cart[4],
      };
    });
  }
  const handleResize = (chart) => {
    chart.applyOptions({ width: chartContainerRef.current.clientWidth });
  };

  useEffect(() => {
    if (!chartData || !chartData[0]) {
      return
    }

    const formattedChartData = newChartData();
    setResults(prevState => [...prevState, ...chartData])

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: chartSettings.backgroundColor },
        textColor: chartSettings.textColor,
      },
      width: chartContainerRef.current.clientWidth,
      height: 300,
    });
    setChartInitialize(chart)

    const newSeries = chart.addCandlestickSeries();
    setChartInstance(newSeries)

    newSeries.setData(formattedChartData);
    chart.timeScale().fitContent();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);

      chart.remove();
    };
  }, [chartData]);

  return <div ref={chartContainerRef} />;
};
