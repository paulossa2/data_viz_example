import dayjs from 'dayjs';

import advancedFormat from 'dayjs/plugin/advancedFormat';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { createHighchartsOptions } from './plots/service';

dayjs.extend(weekOfYear); // extend dayjs with week of year plugin
dayjs.extend(advancedFormat); // extend dayjs with advanced format plugin

const responseExample = [{
  date: '2025-01-01T00:00:00',
  values: {
    'Energ\u00eda Activa': 8.0,
  },
}, {
  date: '2025-01-01T00:15:00',
  values: {
    'Energ\u00eda Activa': 6.0,
  },
},
{
  date: '2026-01-01T00:15:00',
  values: {
    'Energ\u00eda Activa': 6.0,
  },
},
];

test('Create highcharts options 15 minutes granularity', () => {
  const measure = 'Energía Activa';
  const frequency = '15 minutos';
  const graphType = 'Líneas';
  const options = createHighchartsOptions(responseExample, measure, frequency, graphType);
  expect(options).toEqual({
    chart: {
      type: 'line',
    },
    title: { text: `Gráfico de ${measure} (${frequency})` },
    xAxis: {
      categories: ['01/01/2025 00:00:00', '01/01/2025 00:15:00', '01/01/2026 00:15:00'],
    },
    yAxis: {
      title: { text: measure },
    },
    tooltip: {
      shared: true,
      valueSuffix: ' W',
    },
    series: [{
      name: measure,
      data: [
        8.0,
        6.0,
        6.0,
      ],
    }],
  });
});

test('Create highcharts options daily granularity', () => {
  const measure = 'Energía Activa';
  const frequency = 'Diaria';
  const graphType = 'Líneas';
  const options = createHighchartsOptions(responseExample, measure, frequency, graphType);
  expect(options).toEqual({
    chart: {
      type: 'line',
    },
    title: { text: `Gráfico de ${measure} (${frequency})` },
    xAxis: {
      categories: ['01/01/2025', '01/01/2026'],
    },
    yAxis: {
      title: { text: measure },
    },
    tooltip: {
      shared: true,
      valueSuffix: ' W',
    },
    series: [{
      name: measure,
      data: [
        8.0 + 6.0, // Sum of values for the same day
        6.0,
      ],
    }],
  });
});

test('Create highcharts options weekly granularity', () => {
  const measure = 'Energía Activa';
  const frequency = 'Semanal';
  const graphType = 'Líneas';
  const options = createHighchartsOptions(responseExample, measure, frequency, graphType);
  expect(options).toEqual({
    chart: {
      type: 'line',
    },
    title: { text: `Gráfico de ${measure} (${frequency})` },
    xAxis: {
      categories: ['29/12/2024 to 04/01/2025 (Sem. 1)', '28/12/2025 to 03/01/2026 (Sem. 1)'],
    },
    yAxis: {
      title: { text: measure },
    },
    tooltip: {
      shared: true,
      valueSuffix: ' W',
    },
    series: [{
      name: measure,
      data: [
        8.0 + 6.0, // Sum of values for the same week
        6.0,
      ],
    }],
  });
});

test('Create highcharts options monthly granularity', () => {
  const measure = 'Energía Activa';
  const frequency = 'Mensual';
  const graphType = 'Líneas';
  const options = createHighchartsOptions(responseExample, measure, frequency, graphType);
  expect(options).toEqual({
    chart: {
      type: 'line',
    },
    title: { text: `Gráfico de ${measure} (${frequency})` },
    xAxis: {
      categories: ['01/2025', '01/2026'],
    },
    yAxis: {
      title: { text: measure },
    },
    tooltip: {
      shared: true,
      valueSuffix: ' W',
    },
    series: [{
      name: measure,
      data: [
        8.0 + 6.0, // Sum of values for the same month
        6.0,
      ],
    }],
  });
});

test('Create highcharts options annual granularity', () => {
  const measure = 'Energía Activa';
  const frequency = 'Anual';
  const graphType = 'Líneas';
  const options = createHighchartsOptions(responseExample, measure, frequency, graphType);
  expect(options).toEqual({
    chart: {
      type: 'line',
    },
    title: { text: `Gráfico de ${measure} (${frequency})` },
    xAxis: {
      categories: ['2025', '2026'],
    },
    yAxis: {
      title: { text: measure },
    },
    tooltip: {
      shared: true,
      valueSuffix: ' W',
    },
    series: [{
      name: measure,
      data: [
        8.0 + 6.0, // Sum of values for the same year
        6.0,
      ],
    }],
  });
});
