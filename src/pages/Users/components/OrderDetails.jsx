import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../css/OrderDetails.css';
import { FaBox, FaTruck, FaCheck } from 'react-icons/fa';
import { FaTimesCircle } from 'react-icons/fa';
import Nav from '../../Nav';
import orderApi from '../../../services/order';

const OrderDetails = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                setLoading(true);
                const response = await orderApi.getOrderById(orderId);
                console.log('API Response:', response); // Debug log

                if (response) {  // Changed from response.order to response
                    const orderData = {
                        orderId: response._id,
                        status: response.status,  
                        orderDate: response.date_order,
                        products: response.items.map(item => ({
                            id: item.product._id,
                            name: item.product.name,
                            price: item.price,
                            quantity: item.quantity,
                            image: item.product.listImage?.[0] || '' 
                        })),
                        fullname: response.info_receive.name,
                        phone: response.info_receive.phone,
                        address: response.info_receive.address,
                        paymentMethod: response.payment_method,
                        shippingFee: response.shipping_fee || 30000,
                        discount: response.discount || 0,
                        appliedCoupon: response.coupon || null
                    };
                    
                    console.log('Processed order data:', orderData);
                    setOrder(orderData);
                } else {
                    setError('Không tìm thấy thông tin đơn hàng');
                }
            } catch (err) {
                console.error('Error fetching order:', err);
                setError('Không thể tải thông tin đơn hàng');
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

    const formatPrice = (price) => {
        if (!price) return '0 VND';
        // Handle string prices
        const numericPrice = typeof price === 'string' 
            ? Number(price.replace(/[^\d]/g, ''))
            : price;
        
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(numericPrice);
    };

    const getStatusStep = (status) => {
        switch (status) {
            case 'Processing':
                return 1; // Chờ xác nhận/Thanh toán
            case 'Confirmed':
                return 2; // Chờ giao hàng
            case 'Shipped':
                return 3; // Đang vận chuyển
            case 'Delivered':
                return 4; // Hoàn thành
            case 'Cancelled':
            case 'Refunded':
                return 0; // Đã hủy hoặc Trả hàng/Hoàn tiền
            default:
                return 0;
        }
    };

    const calculateTotal = (products) => {
        if (!Array.isArray(products)) return 0;
        return products.reduce((sum, product) => {
            const price = typeof product.price === 'string'
                ? Number(product.price.replace(/[^\d]/g, ''))
                : product.price;
            return sum + (price * product.quantity);
        }, 0);
    };

    if (!order) {
        return (
            <>
                <Nav />
                <div className="order-details-od">
                    <div className="not-found">
                        <h2>Không tìm thấy đơn hàng</h2>
                        <Link to="/user/order-check" className="back-btn-od">
                            ← Quay lại danh sách đơn hàng
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    const handleConfirmOrder = async () => {
        try {
            await orderApi.updateOrderStatus(orderId, 'Delivered');
            setOrder((prev) => ({
                ...prev,
                status: 'Delivered',
                isConfirmed: true,
            }));
            setShowConfirmModal(false);
        } catch (error) {
            console.error('Error confirming order:', error);
        }
    };

    const discount = order.discount || 0;
    const subtotal = calculateTotal(order.products);
    const shippingFee = 30000; // Default shipping fee
    const total = subtotal - discount + shippingFee;
    const currentStep = getStatusStep(order.status);
    const getStatusDisplay = (status) => {
        const STATUS_MAP = {
            Processing: 'Chờ xác nhận/Thanh toán',
            Confirmed: 'Chờ giao hàng',
            Shipped: 'Đang vận chuyển',
            Delivered: 'Hoàn thành',
            Cancelled: 'Đã hủy',
            Refunded: 'Trả hàng/Hoàn tiền'
        };
        return STATUS_MAP[status] || status;
    };

    return (
        <>
            <Nav />
            <div className="order-details-od">
                <div className="order-header-od">
                    <h2>Chi tiết đơn hàng #{order.orderId}</h2>
                    <div className="order-status-details-od">
                        <div className={`status-step-od ${currentStep >= 1 ? 'active' : ''}`}>
                            <FaBox />
                            <span>Chờ xác nhận/Thanh toán</span>
                        </div>
                        <div className={`status-step-od ${currentStep >= 2 ? 'active' : ''}`}>
                            <FaBox />
                            <span>Chờ giao hàng</span>
                        </div>
                        <div className={`status-step-od ${currentStep >= 3 ? 'active' : ''}`}>
                            <FaTruck />
                            <span>Đang vận chuyển</span>
                        </div>
                        <div className={`status-step-od ${currentStep >= 4 ? 'active' : ''}`}>
                            <FaCheck />
                            <span>Hoàn thành</span>
                        </div>
                    </div>
                </div>

                <div className="order-info-od">
                    <div className="info-section-od">
                        <h3>Thông tin đơn hàng</h3>
                        <p>Ngày đặt: {new Date(order.orderDate || Date.now()).toLocaleDateString('vi-VN')}</p>
                        <p>Trạng thái: {getStatusDisplay(order.status) || 'Đang xử lý'}</p>
                        <p>Phương thức thanh toán: {order.paymentMethod || 'Chưa xác định'}</p>
                    </div>

                    <div className="info-section-od">
                        <h3>Địa chỉ giao hàng</h3>
                        <p>Họ và tên: {order.fullname || 'Chưa cung cấp'}</p>
                        <p>Địa chỉ: {order.address || 'Chưa cung cấp'}</p>
                        <p>Số điện thoại: {order.phone || 'Chưa cung cấp'}</p>
                    </div>
                </div>

                <div className="order-items-od">
                    <h3>Sản phẩm</h3>
                    <table className="products-table-od">
                        <thead>
                            <tr>
                                <th>Hình ảnh</th>
                                <th>Tên sản phẩm</th>
                                <th>Số lượng</th>
                                <th>Đơn giá</th>
                                <th>Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(order.products) && order.products.map((product) => (
                                <tr key={product.id}>
                                    <td className="image-cell-od">
                                        <img src={product.image} alt={product.name} />
                                    </td>
                                    <td className="name-cell-od">{product.name}</td>
                                    <td className="quantity-cell-od">{product.quantity}</td>
                                    <td className="price-cell-od">{formatPrice(product.price)}</td>
                                    <td className="total-cell-od">
                                        {formatPrice(
                                            typeof product.price === 'string'
                                                ? Number(product.price.replace(/[^\d]/g, '')) * product.quantity
                                                : product.price * product.quantity
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="order-summary-od">
                    <div className="order-summary-od">
                        <div className="summary-row-od">
                            <span>Tạm tính:</span>
                            <span>{formatPrice(subtotal)}</span>
                        </div>
                        <div className="summary-row-od discount">
                            <span>Số tiền được giảm:</span>
                            <span className="discount-amount-od">
                                -{formatPrice(order.discount)}
                            </span>
                        </div>
                        <div className="summary-row-od">
                            <span>Phí vận chuyển:</span>
                            <span>{formatPrice(shippingFee)}</span>
                        </div>
                        <div className="summary-row-od total">
                            <span>Tổng thanh toán:</span>
                            <span>{formatPrice(total)}</span>
                        </div>
                        </div>
                        <div className="order-confirmation-section-od">
                            {order.status !== 'Hoàn thành' && order.status !== 'Đã hủy' && (
                                <button className="confirm-delivery-btn-od" onClick={() => setShowConfirmModal(true)}>
                                    Xác nhận đã nhận hàng
                                </button>
                            )}
                        </div>
                    {showConfirmModal && (
                        <div className="modal-overlay-od">
                            <div className="modal-content-od">
                                <div className="modal-header-od">
                                    <h3>Xác nhận đơn hàng</h3>
                                    <FaTimesCircle
                                        className="close-modal-od"
                                        onClick={() => setShowConfirmModal(false)}
                                    />
                                </div>
                                <p>Bạn xác nhận đã nhận được đơn hàng này?</p>
                                <div className="modal-actions-od">
                                    <button className="confirm-btn-od" onClick={handleConfirmOrder}>
                                        Xác nhận
                                    </button>
                                    <button className="cancel-btn-od" onClick={() => setShowConfirmModal(false)}>
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <Link to="/user/order-check" className="back-btn-od">
                    ← Quay lại danh sách đơn hàng
                </Link>
            </div>
        </>
    );
};

export default OrderDetails;