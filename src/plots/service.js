import dayjs from 'dayjs';

const fetchData = async (dateFrom, dateTo) => {
  const url = `https://stg-app.energysequence.com/v2/datalog/?meter=65ae46bc49cdbed254e4d17b&date_from=${dateFrom}&date_to=${dateTo}`;

  const response = await fetch(url);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('No hay datos para el rango de fechas seleccionado');
    } else {
      // eslint-disable-next-line no-console
      console.error('Error HTTP:', response.status, response.statusText);
      throw new Error('Error al obtener los datos. Por favor, inténtelo de nuevo más tarde.');
    }
  }
  const data = await response.json();
  return data;
};
const defineChartType = (graphType) => {
  switch (graphType) {
    case 'Líneas':
      return 'line';
    case 'Columnas':
      return 'column';
    case 'Área':
      return 'area';
    default:
      return 'line';
  }
};

const computeAxis = (data, measure, frequency) => {
  // Default is already 15min intervals.
  const minuteFormat = 'DD/MM/YYYY HH:mm:ss';
  const dayFormat = 'DD/MM/YYYY';
  const monthFormat = 'MM/YYYY';
  const yearFormat = 'YYYY';

  const computedXaxis = data.map((item) => dayjs(item.date).format(minuteFormat));
  const computedYaxis = data.map((item) => item.values[measure]);

  function computeDailyAxes() {
    const visited = {};
    const outputX = [];
    const outputY = [];
    for (let idx = 0; idx < computedXaxis.length; idx += 1) {
      const dateStr = computedXaxis[idx];
      const value = computedYaxis[idx];
      const dt = dayjs(dateStr, minuteFormat).format(dayFormat);
      if (!visited[dt]) {
        visited[dt] = true;
        outputX.push(dt);
        outputY.push(value);
      } else {
        outputY[outputY.length - 1] += value; // Sum the values for the same date
      }
    }
    return [outputX, outputY];
  }

  function computeWeeklyAxes() {
    const [days, values] = computeDailyAxes();
    const visited = {};
    const outputX = [];
    const outputY = [];
    for (let idx = 0; idx < days.length; idx += 1) {
      const dateStr = days[idx];
      const value = values[idx];
      const weekOfYear = dayjs(dateStr, dayFormat).week();
      const beginningOfWeek = dayjs(dateStr, dayFormat).startOf('week').format(dayFormat);
      const endingOfWeek = dayjs(dateStr, dayFormat).endOf('week').format(dayFormat);
      const dt = `${beginningOfWeek} to ${endingOfWeek} (Sem. ${weekOfYear})`;
      if (!visited[dt]) {
        visited[dt] = true;
        outputX.push(dt);
        outputY.push(value);
      } else {
        outputY[outputY.length - 1] += value; // Sum the values for the same week
      }
    }
    return [outputX, outputY];
  }

  function computeMonthlyAxes() {
    const [days, values] = computeDailyAxes();
    const visited = {};
    const outputX = [];
    const outputY = [];
    for (let idx = 0; idx < days.length; idx += 1) {
      const dateStr = days[idx];
      const value = values[idx];
      const dt = dayjs(dateStr, dayFormat).format(monthFormat);
      if (!visited[dt]) {
        visited[dt] = true;
        outputX.push(dt);
        outputY.push(value);
      } else {
        outputY[outputY.length - 1] += value; // Sum the values for the same month
      }
    }
    return [outputX, outputY];
  }

  function computeAnualAxes() {
    const [days, values] = computeDailyAxes();
    const visited = {};
    const outputX = [];
    const outputY = [];
    for (let idx = 0; idx < days.length; idx += 1) {
      const dateStr = days[idx];
      const value = values[idx];
      const dt = dayjs(dateStr, dayFormat).format(yearFormat);
      if (!visited[dt]) {
        visited[dt] = true;
        outputX.push(dt);
        outputY.push(value);
      } else {
        outputY[outputY.length - 1] += value; // Sum the values for the same year
      }
    }
    return [outputX, outputY];
  }

  switch (frequency) {
    case 'Diaria':
      return computeDailyAxes();
    // TODO: Assuming data is daily, xAxis should be reduced from the 15min steps to daily steps
    case 'Semanal':
      return computeWeeklyAxes();
    case 'Mensual':
      return computeMonthlyAxes();
    case 'Anual':
      return computeAnualAxes();
    default:
      return [computedXaxis, computedYaxis];
  }
};

const createHighchartsOptions = (data, measure, frequency, graphType) => {
  const [computedXaxis, computedYaxis] = computeAxis(data, measure, frequency);
  return {
    chart: {
      type: defineChartType(graphType),
    },
    title: {
      text: `Gráfico de ${measure} (${frequency})`,
    },
    xAxis: {
      categories: computedXaxis,
    },
    yAxis: {
      title: {
        text: measure,
      },
    },
    tooltip: {
      shared: true,
      valueSuffix: ' W',
    },
    series: [{
      name: measure,
      data: computedYaxis,
    }],
  };
};

export { fetchData, createHighchartsOptions };
