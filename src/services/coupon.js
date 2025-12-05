import axiosInstance from './api';

export const createCoupon = async (couponData) => {
    try {
        if (!couponData || !couponData.name || !couponData.discount || !couponData.expire) {
            throw new Error('Missing required fields: name, discount, expire');
        }
        
        const response = await axiosInstance.post('/coupon', couponData);
        if (response.data && response.data.success) {
            return response.data;
        }
        return response.data;
    } catch (error) {
        console.error('Error in createCoupon:', error);
        throw new Error(error.response?.data?.message || 'Không thể tạo mã giảm giá');
    }
};

export const getCoupons = async () => {
    try {
        const response = await axiosInstance.get('/coupon');
        if (response.data && response.data.success) {
            return response.data.coupons || [];
        }
        return [];
    } catch (error) {
        console.error('Error in getCoupons:', error);
        return [];
    }
};

export const updateCoupon = async (id, updateData) => {
    try {
        if (!id || !updateData || Object.keys(updateData).length === 0) {
            throw new Error('Coupon ID and update data are required');
        }
        
        const response = await axiosInstance.put(`/coupon/${id}`, updateData);
        if (response.data && response.data.success) {
            return response.data;
        }
        return response.data;
    } catch (error) {
        console.error('Error in updateCoupon:', error);
        throw new Error(error.response?.data?.message || 'Không thể cập nhật mã giảm giá');
    }
};

export const deleteCoupon = async (id) => {
    try {
        if (!id) {
            throw new Error('Coupon ID is required');
        }
        
        const response = await axiosInstance.delete(`/coupon/${id}`);
        if (response.data && response.data.success) {
            return response.data;
        }
        return response.data;
    } catch (error) {
        console.error('Error in deleteCoupon:', error);
        throw new Error(error.response?.data?.message || 'Không thể xóa mã giảm giá');
    }
};
