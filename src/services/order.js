import axiosInstance from './api';
import Swal from 'sweetalert2';

const handleApiError = (error, defaultMessage) => {
    console.error(defaultMessage, error);
    if (error.response?.data?.message) {
        Swal.fire('Lỗi', error.response.data.message, 'error');
    } else {
        Swal.fire('Lỗi', defaultMessage, 'error');
    }
};

const orderApi = {
    getAllOrders: async () => {
        try {
            const response = await axiosInstance.get('/order/allOrders');
            if (response.data && response.data.success) {
                return response.data.orders || [];
            }
            return [];
        } catch (error) {
            console.error('Error in getAllOrders:', error);
            handleApiError(error, 'Không thể tải danh sách đơn hàng');
            return [];
        }
    },

    getOrderById: async (orderId) => {
        try {
            if (!orderId) {
                throw new Error('Order ID is required');
            }
            
            const response = await axiosInstance.get(`/order/${orderId}`);

            if (!response.data) {
                throw new Error('No data received from server');
            }

            // Handle both response formats
            const orderData = response.data.order || response.data;

            if (!orderData) {
                throw new Error('Order not found');
            }

            return orderData;
        } catch (error) {
            console.error('Error in getOrderById:', error);
            handleApiError(error, 'Không thể tải thông tin đơn hàng');
            throw error;
        }
    },

    getUserOrders: async () => {
        try {
            const response = await axiosInstance.get('/order');
            if (response.data && response.data.success) {
                return response.data.orders || [];
            }
            return [];
        } catch (error) {
            console.error('Error in getUserOrders:', error);
            handleApiError(error, 'Không thể tải đơn hàng của người dùng');
            return [];
        }
    },

    createOrder: async (orderData) => {
        try {
            // Validation
            if (!orderData || !orderData.items || orderData.items.length === 0) {
                throw new Error('Order data is invalid');
            }

            const payload = {
                infoReceive: {
                    name: orderData.name,
                    phone: orderData.phone,
                    address: orderData.address,
                    note: orderData.note,
                },
                items: orderData.items.map((item) => ({
                    product: item.id,
                    quantity: item.quantity,
                    price: item.price,
                })),
                total_price: orderData.totalAmount,
                payment_method: orderData.paymentMethod,
                shipping_fee: orderData.shippingFee || 30000,
                coupon: orderData.coupon
                    ? {
                          name: orderData.coupon.name,
                          discount: orderData.coupon.discount,
                      }
                    : null,
                discount: orderData.discount || 0,
            };

            const response = await axiosInstance.post('/order', payload);

            if (response.data && response.data.success) {
                return {
                    success: true,
                    order: response.data.newOrder,
                };
            }
            
            throw new Error(response.data?.message || 'Create order failed');
        } catch (error) {
            console.error('Error in createOrder:', error);
            handleApiError(error, 'Không thể tạo đơn hàng');
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Không thể tạo đơn hàng',
            };
        }
    },
    paymentOrder: async (orderData) => {
        try {
            const payload = {
                infoReceive: {
                    name: orderData.name,
                    phone: orderData.phone,
                    address: orderData.address,
                    note: orderData.note,
                },
                items: orderData.items.map((item) => ({
                    product: item.id,
                    quantity: item.quantity,
                    price: item.price,
                })),
                total_price: orderData.totalAmount,
                payment_method: orderData.paymentMethod,
                shipping_fee: orderData.shippingFee || 30000,
                coupon: orderData.coupon
                    ? {
                          name: orderData.coupon.name,
                          discount: orderData.coupon.discount,
                      }
                    : null,
                discount: orderData.discount || 0,
            };
            const response = await axiosInstance.post(`/order/payment`, { orderData: payload });
            return response.data;
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    },
    updateOrderStatus: async (orderId, status) => {
        try {
            if (!orderId || !status) {
                throw new Error('Order ID and status are required');
            }
            
            const response = await axiosInstance.put(`/order/${orderId}`, { status });
            if (response.data && response.data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Cập nhật trạng thái đơn hàng thành công',
                });
                return response.data;
            }
            throw new Error(response.data?.message || 'Update failed');
        } catch (error) {
            console.error('Error in updateOrderStatus:', error);
            handleApiError(error, 'Không thể cập nhật trạng thái đơn hàng');
            return {
                success: false,
                error: error.response?.data?.message || error.message
            };
        }
    },

    updateOrder: async (orderId, orderData) => {
        try {
            if (!orderId || !orderData) {
                throw new Error('Order ID and data are required');
            }
            
            const response = await axiosInstance.put(`/order/${orderId}`, orderData);
            if (response.data && response.data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Cập nhật đơn hàng thành công',
                });
                return response.data;
            }
            throw new Error(response.data?.message || 'Update failed');
        } catch (error) {
            console.error('Error in updateOrder:', error);
            handleApiError(error, 'Không thể cập nhật đơn hàng');
            return {
                success: false,
                error: error.response?.data?.message || error.message
            };
        }
    },

    helpers: {
        formatDate: (date) => {
            if (!date) return '';
            return new Date(date).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            });
        },

        formatCurrency: (amount) => {
            if (!amount && amount !== 0) return '0 ₫';
            return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
            }).format(amount);
        },

        filterByStatus: (orders, status) => {
            if (!orders) return [];
            if (status === 'tất cả') return orders;
            return orders.filter((order) => order.status === status);
        },

        filterByDateRange: (orders, startDate, endDate) => {
            if (!orders) return [];
            return orders.filter((order) => {
                const orderDate = new Date(order.date_order);
                const start = startDate ? new Date(startDate) : null;
                const end = endDate ? new Date(endDate) : null;

                if (start && orderDate < start) return false;
                if (end && end.setHours(23, 59, 59, 999) && orderDate > end) return false;
                return true;
            });
        },

        filterByPriceRange: (orders, minPrice, maxPrice) => {
            if (!orders) return [];
            return orders.filter((order) => {
                if (minPrice && order.total_price < parseFloat(minPrice)) return false;
                if (maxPrice && order.total_price > parseFloat(maxPrice)) return false;
                return true;
            });
        },

        searchOrders: (orders, query) => {
            if (!orders) return [];
            if (!query) return orders;

            const searchTerm = query.toLowerCase().trim();
            return orders.filter(
                (order) =>
                    order.order_by?.name?.toLowerCase().includes(searchTerm) ||
                    order._id.toLowerCase().includes(searchTerm) ||
                    order.address_shipping?.toLowerCase().includes(searchTerm) ||
                    order.products?.some((product) => product.name?.toLowerCase().includes(searchTerm)),
            );
        },

        getOrderStatusLabel: (status) => {
            const statusMap = {
                Processing: 'đang xử lý',
                Shipped: 'đang giao',
                Delivered: 'đã giao',
            };
            return statusMap[status] || status;
        },

        getOrderStatusColor: (status) => {
            const colorMap = {
                Processing: '#fbbf24', // amber-400
                Shipped: '#3b82f6', // blue-500
                Delivered: '#22c55e', // green-500
            };
            return colorMap[status] || '#6b7280'; // gray-500 default
        },
    },
};

export default orderApi;
