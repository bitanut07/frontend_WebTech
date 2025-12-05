import React, { useState, useContext, useEffect } from 'react';
import NavUser from './NavUser';
import PaymentModal from './PaymentModal';
import { useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from '../../../context/CartContext';
import '../css/PurchasePage.css';
import Nav from '../../Nav';
import { getCoupons } from '../../../services/coupon';
import orderApi from '../../../services/order';
import { toast } from 'react-toastify';

const Purchasing = () => {
    const [deliveryOption, setDeliveryOption] = useState(false);
    const [pickupOption, setPickupOption] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const location = useLocation();
    const selectedProducts = location.state?.selectedProducts || [];
    const { clearCart } = useContext(CartContext);
    const [useDefaultAddress, setUseDefaultAddress] = useState(false);
    const [useCustomAddress, setUseCustomAddress] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [coupons, setCoupons] = useState([]);

    const locations = {
        'Hồ Chí Minh': ['Quận 1', 'Quận 3', 'Quận 7', 'Bình Thạnh'],
        'Hà Nội': ['Hoàn Kiếm', 'Ba Đình', 'Hai Bà Trưng', 'Đống Đa'],
        'Đà Nẵng': ['Hải Châu', 'Sơn Trà', 'Ngũ Hành Sơn', 'Liên Chiểu'],
        'Cần Thơ': ['Ninh Kiều', 'Bình Thủy', 'Cái Răng', 'Phong Điền'],
    };
    const ORDER_STATUS = {
        PROCESSING: 'Processing'
      };
      
    const [province, setProvince] = useState(''); // Tỉnh/Thành phố
    const [district, setDistrict] = useState(''); // Quận/Huyện
    const [availableDistricts, setAvailableDistricts] = useState([]); // Danh sách Quận/Huyện tương ứng
    const [fullname, setFullname] = useState('');
    const [phone, setPhone] = useState('');

    const [note, setNote] = useState('');
    const [address, setAddress] = useState('');
    const [showCouponModal, setShowCouponModal] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };
    const handleProvinceChange = (selectedProvince) => {
        setProvince(selectedProvince);
        setDistrict(''); // Reset quận/huyện khi tỉnh/thành phố thay đổi
        setAvailableDistricts(locations[selectedProvince] || []); // Cập nhật danh sách quận/huyện
    };

    const validateFields = () => {
        const newErrors = {};
        if (!fullname) newErrors.fullname = 'Họ tên không được bỏ trống';
        if (!phone) newErrors.phone = 'Số điện thoại không được bỏ trống';
        if (deliveryOption) {
            if (!province) newErrors.province = 'Tỉnh/Thành phố không được bỏ trống';
            if (!district) newErrors.district = 'Quận/Huyện không được bỏ trống';
            if (!address) newErrors.address = 'Địa chỉ cụ thể không được bỏ trống';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleConfirmPurchase = () => {
        if (validateFields()) {
            setIsPaymentModalOpen(true);
        }
    };

    const closePaymentModal = () => {
        setIsPaymentModalOpen(false);
    };

    const handleConfirmPayment = async (paymentMethod) => {
        try {
            const formattedProducts = selectedProducts.map((product) => ({
                id: product.id,
                quantity: Number(product.quantity),
                price: Number(String(product.price).replace(/[^0-9.-]+/g, '')),
            }));

            const orderData = {
                name: fullname,
                phone: phone,
                address: useDefaultAddress ? userProfile.address : `${address}, ${district}, ${province}`,
                note: note,
                items: formattedProducts,
                totalAmount: calculateTotal(),
                paymentMethod: paymentMethod,
                shippingFee: 30000,
                discount: calculateDiscount(calculateTotal()),
                status: ORDER_STATUS.PROCESSING,
                coupon: appliedCoupon ? {
                    name: appliedCoupon.name,
                    discount: appliedCoupon.discount
                } : null
            };
            if (paymentMethod == 'payment_online') {
                if (calculateTotal() > 50000000) {
                    toast.error('Số tiền quá lớn để thanh toán online!');
                    return;
                }
                const response = await orderApi.paymentOrder(orderData);
                if (response.data.resultCode == 0) {
                    window.location.href = response.data.payUrl;
                    return;
                } else {
                    toast.error('Khởi tạo thanh toán thất bại');
                    return;
                }
            }
            const response = await orderApi.createOrder(orderData);

            if (response.success) {
                clearCart();
                toast.success('Đặt hàng thành công!');
                navigate('../order-check');
            } else {
                toast.error('Đặt hàng thất bại: ' + (response.error || 'Vui lòng thử lại'));
            }
        } catch (error) {
            console.error('Error creating order:', error);
            toast.error('Đặt hàng thất bại, vui lòng thử lại sau');
        }
    };

    const calculateDiscount = (subtotal) => {
        if (!appliedCoupon) return 0;
        return Math.floor(subtotal * appliedCoupon.discount);
    };
    const CouponModal = ({ show, onClose, onSelect, subtotal }) => {
        if (!show) return null;

        const validCoupons = coupons.filter((coupon) => {
            const expiryDate = new Date(coupon.expire);
            const now = new Date();
            return expiryDate > now;
        });

        return (
            <div className="coupon-modal-overlay-pp">
                <div className="coupon-modal-pp">
                    <div className="coupon-modal-header-pp">
                        <h3>Chọn mã giảm giá</h3>
                        <button className="close-button-pp" onClick={onClose}>
                            ×
                        </button>
                    </div>
                    <div className="coupon-list-pp">
                        {validCoupons.length > 0 ? (
                            validCoupons.map((coupon) => (
                                <div key={coupon._id} className="coupon-item-pp">
                                    <div className="coupon-info-pp">
                                        <span className="coupon-code-pp">{coupon.name}</span>
                                        <p className="coupon-description-pp">
                                            Giảm {(coupon.discount * 100).toFixed(0)}%
                                        </p>
                                        <span className="min-order-pp">
                                            Hết hạn: {new Date(coupon.expire).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <button
                                        className="apply-coupon-pp"
                                        onClick={() => {
                                            onSelect(coupon);
                                            onClose();
                                        }}
                                    >
                                        Áp dụng
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="no-coupons-message">Hiện không có mã giảm giá nào khả dụng</div>
                        )}
                    </div>
                </div>
            </div>
        );
    };
    const calculateTotal = () => {
        return selectedProducts.reduce((total, product) => {
            // Extract numeric value from formatted price string
            const price =
                typeof product.price === 'string' ? Number(product.price.replace(/[^\d]/g, '')) : product.price;
            return total + price * product.quantity;
        }, 0);
    };
    const handleBackToCart = () => {
        navigate('../cart');
    };
    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser?.infoUser) {
            const userInfo = currentUser.infoUser;
            setFullname(userInfo.fullName || '');
            setPhone(userInfo.phone || '');
            setUserProfile({
                address: Array.isArray(userInfo.address) ? userInfo.address[0] : userInfo.address,
                fullName: userInfo.fullName,
                phone: userInfo.phone,
            });

            if (useDefaultAddress) {
                setAddress(Array.isArray(userInfo.address) ? userInfo.address[0] : userInfo.address);
            }
        }
    }, [useDefaultAddress]);
    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const response = await getCoupons();
                if (response.success) {
                    setCoupons(response.coupons);
                }
            } catch (error) {
                console.error('Error fetching coupons:', error);
            }
        };

        fetchCoupons();
    }, []);
    return (
        <div>
            <Nav />
            <div className="purchase-container-pp">
                <button className="back-to-cart-btn-pp" onClick={handleBackToCart}>
                    ← Quay lại giỏ hàng
                </button>
                <br />
                <div className="buyer-info-section-pp">
                    <h3>Thông tin người mua</h3>
                    <div className="information-pp">
                        <label htmlFor="fullname">
                            <b>Họ tên</b>
                        </label>
                        <input
                            type="text"
                            id="fullname"
                            placeholder="Họ tên"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            required
                        />
                        {errors.fullname && <span className="error-pp">{errors.fullname}</span>}
                    </div>
                    <div className="information-pp">
                        <label htmlFor="phone">
                            <b>Số điện thoại</b>
                        </label>
                        <input
                            type="text"
                            id="phone"
                            placeholder="Số điện thoại"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                        {errors.phone && <span className="error-pp">{errors.phone}</span>}
                    </div>

                    <div className="information-pp">
                        <label htmlFor="note">
                            <b>Ghi chú thêm</b>
                        </label>
                        <input
                            type="text"
                            id="note"
                            placeholder="Ghi chú thêm"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>
                </div>
                <br />
                <h3>Thông tin giao hàng</h3>
                <div className="delivery-options-pp">
                    <div>
                        <label>
                            <input
                                type="radio"
                                checked={useDefaultAddress}
                                onChange={() => {
                                    setUseDefaultAddress(true);
                                    setUseCustomAddress(false);
                                    if (userProfile) {
                                        setProvince(userProfile.city || '');
                                        setDistrict(userProfile.district || '');
                                        setAddress(userProfile.address || '');
                                    }
                                }}
                            />{' '}
                            Sử dụng địa chỉ mặc định
                        </label>
                        {useDefaultAddress && userProfile && (
                            <div className="default-address-pp">
                                <p>
                                    <strong>Địa chỉ:</strong> {userProfile?.address || 'Chưa cung cấp'}
                                </p>
                            </div>
                        )}
                    </div>

                    <div>
                        <label>
                            <input
                                type="radio"
                                checked={useCustomAddress}
                                onChange={() => {
                                    setUseCustomAddress(true);
                                    setUseDefaultAddress(false);
                                    // Reset custom address fields
                                    setProvince('');
                                    setDistrict('');
                                    setAddress('');
                                }}
                            />{' '}
                            Sử dụng địa chỉ khác
                        </label>
                        {useCustomAddress && (
                            <div>
                                <div className="information-pp">
                                    <label htmlFor="province">Tỉnh/Thành phố</label>
                                    <select
                                        id="province"
                                        value={province}
                                        onChange={(e) => handleProvinceChange(e.target.value)}
                                        required
                                    >
                                        <option value="" disabled>
                                            -- Chọn Tỉnh/Thành phố --{' '}
                                        </option>
                                        {Object.keys(locations).map((prov) => (
                                            <option key={prov} value={prov}>
                                                {prov}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.province && <span className="error-pp">{errors.province}</span>}
                                </div>
                                <div className="information-pp">
                                    <label htmlFor="district">Quận/Huyện</label>
                                    <select
                                        id="district"
                                        value={district}
                                        onChange={(e) => setDistrict(e.target.value)}
                                        disabled={!availableDistricts.length}
                                        required
                                    >
                                        <option value="" disabled>
                                            -- Chọn Quận/Huyện --{' '}
                                        </option>
                                        {availableDistricts.map((dist) => (
                                            <option key={dist} value={dist}>
                                                {dist}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.district && <span className="error-pp">{errors.district}</span>}
                                </div>
                                <div className="information-pp">
                                    <label htmlFor="address">Địa chỉ cụ thể</label>
                                    <input
                                        type="text"
                                        id="address"
                                        placeholder="Địa chỉ cụ thể"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        required
                                    />
                                    {errors.address && <span className="error-pp">{errors.address}</span>}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="coupon-section-pp">
                    <h3>Mã giảm giá</h3>
                    {appliedCoupon ? (
                        <div className="applied-coupon-pp">
                            <div className="coupon-info-pp">
                                <span className="coupon-code-pp">{appliedCoupon.name}</span>
                                <span className="coupon-discount">
                                    Giảm {(appliedCoupon.discount * 100).toFixed(0)}%
                                </span>
                            </div>
                            <button className="remove-coupon-pp" onClick={() => setAppliedCoupon(null)}>
                                Xóa
                            </button>
                        </div>
                    ) : (
                        <button className="select-coupon-btn-pp" onClick={() => setShowCouponModal(true)}>
                            <i className="fas fa-ticket-alt"></i>
                            Chọn mã giảm giá
                        </button>
                    )}
                </div>

                <CouponModal
                    show={showCouponModal}
                    onClose={() => setShowCouponModal(false)}
                    onSelect={setAppliedCoupon}
                    subtotal={calculateTotal()}
                />
                <div className="selected-products-pp">
                    <h3>Sản phẩm đã chọn</h3>
                    <div className="product-list-pp">
                        {selectedProducts.map((product) => (
                            <div key={product.id} className="product-item-pp">
                                <div className="product-image-pp">
                                    <img src={product.image} alt={product.name} />
                                </div>
                                <div className="product-details-pp">
                                    <h4>{product.name}</h4>
                                    <div className="product-price-pp">
                                        <span>Đơn giá: {product.price}</span>
                                        <span>Số lượng: {product.quantity}</span>
                                        <span>
                                            Thành tiền:{' '}
                                            {formatPrice(
                                                typeof product.price === 'string'
                                                    ? Number(product.price.replace(/[^\d]/g, '')) * product.quantity
                                                    : product.price * product.quantity,
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="order-summary-pp">
                        <div className="summary-row-pp">
                            <span>Tạm tính:</span>
                            <span>{formatPrice(calculateTotal())}</span>
                        </div>
                        {appliedCoupon && (
                            <div className="summary-row-pp discount">
                                <span>Giảm giá:</span>
                                <span>-{formatPrice(calculateDiscount(calculateTotal()))}</span>
                            </div>
                        )}
                        <div className="summary-row-pp total">
                            <span>Tổng tiền:</span>
                            <span>{formatPrice(calculateTotal() - calculateDiscount(calculateTotal()))}</span>
                        </div>
                    </div>
                </div>

                <button className="confirm-button-pp" onClick={handleConfirmPurchase}>
                    Xác nhận mua hàng
                </button>
            </div>
            <PaymentModal isOpen={isPaymentModalOpen} onClose={closePaymentModal} onConfirm={handleConfirmPayment} />
        </div>
    );
};

export default Purchasing;
