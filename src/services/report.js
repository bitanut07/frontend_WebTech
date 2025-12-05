import axiosInstance from './api';

// In getRevenueReport service
export const getRevenueReport = async (params) => {
    try {
        const requestBody = {
            year: params.year,
            month: params.dateRange === 'year' ? undefined : params.month,
        };

        console.log('Sending request with body:', requestBody);
        const response = await axiosInstance.post('/order/report', requestBody);
        console.log('Response received:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching revenue report:', error);
        throw error;
    }
};
