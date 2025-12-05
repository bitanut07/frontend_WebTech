import axiosInstance from './api';
import Swal from 'sweetalert2';

const handleApiError = (error, defaultMessage) => {
    console.error('API Error:', error);
    const errorMessage = error.response?.data?.message || error.message || defaultMessage;
    Swal.fire('Lỗi', errorMessage, 'error');
};

const userService = {
    checkAdminAccess: () => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const isAdmin = currentUser?.infoUser?.admin === true;

        if (!isAdmin) {
            Swal.fire({
                icon: 'warning',
                title: 'Truy cập bị từ chối',
                text: 'Bạn không có quyền thực hiện thao tác này',
                footer: `Email: ${currentUser?.infoUser?.email || 'Không xác định'}`,
            });
            return false;
        }
        return true;
    },
    getAllUsers: async () => {
        try {
            if (!userService.checkAdminAccess()) return null;
            const response = await axiosInstance.get('/user/allUsers');
            return response.data;
        } catch (error) {
            handleApiError(error, 'Không thể tải danh sách người dùng');
            return null;
        }
    },
    getUserDetail: async (userId) => {
        try {
            if (!userService.checkAdminAccess()) return null;
            const response = await axiosInstance.get(`/user/user-detail/${userId}`);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Không thể tải thông tin chi tiết người dùng');
            return null;
        }
    },
    getUserOrders: async (userId) => {
        try {
            const response = await axiosInstance.get(`/order/user-order/${userId}`);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Không thể tải danh sách đơn hàng của người dùng');
            return null;
        }
    },
    deleteUser: async (userId) => {
        try {
            if (!userService.checkAdminAccess()) return null;
            const response = await axiosInstance.delete(`/user/delete/${userId}`);
            Swal.fire({
                icon: 'success',
                title: 'Xóa người dùng',
                text: 'Đã xóa người dùng thành công',
            });
            return response.data;
        } catch (error) {
            handleApiError(error, 'Không thể xóa người dùng');
            return null;
        }
    },

    updateUser: async (userData) => {
        try {
            const response = await axiosInstance.put('/user/update-user', userData);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Không thể cập nhật thông tin người dùng');
            return null;
        }
    },

    updateUserAddress: async (address) => {
        try {
            const response = await axiosInstance.put('/user/update-address', { address });
            return response.data;
        } catch (error) {
            handleApiError(error, 'Không thể cập nhật địa chỉ');
            return null;
        }
    },

    forgotPassword: async (email) => {
        try {
            const response = await axiosInstance.get('/user/forgot-password', {
                params: { email },
            });
            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Link reset mật khẩu đã được gửi đến email của bạn',
            });
            return response.data;
        } catch (error) {
            handleApiError(error, 'Không thể gửi link reset mật khẩu');
            return null;
        }
    },

    resetPassword: async (password, token) => {
        try {
            const response = await axiosInstance.put('/user/reset-password', { password, token });
            return response.data;
        } catch (error) {
            handleApiError(error, 'Không thể thay đổi mật khẩu');
            return null;
        }
    },

    changePassword: async (passwordData) => {
        try {
            const response = await axiosInstance.put('/user/change-password', passwordData);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Không thể thay đổi mật khẩu');
            return null;
        }
    },

    updateWishlist: async (productId) => {
        try {
            const response = await axiosInstance.put(`/user/wishlist/${productId}`);
            return response.data;
        } catch (error) {
            handleApiError(error, 'Không thể cập nhật wishlist');
            return null;
        }
    },

    getWishlist: async () => {
        try {
            const response = await axiosInstance.get('/user/wishlist');
            return response.data;
        } catch (error) {
            handleApiError(error, 'Không thể tải danh sách wishlist');
            return null;
        }
    },

    blockUser: async (userId) => {
        try {
            if (!userService.checkAdminAccess()) return null;
            const response = await axiosInstance.put('/user/block', { user_id: userId });
            return response.data;
        } catch (error) {
            handleApiError(error, 'Không thể cập nhật trạng thái người dùng');
            return null;
        }
    },
};

export default userService;
