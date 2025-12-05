
import axiosInstance from './api';
export const login = async (user) => {
    try {
        const response = await axiosInstance.post('/auth/login', user, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi lấy thông tin người dùng');
    }
};
export const register = async (user) => {
    try {
        const response = await axiosInstance.post('/auth/register', user, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'That bai');
    }
};
export const logout = async () => {
    try {
        const response = await axiosInstance.post(
            '/auth/logout',
            {},
            {
                withCredentials: true,
            },
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'That bai');
    }
};
export const verifyOtp = async (body) => {
    try {
        const response = await axiosInstance.post('/auth/verify-otp', body, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi lấy thông tin người dùng');
    }
};
export const changePassword = async (password) => {
    try {
        const response = await axiosInstance.post('/auth/verify-change-pass', password, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'That bai');
    }
};
export const requestGoogle = async (code) => {
    try {
        const response = await axiosInstance.get(`/auth/google?code=${code}`, {
            withCredentials: true,
        });
        return response;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'That bai');
    }
};
export const refreshToken = async () => {
    try {
        const response = await axiosInstance.post(
            `/auth/refreshToken`,
            {},
            {
                withCredentials: true,
            },
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'That bai');
    }
};
export const verifyChangePassword = async (password) => {
    try {
        const response = await axiosInstance.post('/auth/verify-change-pass', password);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi lấy thông tin người dùng');
    }
};
