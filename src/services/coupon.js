import axiosInstance from './api';

export const createCoupon = async (couponData) => {
    try {
        const response = await axiosInstance.post('coupon', couponData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getCoupons = async () => {
    try {
        const response = await axiosInstance.get('coupon');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateCoupon = async (id, updateData) => {
    try {
        const response = await axiosInstance.put(`coupon/${id}`, updateData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteCoupon = async (id) => {
    try {
        const response = await axiosInstance.delete(`coupon/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
