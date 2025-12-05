import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import orderApi from '../../../services/order';
import userService from '../../../services/customerManager';
import Swal from 'sweetalert2';

export const STATUS_FILTERS = [
    { label: 'tất cả', value: 'tất cả' },
    { label: 'đang xử lý', value: 'Processing' },
    { label: 'xác nhận', value: 'Confirmed' },
    { label: 'đang giao', value: 'Shipped' },
    { label: 'đã giao', value: 'Delivered' },
    // { label: 'đang chờ trả hàng', value: 'Return Pending' },
    { label: 'đã hủy', value: 'Cancelled' },
];

export const CATEGORY_FILTERS = [
    { label: 'tất cả', value: 'tất cả' },
    { label: 'Laptop', value: 'Laptop' },
    { label: 'TV', value: 'TV' },
    { label: 'Điện thoại', value: 'Phone' },
    { label: 'Đồng hồ', value: 'Watch' },
    { label: 'Máy ảnh', value: 'Camera' },
    { label: 'PC', value: 'PC' },
    { label: 'Màn hình', value: 'Monitor' },
];

export const TABS = [
    { id: 'thông tin chung', label: 'thông tin chung' },
    { id: 'yêu cầu trả hàng', label: 'yêu cầu trả hàng' },
];

export const useOrders = () => {
    const navigate = useNavigate();

    // Order States
    const [activeTab, setActiveTab] = useState('thông tin chung');
    const [activeStatusFilter, setActiveStatusFilter] = useState('tất cả');
    const [activeCategoryFilter, setActiveCategoryFilter] = useState('tất cả');
    const [searchQuery, setSearchQuery] = useState('');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [showFilters, setShowFilters] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // User States
    const [userDetails, setUserDetails] = useState({});
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [activePopup, setActivePopup] = useState(null);
    const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

    // Fetch user details
    const fetchUserDetails = async (orders) => {
        setLoadingUsers(true);
        const userDetailsMap = {};

        try {
            const uniqueUserIds = [...new Set(orders.map((order) => order.order_by))];
            const userDetailsPromises = uniqueUserIds.map((userId) => userService.getUserDetail(userId));
            const userDetails = await Promise.all(userDetailsPromises);

            userDetails.forEach((detail, index) => {
                if (detail) {
                    userDetailsMap[uniqueUserIds[index]] = detail.fullname;
                }
            });
        } catch (error) {
            console.error('Error fetching user details:', error);
        }

        setUserDetails(userDetailsMap);
        setLoadingUsers(false);
    };

    // Fetch orders
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await orderApi.getAllOrders();
            if (response.success) {
                setOrders(response.orders);
                setError(null);
            } else {
                setError('Không thể tải danh sách đơn hàng');
            }
        } catch (error) {
            setError(error.message);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: error.message || 'Không thể tải danh sách đơn hàng',
            });
        } finally {
            setLoading(false);
        }
    };

    // Search handler
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    // User hover handler
    const handleUserHover = (userId, event) => {
        const rect = event.target.getBoundingClientRect();
        setPopupPosition({
            top: rect.bottom + window.scrollY + 5,
            left: rect.left + window.scrollX,
        });
        setActivePopup(userId);
    };

    // Navigation handlers
    const handleViewOrder = async (orderId) => {
        setLoading(true);
        try {
            const orderData = await orderApi.getOrderById(orderId);
            if (orderData) {
                setSelectedOrder(orderData);
                navigate(`/admin/orders/${orderId}`);
            } else {
                throw new Error('No order data found');
            }
        } catch (error) {
            console.error('Error fetching order:', error);
            const errorMessage = error.response?.data?.message || 'Không thể tải thông tin đơn hàng';
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    };

    // Update order status
    const handleUpdateStatus = async (orderId, status) => {
        try {
            await orderApi.updateOrderStatus(orderId, status);
            await fetchOrders();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: error.message || 'Không thể cập nhật trạng thái đơn hàng',
            });
        }
    };

    // Filter functions using API helpers
    const filterOrders = (ordersToFilter) => {
        if (!ordersToFilter) return [];

        let filtered = orderApi.helpers.filterByStatus(ordersToFilter, activeStatusFilter);
        if (activeStatusFilter === 'tất cả') {
            filtered = filtered.filter((order) => order.status !== 'Return Pending');
        }

        filtered = orderApi.helpers.filterByDateRange(filtered, startDate, endDate);
        filtered = orderApi.helpers.filterByPriceRange(filtered, priceRange.min, priceRange.max);

        if (activeCategoryFilter !== 'tất cả') {
            filtered = filtered.filter((order) =>
                order.products?.some((product) => product.productType === activeCategoryFilter),
            );
        }

        return filtered;
    };

    // Search function using API helper
    const searchOrders = (filteredOrders) => {
        return orderApi.helpers.searchOrders(filteredOrders, searchQuery);
    };

    const resetFilters = () => {
        setActiveStatusFilter('tất cả');
        setActiveCategoryFilter('tất cả');
        setStartDate('');
        setEndDate('');
        setPriceRange({ min: '', max: '' });
        setSearchQuery('');
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return {
        states: {
            activeTab,
            activeStatusFilter,
            activeCategoryFilter,
            searchQuery,
            orders,
            loading,
            error,
            startDate,
            endDate,
            priceRange,
            showFilters,
            userDetails,
            loadingUsers,
            activePopup,
            popupPosition,
        },
        setters: {
            setActiveTab,
            setActiveStatusFilter,
            setActiveCategoryFilter,
            setStartDate,
            setEndDate,
            setPriceRange,
            setShowFilters,
            setSearchQuery,
            setActivePopup,
            setPopupPosition,
        },
        handlers: {
            fetchOrders,
            handleSearch,
            handleViewOrder,
            handleUpdateStatus,
            handleUserHover,
            filterOrders,
            searchOrders,
            resetFilters,
            fetchUserDetails,
        },
    };
};

export default useOrders;
