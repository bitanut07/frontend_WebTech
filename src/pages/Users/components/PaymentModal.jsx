import React, { useContext, useState } from 'react';
import { CartContext } from '../../../context/CartContext';
import '../css/PaymentModal.css';
import { toast } from 'react-toastify';

const PaymentModal = ({ isOpen, onClose, onConfirm }) => {
    const { cartItems } = useContext(CartContext);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handlePaymentMethodChange = (method) => {
        if (method === 'visa-mastercard' || method === 'atm') {
            toast.error('Phương thức thanh toán này chưa được hỗ trợ. Vui lòng thử lại sau.', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setPaymentMethod('');
            return;
        }
        setPaymentMethod(method);
        setError(null);
    };
    const validateCartItems = (items) => {
        return (
            Array.isArray(items) &&
            items.length > 0 &&
            items.every((item) => item && typeof item === 'object' && item.price != null && item.quantity != null)
        );
    };
    const formatPrice = (price) => {
        if (price == null) return '0 VND';
        const numericPrice = Number(String(price).replace(/[^0-9.-]+/g, '')) || 0;
        return `${numericPrice.toLocaleString('vi-VN')} VND`;
    };

    const calculateTotal = (items) => {
        if (!Array.isArray(items)) return 0;
        return items.reduce((total, item) => {
            if (!item?.price || !item?.quantity) return total;
            const price = Number(String(item.price).replace(/[^0-9.-]+/g, '')) || 0;
            const quantity = Number(item.quantity) || 0;
            return total + price * quantity;
        }, 0);
    };

    const handleConfirm = async () => {
        try {
            if (!paymentMethod) {
                setError('Vui lòng chọn phương thức thanh toán.');
                return;
            }

            if (!validateCartItems(cartItems)) {
                setError('Giỏ hàng không hợp lệ.');
                return;
            }

            setIsLoading(true);
            setError(null);

            // Format cart items with safe type conversion
            const formattedItems = cartItems.map((item) => ({
                ...item,
                price: Number(String(item.price || 0).replace(/[^0-9.-]+/g, '')) || 0,
                quantity: Number(item.quantity || 0),
            }));

            onConfirm(paymentMethod);
            onClose();
        } catch (err) {
            console.error('Error processing payment:', err);
            setError('Có lỗi xảy ra khi xử lý thanh toán');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay-pm" onClick={onClose}>
            <div className="modal-content-pm" onClick={(e) => e.stopPropagation()}>
                <h1>Thanh toán</h1>
                {error && <div className="error-message">{error}</div>}
                <div className="payment-methods-pm">
                    <div
                        className={`payment-option-pm ${paymentMethod === 'cash' ? 'selected' : ''}`}
                        onClick={() => handlePaymentMethodChange('cash')}
                    >
                        <img src="/cash.png" alt="Thanh toán tiền mặt" style={{ height: '100px', width: '100px' }} />
                        <span>Thanh toán tiền mặt</span>
                    </div>
                    <div
                        className={`payment-option-pm ${paymentMethod === 'payment_online' ? 'selected' : ''}`}
                        onClick={() => handlePaymentMethodChange('payment_online')}
                    >
                        <img
                            src="/online_payment.jpg"
                            alt="Thanh toán online"
                            style={{ height: '100px', width: '100px' }}
                        />
                        <span>Thanh toán online</span>
                    </div>
                </div>
                <button className="checkout-button-pm" onClick={handleConfirm} disabled={isLoading || !paymentMethod}>
                    {isLoading ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
                </button>
                <button className="close-button-pm" onClick={onClose} disabled={isLoading}>
                    Đóng
                </button>
            </div>
        </div>
    );
};
export default PaymentModal;
