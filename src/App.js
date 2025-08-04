import './App.css';
import { useState } from 'react';
import {
  Button, Dropdown, Flex, Form, Layout, DatePicker, Space, Typography,
} from 'antd';
import { DownOutlined, LinkedinFilled, InfoCircleOutlined } from '@ant-design/icons';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import weekOfYear from 'dayjs/plugin/weekOfYear';

import { fetchData, createHighchartsOptions } from './plots/service';

dayjs.extend(weekOfYear); // extend dayjs with week of year plugin
dayjs.extend(advancedFormat); // extend dayjs with advanced format plugin

const { Header, Content, Footer } = Layout;
const { RangePicker } = DatePicker;

const FREQUENCIES = ['15 minutos', 'Diaria', 'Semanal', 'Mensual', 'Anual'];
const TIPOS_DE_GRAFICO = ['Líneas', 'Columnas', 'Área'];
const MEDIDAS = ['Energía Activa', 'Energía Generada', 'Energía Reactiva Inductiva', 'Energía Inductiva Generada', 'Energía Capacitiva Generada', 'Energía Reactiva Capacitiva', 'Cualificador de Energía Activa Importada', 'Cualificador de Energía Activa Exportada', 'Cualificador de Energía Inductiva Importada', 'Cualificador de Energía Inductiva Exportada', 'Cualificador de Energía Capacitiva Exportada', 'Cualificador de Energía Capacitiva Importada', 'Potencia Activa Total'];

function App() {
  const [dateFrom, setDateFrom] = useState();
  const [dateTo, setDateTo] = useState();
  const [frequency, setFrequency] = useState();
  const [measure, setMeasure] = useState();
  const [graphType, setGraphType] = useState();
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [form] = Form.useForm();

  const handleButtonClick = async () => {
    const df = dayjs(dateFrom, 'YYYY-MM-DD').format('YYYY-MM-DD');
    const dt = dayjs(dateTo, 'YYYY-MM-DD').format('YYYY-MM-DD');
    setLoading(true);
    setError();

    try {
      const response = await fetchData(df, dt);
      setData(response);
      setError();
    } catch (err) {
      setData([]);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRange = (dates, dateStrings) => {
    setDateFrom(dateStrings[0]);
    setDateTo(dateStrings[1]);
  };

  const menuFreqProps = {
    items: FREQUENCIES.map((label) => ({
      label,
      key: label,
    })),
    onClick: (e) => setFrequency(e.key),
  };

  const menuMeasureProps = {
    items: MEDIDAS.map((label) => ({
      label,
      key: label,
    })),
    onClick: (e) => setMeasure(e.key),
  };

  const menuTipoGraficoProps = {
    items: TIPOS_DE_GRAFICO.map((label) => ({
      label,
      key: label,
    })),
    onClick: (e) => setGraphType(e.key),
  };

  const isGenerateDisabled = () => !dateFrom || !dateTo || !frequency || !measure || !graphType;

  const renderChart = () => {
    if (isGenerateDisabled() || data.length === 0) {
      return (
        <Typography.Text>
          <InfoCircleOutlined style={{ marginRight: '.6em' }} />
          Llene el formulario para generar el gráfico.
        </Typography.Text>
      );
    }
    if (loading) {
      return <p>Loading...</p>;
    }
    const options = createHighchartsOptions(data, measure, frequency, graphType);
    return (
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
    );
  };

  return (

    <Layout style={{ minHeight: '100vh' }} className="App">
      <Header style={{ alignItems: 'center', verticalAlign: 'middle' }}>
        <Flex justify="space-between" style={{ paddingTop: '.8em' }}>
          <Typography.Title level={2} style={{ color: 'white', margin: 0 }}>Gráficos de Datos Energéticos</Typography.Title>
        </Flex>
      </Header>
      <Content style={{ padding: '1.6em 4em', display: 'block' }}>
        <div
          style={{
            background: '#ddd',
            padding: 12,
            borderRadius: 4,
          }}
        >
          <Space>
            <Form direction="vertical" form={form}>
              <Typography.Text
                type="secondary"
                style={{ marginBottom: '1em', display: 'block' }}
              >
                Seleccione el rango de fechas, frecuencia, medida y tipo de gráfico
                para generar el gráfico correspondiente.
              </Typography.Text>
              <Form.Item required>
                <RangePicker
                  style={{ width: '100%' }}
                  placeholder={['Fecha de inicio', 'Fecha final']}
                  onChange={handleDateRange}
                  maxDate={dayjs()}
                />
              </Form.Item>
              <Form.Item>
                <Flex justify="space-around">
                  <Dropdown menu={menuFreqProps}>
                    <Button>
                      <Space>
                        {frequency || 'Frecuencia'}
                        <DownOutlined />
                      </Space>
                    </Button>
                  </Dropdown>
                  <Dropdown menu={menuMeasureProps}>
                    <Button>
                      <Space>
                        {measure || 'Medida'}
                        <DownOutlined />
                      </Space>
                    </Button>
                  </Dropdown>
                  <Dropdown menu={menuTipoGraficoProps}>
                    <Button>
                      <Space>
                        {graphType || 'Tipo de Gráfico'}
                        <DownOutlined />
                      </Space>
                    </Button>
                  </Dropdown>
                </Flex>
              </Form.Item>
              <Button type="primary" loading={loading} style={{ width: '100%' }} onClick={handleButtonClick} disabled={isGenerateDisabled()}>Generar Gráfico</Button>
            </Form>
          </Space>
        </div>
        <hr />
        {
          error ? <Typography.Text type="danger">{error.message}</Typography.Text> : renderChart()
        }
      </Content>
      <Footer
        style={{ textAlign: 'center', display: 'block' }}
      >
        <Typography.Text type="secondary">
          Desarrollado por
          {' '}
          <strong>Paulo Araujo</strong>
          <a href="https://www.linkedin.com/in/paulossaraujo/" aria-label="Enlace para linkedin" target="_blank" rel="noopener noreferrer">
            <LinkedinFilled style={{
              position: 'relative',
              fontSize: '1rem',
              top: '.1em',
              padding: '.3em',
            }}
            />
          </a>
        </Typography.Text>
      </Footer>
    </Layout>
    // </div>
  );
}

export default App;
