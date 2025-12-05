import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavUser from './NavUser';
import Nav from '../../Nav';
import OrderStatusFilter from './OrderStatusFilter';
import '../css/OrderCheck.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import orderApi from '../../../services/order';
import axiosInstance from '../../../services/api';
const OrderCheck = () => {
    const [selectedStatus, setSelectedStatus] = useState('Tất cả');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [orders, setOrders] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const ORDER_STATUS = {
        Processing: 'Chờ xác nhận/Thanh toán',
        confirmed: 'Chờ giao hàng', 
        Shipped: 'Đang vận chuyển',
        Delivered: 'Hoàn thành',
        Cancelled: 'Đã hủy',
        'Return Pending': 'Đang xử lý trả hàng',
        Returned: 'Trả hàng/Hoàn tiền',
    };
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        setCurrentUser(user);
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await orderApi.getUserOrders();
            if (Array.isArray(response)) {
                const formattedOrders = await Promise.all(response.map(async (order) => {
                    const productsWithReviews = await Promise.all(order.items.map(async (item) => {
                        try {
                            const productResponse = await axiosInstance.get(`/product/${item.product._id}`);
                            const product = productResponse.data;
                            
                            // Check if user has already reviewed
                            const hasReviewed = product.ratings?.some(
                                rating => rating.postedBy._id === currentUser?.infoUser?._id
                            );
    
                            return {
                                id: item.product._id,
                                name: item.product.name,
                                price: item.product.price,
                                image: item.product.thumbnail,
                                quantity: item.quantity,
                                reviewed: hasReviewed
                            };
                        } catch (err) {
                            console.error('Error fetching product:', err);
                            return {
                                ...item,
                                reviewed: false
                            };
                        }
                    }));
    
                    return {
                        orderId: order._id,
                        status: order.status,
                        products: productsWithReviews,
                        paymentMethod: order.payment_method,
                        shippingFee: order.shipping_fee || 30000,
                        discount: order.discount || 0,
                        appliedCoupon: order.coupon,
                    };
                }));
                setOrders(formattedOrders);
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Không thể tải danh sách đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser) {
            fetchOrders();
        }
    }, [currentUser]);

    useEffect(() => {
        if (location.state?.updatedOrder) {
            setOrders((prevOrders) =>
                Array.isArray(prevOrders)
                    ? prevOrders.map((order) => {
                          if (order?.orderId === location.state.updatedOrder?.orderId) {
                              // Ensure prices are properly formatted when saving
                              const formattedProducts = location.state.updatedOrder.products.map((product) => ({
                                  ...product,
                                  price: parsePriceToNumber(product.price),
                              }));
                              console("temp", formattedProducts);
                              return {
                                  ...location.state.updatedOrder,
                                  products: formattedProducts,
                                  reviewed: true
                              };
                          }
                          return order;
                      })
                    : [],
            );
        }
    }, [location.state]);

    const handleReview = (product) => {
        navigate('../product-review', { state: { product } });
    };

    const handleReturn = (order) => {
        if (!order?.orderId) {
            toast.error('Không thể tìm thấy mã đơn hàng');
            return;
        }
        navigate(`/user/return-refund/${order.orderId}`, {
            state: { order }
        });
    };

    const handleViewDetails = (orderId) => {
        navigate(`/user/order-details/${orderId}`);
    };

    const handleCancelOrder = (orderId) => {
        toast.warning(
            <div>
                <p>Bạn có chắc chắn muốn hủy đơn hàng này không?</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
                    <button
                        onClick={() => {
                            setOrders((prevOrders) =>
                                prevOrders.map((order) =>
                                    order.orderId === orderId ? { ...order, status: 'Đã hủy' } : order,
                                ),
                            );
                            toast.dismiss(); // Dismiss confirmation toast
                            toast.success('Đã hủy đơn hàng thành công', {
                                autoClose: 2000, // Auto close success message after 2s
                            });
                        }}
                        style={{
                            padding: '5px 10px',
                            backgroundColor: '#e74c3c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                    >
                        Xác nhận
                    </button>
                    <button
                        onClick={() => toast.dismiss()} // Dismiss on cancel
                        style={{
                            padding: '5px 10px',
                            backgroundColor: '#95a5a6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                    >
                        Hủy
                    </button>
                </div>
            </div>,
            {
                position: 'top-center',
                autoClose: false,
                hideProgressBar: false,
                closeOnClick: false,
                draggable: false,
                closeButton: false,
            },
        );
    };

    const getPaymentMethodName = (method) => {
        switch (method) {
            case 'cash':
                return 'Tiền mặt';
            case 'payment_online':
                return 'Thanh toán online';
            default:
                return 'Không xác định';
        }
    };

    const getStatusText = (status) => {
        return ORDER_STATUS[status] || ORDER_STATUS[status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()] || status;
    };
    const statusOptions = [
        'Tất cả',
        'Chờ xác nhận/Thanh toán',
        'Chờ giao hàng',
        'Đang vận chuyển', 
        'Hoàn thành',
        'Đã hủy',
        'Trả hàng/Hoàn tiền'
    ];
    const filteredOrders = React.useMemo(() => {
        if (!Array.isArray(orders)) return [];
        if (selectedStatus === 'Tất cả') return orders;
        
        // Find English status key from Vietnamese display text
        const statusKey = Object.keys(ORDER_STATUS).find(
            key => ORDER_STATUS[key] === selectedStatus
        );
        
        return orders.filter(order => order?.status === statusKey);
    }, [orders, selectedStatus]);
    const parsePriceToNumber = (price) => {
        if (!price) return 0;
        try {
            // Remove currency symbol and non-numeric characters
            const cleanPrice = String(price).replace(/[^\d.-]/g, '');
            return Number(cleanPrice) || 0;
        } catch (err) {
            console.error('Error parsing price:', err);
            return 0;
        }
    };

    // Add price formatting helper
    const formatPrice = (price) => {
        if (price == null || isNaN(price)) return '0 VND';
        try {
            // Always convert to number first
            const numericPrice = typeof price === 'string' ? Number(price.replace(/[^\d.-]/g, '')) : Number(price);
            return `${numericPrice.toLocaleString('vi-VN')} VND`;
        } catch (err) {
            console.error('Error formatting price:', err);
            return '0 VND';
        }
    };
    const calculateProductTotal = (price, quantity) => {
        if (!price || !quantity) return 0;
        try {
            const numericPrice = typeof price === 'string' ? Number(price.replace(/[^\d.-]/g, '')) : Number(price);
            const numericQuantity = Number(quantity);
            return numericPrice * numericQuantity;
        } catch (err) {
            console.error('Error calculating product total:', err);
            return 0;
        }
    };
    const calculateOrderTotal = (products) => {
        if (!Array.isArray(products)) return 0;
        return products.reduce((total, product) => {
            if (!product?.price || !product?.quantity) return total;
            const productTotal = calculateProductTotal(product.price, product.quantity);
            return total + productTotal;
        }, 0);
    };
    const hasReviewedProducts = (order) => {
        if (!order || !order.products) {
            return false;
        } 
        return order.products.some((product) => product.reviewed);
    };
    return (
        <div>
            <Nav />
            <div className="order-check-container-oc">
                <OrderStatusFilter selectedStatus={selectedStatus} onSelectStatus={setSelectedStatus} />
                {loading ? (
                    <p>Đang tải...</p>
                ) : error ? (
                    <p>Lỗi: {error}</p>
                ) : !Array.isArray(filteredOrders) || filteredOrders.length === 0 ? (
                    <p>Không có đơn hàng</p>
                ) : (
                    filteredOrders
                        .map((order) => {
                            if (!order?.products || !Array.isArray(order.products)) {
                                return null;
                            }

                            const orderTotal = calculateOrderTotal(order.products);
                            const SHIPPING_FEE = 30000;
                            return (
                                <div key={order?.orderId || Math.random()} className="order-oc">
                                    <div className="order-header-oc">
                                        <h2>Mã đơn hàng: {order.orderId}</h2>
                                        <span className="order-status-oc">{getStatusText(order.status)}</span>
                                    </div>
                                    <table className="order-table-oc">
                                        <thead>
                                            <tr>
                                                <th>Hình ảnh</th>
                                                <th>Tên sản phẩm</th>
                                                <th>Đơn giá</th>
                                                <th>Số lượng</th>
                                                <th>Số tiền</th>
                                                <th>Đánh giá</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.products.map((product) => (
                                                <tr key={product?.id || Math.random()}>
                                                    <td>
                                                        <img
                                                            src={product?.image}
                                                            alt={product?.name || 'Product'}
                                                            className="order-image-oc"
                                                        />
                                                    </td>
                                                    <td>{product?.name || 'N/A'}</td>
                                                    <td>{formatPrice(product?.price)}</td>
                                                    <td>{product?.quantity || 0}</td>
                                                    <td>
                                                        {formatPrice(
                                                            calculateProductTotal(product?.price, product?.quantity),
                                                        )}
                                                    </td>
                                                    <td>
                                                        {order.status === 'Delivered' ? (
                                                            product?.reviewed ? (

                                                                <span>Đã đánh giá</span>
                                                            ) : (
                                                                <button
                                                                    className="review-button-oc"
                                                                    onClick={() => handleReview(product)}
                                                                    disabled={!product}
                                                                >
                                                                    Đánh giá
                                                                </button>
                                                            )
                                                        ) : (
                                                            <span>Chưa hoàn thành</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td colSpan="4" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                                    Tạm tính:
                                                </td>
                                                <td style={{ fontWeight: 'bold' }}>
                                                    {formatPrice(calculateOrderTotal(order.products))}
                                                </td>
                                                <td></td>
                                            </tr>
                                            {order.discount > 0 && (
                                                <tr className="discount-row-oc">
                                                    <td colSpan="4" style={{ textAlign: 'right', color: '#e74c3c' }}>
                                                        Giảm giá:
                                                    </td>
                                                    <td style={{ color: '#e74c3c' }}>-{formatPrice(order.discount)}</td>
                                                    <td></td>
                                                </tr>
                                            )}
                                            <tr className="shipping-row">
                                                <td colSpan="4" style={{ textAlign: 'right' }}>
                                                    Phí vận chuyển:
                                                </td>
                                                <td>{formatPrice(order.shippingFee || SHIPPING_FEE)}</td>
                                                <td></td>
                                            </tr>
                                            <tr className="final-total-row-oc">
                                                <td colSpan="4" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                                    Tổng thanh toán:
                                                </td>
                                                <td style={{ fontWeight: 'bold', color: '#336633' }}>
                                                    {formatPrice(
                                                        calculateOrderTotal(order.products) -
                                                            (order.discount || 0) +
                                                            (order.shippingFee || SHIPPING_FEE),
                                                    )}
                                                </td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className="order-actions-oc">
                                        <div className="order-actions-top-oc">
                                            <button
                                                className="details-button-oc"
                                                onClick={() => handleViewDetails(order.orderId)}
                                            >
                                                <i className="fas fa-eye"></i>
                                                Xem chi tiết
                                            </button>
                                            <span className="payment-method-oc">
                                                Phương thức thanh toán: {getPaymentMethodName(order.paymentMethod)}
                                            </span>
                                        </div>

                                        <div className="order-actions-bottom-oc">
                                        <button
                                            className={`return-button-oc ${
                                                order.status === 'Trả hàng/Hoàn tiền' ? 'active' : ''
                                            }`}
                                            onClick={() => handleReturn(order)}
                                            disabled={
                                                order.status !== 'Delivered' || // Only enable for Delivered status
                                                order.status === 'Đã hủy' ||
                                                order.status === 'Trả hàng/Hoàn tiền'
                                            }
                                            style={{
                                                backgroundColor:
                                                    order.status === 'Trả hàng/Hoàn tiền' ? '#e74c3c' : '',
                                                opacity: order.status !== 'Delivered' ? 0.5 : 1
                                            }}
                                        >
                                            <i className="fas fa-undo"></i>
                                            {order.status === 'Trả hàng/Hoàn tiền'
                                                ? 'Đã gửi yêu cầu trả hàng'
                                                : 'Trả hàng/Hoàn tiền'}
                                        </button>

                                        <button
                                            className={`cancel-button-oc ${
                                                order.status === 'Đã hủy' ? 'active' : ''
                                            }`}
                                            onClick={() => handleCancelOrder(order.orderId)}
                                            disabled={
                                                order.status !== 'Processing' || // Only enable for Processing status
                                                order.status === 'Đã hủy'
                                            }
                                            style={{
                                                backgroundColor: order.status === 'Đã hủy' ? '#e74c3c' : '',
                                                opacity: order.status !== 'Processing' ? 0.5 : 1
                                            }}
                                        >
                                            <i className="fas fa-times"></i>
                                            Hủy đơn hàng
                                        </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                        .filter(Boolean)
                )}
            </div>
            <ToastContainer />
        </div>
    );
};

export default OrderCheck;