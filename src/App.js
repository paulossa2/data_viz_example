import './App.css';
import { fetchData } from './plots/service.js';
import { useEffect, useState } from 'react';
import { Button, Dropdown, Layout, DatePicker, Space, message } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import LineChart from './plots/LineChart.js';

const { Header, Content, Footer } = Layout;
const { RangePicker } = DatePicker;

function App() {
  const [dateFrom, setDateFrom] = useState('2024-12-22');
  const [dateTo, setDateTo] = useState('2024-12-22');
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   fetchData(dateFrom, dateTo)
  //   .then(response => {
  //     console.log(response);
  //     setData(response);
  //     setLoading(false);
  //   })
  // }, []);
  
  //#region Dropdown menu items
  const handleButtonClick = e => {
    message.info('Click on left button.');
    console.log('click left button', e);
  };
  const handleMenuClick = e => {
    message.info('Click on menu item.');
    console.log('click', e);
  };
  const items = 
    ["15 minutos", "Diaria", "Semanal", "Mensual", "Anual"].map((label, index) => ({
      label: label,
      key: `${index + 1}`,
    }));
  const menuProps = {
    items,
    onClick: handleMenuClick,
  };
  //#endregion
   
  return (
    <div className="App">
      <Content style={{ padding: '0 48px' }}>
        {/* <Breadcrumb
          style={{ margin: '16px 0' }}
          items={[{ title: 'Home' }, { title: 'List' }, { title: 'App' }]}
        /> */}
        <div
          style={{
            background: '#ddd',
            padding: 24,
            borderRadius: 4,
          }}
        >
          <Space direction="vertical" size={8}>
            <RangePicker />
            <Space>
            <Dropdown menu={menuProps}>
              <Button>
                <Space>
                  Frequency
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
            <Dropdown menu={menuProps}>
              <Button>
                <Space>
                  Medida
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
            <Dropdown menu={menuProps}>
              <Button>
                <Space>
                  Tipo de Gráfico
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
            </Space>
            <Button type="primary">Generar Gráfico</Button>

          </Space>
        </div>
      </Content>
      
      <hr />
      {
        loading ? <p>Loading...</p> : null
      }
      {
        error ? <p>Error: {error.message}</p> : null
      }
      <LineChart></LineChart>
      {/* {!loading ? JSON.stringify(data) : null} */}

    </div>
  );
}

export default App;
