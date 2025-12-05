// src/routes/UserRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Cart from '../pages/Users/components/Cart.jsx'; // Thêm import cho trang giỏ hàng
import Favorites from '../pages/Users/components/Favorites.jsx'; // Import component sản phẩm yêu thích
import OrderCheck from '../pages/Users/components/OrderCheck.jsx'; // Import component kiểm tra đơn hàng
import ProductReview from '../pages/Users/components/ProductReview.jsx'; // Import component đánh giá sản phẩm
import PurchasePage from '../pages/Users/components/PurchasePage.jsx'; // Import component trang mua hàng
import ReturnRefund from '../pages/Users/components/ReturnRefund.jsx'; // Import component trả hàng/hoàn tiền
import MessengerIcon from '../pages/Users/components/MessengerIcon.jsx';
import Profile from '../pages/Users/components/Profile.jsx';
import ChangePassword from '../pages/Users/components/ChangePassword.jsx';
import OrderDetails from '../pages/Users/components/OrderDetails.jsx';
import ProductDetail from '../pages/Users/components/ProductDetail.jsx'; // Add this import
import { UserProvider } from '../context/UserContext.js';
import CouponList from '../pages/Users/components/Coupon.jsx';
function UserRoutes() {
    return (
        <div className="user-routes-container">
            <UserProvider>
                <Routes>
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/order-check" element={<OrderCheck />} />
                    <Route path="/product-review" element={<ProductReview />} />
                    <Route path="/purchase-page" element={<PurchasePage />} />
                    <Route path="/return-refund/:orderId" element={<ReturnRefund />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/change-password" element={<ChangePassword />} />
                    <Route path="/order-details/:orderId" element={<OrderDetails />} />
                    <Route path="/coupon" element={<CouponList />} />
                    <Route path="/product/:id" element={<ProductDetail />} /> {/* Add this route */}
                </Routes>
                <MessengerIcon />
            </UserProvider>
        </div>
    );
}

export default UserRoutes;
