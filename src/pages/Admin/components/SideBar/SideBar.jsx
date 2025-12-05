// src/pages/Admin/components/SideBar/SideBar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SideBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBox, faShoppingCart, faUsers, faTag, faBullhorn } from '@fortawesome/free-solid-svg-icons';
import logo from './logo.png';
const SideBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <nav className="sidebar">
            <div className="logo">
                <img src={logo} alt="Logo" />
            </div>
            <ul>
                <li
                    className={location.pathname === '/admin/home' ? 'active' : ''}
                    onClick={() => handleNavigation('/admin/home')}
                >
                    <FontAwesomeIcon icon={faHome} size="lg" /> {/* Thêm size */}
                    <span>Trang chủ</span>
                </li>
                <li
                    className={location.pathname === '/admin/orders' ? 'active' : ''}
                    onClick={() => handleNavigation('/admin/orders')}
                >
                    <FontAwesomeIcon icon={faShoppingCart} size="lg" />
                    <span>Đơn hàng</span>
                </li>
                <li
                    className={location.pathname === '/admin/products' ? 'active' : ''}
                    onClick={() => handleNavigation('/admin/products')}
                >
                    <FontAwesomeIcon icon={faBox} size="lg" />
                    <span>Sản phẩm</span>
                </li>
                <li
                    className={location.pathname === '/admin/customers' ? 'active' : ''}
                    onClick={() => handleNavigation('/admin/customers')}
                >
                    <FontAwesomeIcon icon={faUsers} size="lg" />
                    <span>Khách hàng</span>
                </li>
                <li
                    className={location.pathname === '/admin/coupon' ? 'active' : ''}
                    onClick={() => handleNavigation('/admin/coupon')}
                >
                    <FontAwesomeIcon icon={faTag} size="lg" />
                    <span>Coupon</span>
                </li>

                <li
                    className={location.pathname === '/admin/create-notification' ? 'active' : ''}
                    onClick={() => handleNavigation('/admin/create-notification')}
                >
                    <FontAwesomeIcon icon={faBullhorn} />
                    <span>Tạo thông báo</span>
                </li>
            </ul>
        </nav>
    );
};

export default SideBar;
