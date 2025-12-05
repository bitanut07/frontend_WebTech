import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import orderApi from '../../../services/order';
import Swal from 'sweetalert2';
import userService from '../../../services/customerManager';

// Hook implementation
const useOrderForm = () => {
    const navigate = useNavigate();
    const { id: orderId } = useParams();

    const [orderForm, setOrderForm] = useState({
        id: '',
        date_order: '',
        items: [],
        order_by: null,
        status: '',
        status_order: '',
        total_price: 0,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchOrderDetails = async () => {
        if (!orderId) return;

        setLoading(true);
        try {
            const response = await orderApi.getOrderById(orderId);
            if (response) {
                setOrderForm({
                    id: response._id,
                    date_order: response.date_order,
                    items: response.items.map((item) => ({
                        _id: item._id,
                        product: item.product,
                        quantity: item.quantity,
                    })),
                    order_by: response.order_by,
                    status: response.status,
                    status_order: response.status_order,
                    total_price: response.total_price,
                });
            }
        } catch (err) {
            setError(err.message);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: err.message || 'Không thể tải thông tin đơn hàng',
            });
        } finally {
            setLoading(false);
        }
    };

    const UserProfilePopup = ({ userId, position }) => {
        const [userData, setUserData] = useState(null);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const fetchUserData = async () => {
                try {
                    const data = await userService.getUserDetail(userId);
                    setUserData(data);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                } finally {
                    setLoading(false);
                }
            };

            if (userId) {
                fetchUserData();
            }
        }, [userId]);

        if (!userId) return null;

        if (loading) {
            return (
                <div className="user-popup loading" style={position}>
                    Loading...
                </div>
            );
        }

        return (
            <div className="user-popup" style={position}>
                <div className="user-popup-content">
                    <h3>{userData?.fullname || 'N/A'}</h3>
                    <p>Email: {userData?.email || 'N/A'}</p>
                    <p>Phone: {userData?.phone || 'N/A'}</p>
                    <p>Address: {userData?.address || 'N/A'}</p>
                </div>
            </div>
        );
    };

    const handleUpdateOrder = async (e) => {
        if (e) e.preventDefault();

        setLoading(true);
        try {
            // Only update the status since that's what we need
            await orderApi.updateOrderStatus(orderId, orderForm.status);

            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Cập nhật trạng thái đơn hàng thành công',
            });

            navigate('/admin/orders');
        } catch (err) {
            setError(err.message);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: err.message || 'Không thể cập nhật đơn hàng',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin/orders');
    };

    const handleStatusChange = (newStatus) => {
        setOrderForm((prev) => ({
            ...prev,
            status: newStatus,
            status_order: newStatus,
        }));
    };
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';

        try {
            const date = new Date(dateString);

            // Check if date is valid
            if (isNaN(date.getTime())) return 'N/A';

            return date.toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'N/A';
        }
    };
    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    return {
        states: {
            orderForm,
            loading,
            error,
        },
        handlers: {
            handleUpdateOrder,
            handleCancel,
            handleStatusChange,
        },
        utils: {
            formatDate, // Expose formatDate through utils
        },
        components: {
            UserProfilePopup,
        },
    };
};

export default useOrderForm;
