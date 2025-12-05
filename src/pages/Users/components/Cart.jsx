import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../../context/CartContext';
import Nav from '../../Nav';
import '../css/Cart.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Cart = () => {
    const { cartItems, updateCartItemQuantity, removeFromCart, clearCart, updateCart } = useContext(CartContext);
    const [selectedItems, setSelectedItems] = useState([]);
    
    const navigate = useNavigate();

    const handleRemove = (id) => {
        removeFromCart(id);
    };

    const handleQuantityChange = (id, quantity) => {
        if (quantity >= 1) {
            updateCartItemQuantity(id, quantity);
        }
    };

    const handleQuantityInputChange = (id, event) => {
        const value = event.target.value;
        if (value === '' || /^[0-9\b]+$/.test(value)) {
            const quantity = value === '' ? '' : parseInt(value, 10);
            handleQuantityChange(id, quantity);
        }
    };

    const handleQuantityBlur = (id, event) => {
        if (event.target.value === '') {
            handleQuantityChange(id, 1);
        }
    };

    const handleSelectItem = (id) => {
        setSelectedItems((prevSelectedItems) =>
            prevSelectedItems.includes(id)
                ? prevSelectedItems.filter((itemId) => itemId !== id)
                : [...prevSelectedItems, id],
        );
    };

    const handleSelectAll = () => {
        if (selectedItems.length === cartItems.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(cartItems.map((item) => item.id));
        }
    };

    const handleClearCart = () => {
        clearCart();
        setSelectedItems([]);
    };

    // Format price to VND
    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VND';
    };

    // Calculate total with proper number handling
    const getTotalPrice = () => {
        return cartItems
            .filter((item) => selectedItems.includes(item.id))
            .reduce((total, item) => {
                // Price is already a number, no need for conversion
                return total + item.price * item.quantity;
            }, 0);
    };

    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            toast.warning('Vui lòng chọn ít nhất một sản phẩm để mua.', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } else {
            const selectedProducts = cartItems.filter((item) => selectedItems.includes(item.id));
            navigate('../purchase-page', { state: { selectedProducts } });
        }
    };
    const updateQuantity = (itemId, newQuantity) => {
        // Prevent negative or zero quantities
        if (newQuantity < 1) return;
        
        // Update cart items with new quantity
        const updatedItems = cartItems.map(item => 
            item.id === itemId 
                ? { ...item, quantity: newQuantity }
                : item
        );
        
        // If using CartContext, update the context
        updateCart(updatedItems);
    };
    return (
        <div>
            <Nav />
            <div className="cart-container-c">
                <h1>Giỏ hàng</h1>
                <div className="cart-actions-c">
                    <button onClick={handleSelectAll} className="select-all-button-c">
                        {selectedItems.length === cartItems.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                    </button>
                    <button onClick={handleClearCart} className="clear-cart-button-c">
                        Xóa tất cả
                    </button>
                </div>
                <table className="cart-table-c">
                    <thead>
                        <tr>
                            <th>Chọn</th>
                            <th>Hình ảnh</th>
                            <th>Tên sản phẩm</th>
                            <th>Đơn giá</th>
                            <th>Số lượng</th>
                            <th>Số tiền</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                    {cartItems.map((item) => (
                        <tr key={item.id}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedItems.includes(item.id)}
                                    onChange={() => handleSelectItem(item.id)}
                                    className="select-checkbox-c"
                                />
                            </td>
                            <td>
                                <img src={item.image} alt={item.name} className="cart-image-c" />
                            </td>
                            <td>{item.name}</td>
                            {/* Format individual item price */}
                            <td>{formatPrice(item.price)}</td>
                            <td>
                                <div className="quantity-controls">
                                    <input
                                        type="number"
                                        className="quantity-input-c"
                                        value={item.quantity}
                                        onChange={(e) => handleQuantityInputChange(item.id, e)}
                                        onBlur={(e) => handleQuantityBlur(item.id, e)}
                                        min="1"
                                    />
                                </div>
                            </td>
                            {/* Add subtotal column */}
                            <td>{formatPrice(item.price * item.quantity)}</td>
                            <td>
                                <button 
                                    onClick={() => removeFromCart(item.id)}
                                    className="remove-btn"
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="cart-total-c">
                    <h2>Tổng tiền: {formatPrice(getTotalPrice())}</h2>
                    <button className="checkout-button-c" onClick={handleCheckout}>
                        Mua Hàng
                    </button>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Cart;
