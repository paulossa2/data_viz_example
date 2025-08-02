// service.js

const fetchData = async (dateFrom, dateTo) => {
    const url = `https://stg-app.energysequence.com/v2/datalog/?meter=65ae46bc49cdbed254e4d17b&date_from=${dateFrom}&date_to=${dateTo}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export { fetchData };