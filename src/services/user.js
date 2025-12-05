import axiosInstance from './api';

export const getCurrentUser = async () => {
    try {
        const response = await axiosInstance.get('/user/user-current');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi lấy thông tin người dùng');
    }
};

export const updateUser = async (userData) => {
    try {
        const response = await axiosInstance.put('/user/update-user', userData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi cập nhật thông tin');
    }
};
export const uploadAvatar = async (userData) => {
    try {
        const response = await axiosInstance.put('/user/upload-avatar', userData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi cập nhật thông tin');
    }
};

export const updateUserAddress = async (address) => {
    try {
        const response = await axiosInstance.put('/user/update-address', { address });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi cập nhật địa chỉ');
    }
};

export const forgotPassword = async (email) => {
    try {
        const response = await axiosInstance.get(`/user/forgot-password?email=${email}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi quên mật khẩu');
    }
};

export const resetPassword = async (password, token) => {
    try {
        const response = await axiosInstance.put('/user/reset-password', { password, token });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi đặt lại mật khẩu');
    }
};

export const updateWishlist = async (productId) => {
    try {
        const response = await axiosInstance.put(`/user/wishlist/${productId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi cập nhật wishlist');
    }
};
export const changePassword = async (passwords) => {
    try {
        const response = await axiosInstance.put('/user/change-password', {
            currentPassword: passwords.currentPassword,
            newPassword: passwords.newPassword,
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi đổi mật khẩu');
    }
};

export const getWishlist = async () => {
    try {
        const response = await axiosInstance.get('/user/wishlist');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Lỗi lấy danh sách yêu thích');
    }
};
