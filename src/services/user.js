import axiosInstance from './api';

export const getCurrentUser = async () => {
    try {
        const response = await axiosInstance.get('/user/user-current');
        if (response.data && response.data.success) {
            return response.data.data || response.data;
        }
        return response.data;
    } catch (error) {
        console.error('Error in getCurrentUser:', error);
        throw new Error(error.response?.data?.message || 'Lỗi lấy thông tin người dùng');
    }
};

export const updateUser = async (userData) => {
    try {
        if (!userData || Object.keys(userData).length === 0) {
            throw new Error('User data is required');
        }
        
        const response = await axiosInstance.put('/user/update-user', userData);
        if (response.data && response.data.success) {
            return response.data;
        }
        return response.data;
    } catch (error) {
        console.error('Error in updateUser:', error);
        throw new Error(error.response?.data?.message || 'Lỗi cập nhật thông tin');
    }
};
export const uploadAvatar = async (userData) => {
    try {
        if (!userData) {
            throw new Error('User data is required');
        }
        
        const response = await axiosInstance.put('/user/upload-avatar', userData, {
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
        console.error('Error in uploadAvatar:', error);
        throw new Error(error.response?.data?.message || 'Lỗi cập nhật avatar');
    }
};

export const updateUserAddress = async (address) => {
    try {
        if (!address) {
            throw new Error('Address is required');
        }
        
        const response = await axiosInstance.put('/user/update-address', { address });
        if (response.data && response.data.success) {
            return response.data;
        }
        return response.data;
    } catch (error) {
        console.error('Error in updateUserAddress:', error);
        throw new Error(error.response?.data?.message || 'Lỗi cập nhật địa chỉ');
    }
};

export const forgotPassword = async (email) => {
    try {
        if (!email) {
            throw new Error('Email is required');
        }
        
        const response = await axiosInstance.get(`/user/forgot-password?email=${encodeURIComponent(email)}`);
        if (response.data && response.data.success !== undefined) {
            return response.data;
        }
        return response.data;
    } catch (error) {
        console.error('Error in forgotPassword:', error);
        throw new Error(error.response?.data?.message || 'Lỗi quên mật khẩu');
    }
};

export const resetPassword = async (password, token) => {
    try {
        if (!password || !token) {
            throw new Error('Password and token are required');
        }
        
        const response = await axiosInstance.put('/user/reset-password', { password, token });
        if (response.data && response.data.success !== undefined) {
            return response.data;
        }
        return response.data;
    } catch (error) {
        console.error('Error in resetPassword:', error);
        throw new Error(error.response?.data?.message || 'Lỗi đặt lại mật khẩu');
    }
};

export const updateWishlist = async (productId) => {
    try {
        if (!productId) {
            throw new Error('Product ID is required');
        }
        
        const response = await axiosInstance.put(`/user/wishlist/${productId}`);
        if (response.data && response.data.success !== undefined) {
            return response.data;
        }
        return response.data;
    } catch (error) {
        console.error('Error in updateWishlist:', error);
        throw new Error(error.response?.data?.message || 'Lỗi cập nhật wishlist');
    }
};

export const changePassword = async (passwords) => {
    try {
        if (!passwords || !passwords.currentPassword || !passwords.newPassword) {
            throw new Error('Current password and new password are required');
        }
        
        const response = await axiosInstance.put('/user/change-password', {
            currentPassword: passwords.currentPassword,
            newPassword: passwords.newPassword,
        });
        
        if (response.data && response.data.success !== undefined) {
            return response.data;
        }
        return response.data;
    } catch (error) {
        console.error('Error in changePassword:', error);
        throw new Error(error.response?.data?.message || 'Lỗi đổi mật khẩu');
    }
};

export const getWishlist = async () => {
    try {
        const response = await axiosInstance.get('/user/wishlist');
        if (response.data && response.data.success) {
            return response.data.wishlist || response.data;
        }
        return response.data || { products: [] };
    } catch (error) {
        console.error('Error in getWishlist:', error);
        return { products: [] };
    }
};
