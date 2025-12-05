import axiosInstance from './api';

export const createReturnRequest = async (formData) => {
    try {
        const response = await axiosInstance.post('/returnOrder', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 60000, // 60 giây cho upload file
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const getUserReturn = async () => {
    try {
        const response = await axiosInstance.get('/returnOrder/user');
        return response.data;
    } catch (error) {
        console.error('Return request error:', {
            status: error.response?.status,
            message: error.response?.data?.message || error.message,
            data: error.response?.data,
        });
        throw error;
    }
};
export const getAllReturns = async () => {
    try {
        const response = await axiosInstance.get('/returnOrder/admin');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getReturnDetail = async (id) => {
    try {
        const response = await axiosInstance.get(`/returnOrder/admin/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const processReturn = async (id, status) => {
    try {
        const response = await axiosInstance.put(`/returnOrder/admin/${id}`, { status });
        return response.data;
    } catch (error) {
        throw error;
    }
};
