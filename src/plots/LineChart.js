import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// Initialize Highcharts (required for some features)
Highcharts.setOptions({
  time: {
    useUTC: false
  }
});

const LineChart = ({ title, series, xAxisTitle, yAxisTitle }) => {
  const options = {
    chart: {
      type: 'line'
    },
    title: {
      text: title || 'Line Chart'
    },
    xAxis: {
      title: {
        text: xAxisTitle || 'X Axis'
      }
    },
    yAxis: {
      title: {
        text: yAxisTitle || 'Y Axis'
      }
    },
    series: series || [
      {
        name: 'Sample Data',
        data: [1, 2, 3, 4, 5]
      }
    ],
    credits: {
      enabled: false
    }
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default LineChart;