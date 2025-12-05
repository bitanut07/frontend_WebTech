import axiosInstance from './api';

export const createReturnRequest = async (formData) => {
    try {
        if (!formData) {
            throw new Error('Form data is required');
        }
        
        const response = await axiosInstance.post('/returnOrder', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 60000, // 60 giây cho upload file
        });
        
        if (response.data && response.data.success) {
            return response.data;
        }
        
        return response.data;
    } catch (error) {
        console.error('Error in createReturnRequest:', error);
        throw new Error(error.response?.data?.message || 'Không thể tạo yêu cầu trả hàng');
    }
};

export const getUserReturn = async () => {
    try {
        const response = await axiosInstance.get('/returnOrder/user');
        if (response.data && response.data.success) {
            return response.data.returns || [];
        }
        return [];
    } catch (error) {
        console.error('Return request error:', {
            status: error.response?.status,
            message: error.response?.data?.message || error.message,
            data: error.response?.data,
        });
        return [];
    }
};

export const getAllReturns = async () => {
    try {
        const response = await axiosInstance.get('/returnOrder/admin');
        if (response.data && response.data.success) {
            return response.data.returns || [];
        }
        return [];
    } catch (error) {
        console.error('Error in getAllReturns:', error);
        return [];
    }
};

export const getReturnDetail = async (id) => {
    try {
        if (!id) {
            throw new Error('Return request ID is required');
        }
        
        const response = await axiosInstance.get(`/returnOrder/admin/${id}`);
        if (response.data && response.data.success) {
            return response.data.return_request;
        }
        return response.data;
    } catch (error) {
        console.error('Error in getReturnDetail:', error);
        throw new Error(error.response?.data?.message || 'Không thể lấy thông tin yêu cầu trả hàng');
    }
};

export const processReturn = async (id, status) => {
    try {
        if (!id || !status) {
            throw new Error('Return request ID and status are required');
        }
        
        const response = await axiosInstance.put(`/returnOrder/admin/${id}`, { status });
        if (response.data && response.data.success) {
            return response.data;
        }
        return response.data;
    } catch (error) {
        console.error('Error in processReturn:', error);
        throw new Error(error.response?.data?.message || 'Không thể xử lý yêu cầu trả hàng');
    }
};
