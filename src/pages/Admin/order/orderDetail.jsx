import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import orderApi from '../../../services/order';
import createNotification from '../../../services/createNotification';
import useOrders from './handleOrder';
import './orderDetail.css';

const OrderDetail = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [order, setOrder] = useState(null);

    useEffect(() => {
        fetchOrderDetail();
    }, [id]);

    const fetchOrderDetail = async () => {
        try {
            setLoading(true);
            const response = await orderApi.getOrderById(id);
            if (response && response._id) {
                setOrder(response);
            } else {
                setError('Không tìm thấy đơn hàng');
            }
        } catch (err) {
            setError('Không thể tải thông tin đơn hàng');
            console.error('Error fetching order details:', err);
        } finally {
            setLoading(false);
        }
    };
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
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

    const handleStatusChange = async (newStatus) => {
        try {
            const response = await orderApi.updateOrderStatus(id, newStatus);
            if (response.success) {
                const status = {
                    processing: 'đang xử lý',
                    confirmed: 'đã được xác nhận',
                    cancelled: 'đã bị hủy',
                    shipping: 'đang được giao',
                    delivered: 'đã giao thành công',
                };
                const data = {
                    selectedUsers: [order.order_by._id],
                    title: 'Trạng thái đơn hàng',
                    content: `Đơn hàng của bạn ${status[newStatus]}`,
                    type: newStatus,
                    toUrl: `/user/order-details/${id}`,
                };
                await createNotification.createNotification(data);
                setOrder({ ...order, status: newStatus });
                await fetchOrderDetail();
            }
        } catch (err) {
            console.error('Error updating order status:', err);
        }
    };

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div>Lỗi: {error}</div>;
    if (!order) return <div>Không tìm thấy đơn hàng</div>;

    return (
        <div className="order-detail-container">
            <div className="order-detail-content">
                <div className="left-column">
                    <section className="customer-info">
                        <h3>Thông tin khách hàng</h3>
                        <div className="info-group">
                            <label>Tên khách hàng</label>
                            <div className="info-value">{order.order_by?.fullName}</div>
                        </div>
                        <div className="info-group">
                            <label>Email</label>
                            <div className="info-value">{order.order_by?.email}</div>
                        </div>
                        <div className="info-group">
                            <label>Số điện thoại</label>
                            <div className="info-value">{order.order_by?.phone}</div>
                        </div>
                        <div className="info-group">
                            <label>Địa chỉ giao hàng</label>
                            <div className="info-value">{order.address_shipping}</div>
                        </div>
                    </section>

                    <section className="order-items">
                        <h3>Thông tin sản phẩm đặt mua</h3>
                        <div className="items-list">
                            {order.items?.map((item, index) => (
                                <div key={index} className="item-card">
                                    <div className="item-info">
                                        <div className="item-details">
                                            <span className="item-name">{item.product?.name}</span>
                                            <span className="item-quantity">Số lượng: {item.quantity}</span>
                                        </div>
                                    </div>
                                    <div className="item-price">
                                        {orderApi.helpers.formatCurrency(item.product?.price * item.quantity)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="order-summary">
                        <h3>Tóm tắt đơn hàng</h3>
                        <div className="summary-row">
                            <span>Tổng tiền hàng</span>
                            <span>{orderApi.helpers.formatCurrency(order.total_price)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Thời gian đặt hàng</span>
                            <span>{formatDate(order.date_order)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Phương thức thanh toán</span>
                            <span>{order.payment_method || 'COD'}</span>
                        </div>
                    </section>
                </div>

                <div className="right-column">
                    <div className="order-detail-header">
                        <div className="status-section">
                            <div className="status-label">
                                <span>Trạng thái</span>
                                <div className="status-group">
                                    <span>Trạng thái đơn hàng</span>
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(e.target.value)}
                                        className="status-select"
                                    >
                                        <option value="processing">Đang xử lý</option>
                                        <option value="confirmed">Đã xác nhận</option>
                                        <option value="shipping">Đang giao hàng</option>
                                        <option value="delivered">Đã giao</option>
                                        <option value="cancelled">Đã hủy</option>
                                    </select>
                                </div>
                            </div>
                            <div className={`status-badge ${order.status?.toLowerCase()}`}>
                                {orderApi.helpers.getOrderStatusLabel(order.status)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
