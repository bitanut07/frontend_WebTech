import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import userService from '../../../services/customerManager';
import Swal from 'sweetalert2';
import './cusProfile.css';

const CustomerDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [customerInfo, setCustomerInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [orderStats, setOrderStats] = useState({
        total: 0,
        processing: 0,
        delivered: 0,
    });

    useEffect(() => {
        const fetchCustomerDetails = async () => {
            try {
                const userResponse = await userService.getUserDetail(id);
                console.log('User Response:', userResponse);
                if (userResponse?.user) {
                    setCustomerInfo(userResponse.user);
                }
            } catch (err) {
                console.error('Error fetching customer details:', err);
                setError(err);
            }
        };

        const fetchOrderCustomer = async () => {
            try {
                const ordersResponse = await userService.getUserOrders(id);
                console.log('Orders Response:', ordersResponse);

                // Kiểm tra success và đảm bảo orders là array
                if (ordersResponse?.success && Array.isArray(ordersResponse.orders)) {
                    setCustomerInfo((prev) => ({
                        ...prev,
                        orders: ordersResponse.orders,
                    }));

                    // Cập nhật order stats
                    setOrderStats({
                        total: ordersResponse.orders.length,
                        processing: ordersResponse.orders.filter(
                            (order) => order.status === 'Processing' || order.status === 'Pending',
                        ).length,
                        delivered: ordersResponse.orders.filter((order) => order.status === 'Delivered').length,
                    });
                } else {
                    // Nếu không có đơn hàng hoặc lỗi, set orders là mảng rỗng
                    setCustomerInfo((prev) => ({
                        ...prev,
                        orders: [],
                    }));
                }
            } catch (err) {
                console.error('Error fetching orders:', err);
                // Trong trường hợp lỗi, cũng set orders là mảng rỗng
                setCustomerInfo((prev) => ({
                    ...prev,
                    orders: [],
                }));
            } finally {
                setLoading(false);
            }
        };

        const loadData = async () => {
            await fetchCustomerDetails();
            await fetchOrderCustomer();
        };

        loadData();
    }, [id]);

    const handleBlockUser = async () => {
        try {
            const response = await userService.blockUser(id);
            if (response) {
                setCustomerInfo((prev) => ({
                    ...prev,
                    isBlock: !prev.isBlock,
                }));

                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: customerInfo.isBlock ? 'Đã mở khóa tài khoản' : 'Đã khóa tài khoản',
                });

                // Re-fetch to ensure sync with server
                const updatedUser = await userService.getUserDetail(id);
                if (updatedUser?.user) {
                    setCustomerInfo(updatedUser.user);
                }
            }
        } catch (err) {
            console.error('Error blocking/unblocking user:', err);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Không thể thay đổi trạng thái người dùng',
            });
        }
    };

    if (loading) return <div className="loading">Đang tải...</div>;
    if (!customerInfo) return <div className="error">Không tìm thấy thông tin khách hàng</div>;

    return (
        <div className="customer-detail">
            <div className="customer-grid">
                <div className="profile-card">
                    <div className="profile-header">
                        <div className="avatar-container">
                            {customerInfo.avatar ? (
                                <img src={customerInfo.avatar} alt="Avatar" />
                            ) : (
                                <div className="avatar-placeholder" />
                            )}
                        </div>
                        <h2 className="customer-name">{customerInfo.fullName || 'Chưa cập nhật'}</h2>
                        <span className={`status-badge ${customerInfo.isBlock ? 'status-blocked' : 'status-active'}`}>
                            {customerInfo.isBlock ? 'Đã khóa' : 'Hoạt động'}
                        </span>
                    </div>

                    <div className="info-list">
                        <div className="info-item">
                            <span className="info-label">ID:</span>
                            <span className="info-value">{customerInfo._id}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">E-mail:</span>
                            <span className="info-value">{customerInfo.email}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Địa chỉ:</span>
                            <span className="info-value">{customerInfo.address?.[0] || 'Chưa cập nhật'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Số điện thoại:</span>
                            <span className="info-value">{customerInfo.phone || 'Chưa cập nhật'}</span>
                        </div>
                    </div>

                    <button
                        onClick={handleBlockUser}
                        className={`block-button ${customerInfo.isBlock ? 'unblock' : 'block'}`}
                    >
                        {customerInfo.isBlock ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                    </button>
                </div>

                <div className="order-section">
                    <div className="stats-card">
                        <div className="stats-grid">
                            <div className="stat-item">
                                <div className="stat-value">{orderStats.total}</div>
                                <div className="stat-label">đơn hàng</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-value processing">{orderStats.processing}</div>
                                <div className="stat-label">đang giao</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-value delivered">{orderStats.delivered}</div>
                                <div className="stat-label">đã giao</div>
                            </div>
                        </div>
                    </div>

                    <div className="history-card">
                        <div className="history-header">
                            <h3 className="history-title">Lịch sử đơn hàng</h3>
                        </div>

                        {!customerInfo.orders?.length ? (
                            <div className="no-orders">Không có đơn hàng nào</div>
                        ) : (
                            <div className="table-container">
                                <table className="order-table">
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Trạng thái</th>
                                            <th>Ngày</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customerInfo.orders.map((order) => (
                                            <tr key={order._id}>
                                                <td>
                                                    <Link to={`/admin/orders/${order._id}`} className="order-link">
                                                        {order._id}
                                                    </Link>
                                                </td>
                                                <td>
                                                    <span
                                                        className={`order-status status-${
                                                            order.status === 'Delivered'
                                                                ? 'delivered'
                                                                : order.status === 'Processing'
                                                                ? 'processing'
                                                                : 'pending'
                                                        }`}
                                                    >
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td>{new Date(order.date_order).toLocaleDateString('vi-VN')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDetail;
