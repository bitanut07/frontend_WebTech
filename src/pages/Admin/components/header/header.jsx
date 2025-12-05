import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faSignOutAlt, faBell } from '@fortawesome/free-solid-svg-icons';
import { logout } from '../../../../services/auth';
import './header.css'; // Không thay đổi
import '../../../../assets/css/variables.css'; // Không thay đổi

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const titles = {
        '/admin': 'Trang chủ',
        '/admin/orders': 'Đơn hàng',
        '/admin/products': 'Sản phẩm',
        '/admin/customers': 'Khách hàng',
        '/admin/coupon': 'Coupon',
        '/admin/create-notification': 'Tạo thông báo',
    };

    const title = titles[location.pathname] || 'Trang chủ';

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error(error.message || 'Logout failed');
        }
    };

    const handleNotifications = () => {
        console.log('Notifications clicked...');
    };

    return (
        <header className="header">
            <h2>{title}</h2>

            <div className="admin-info">
                <button className="notification-btn" onClick={handleNotifications}>
                    <FontAwesomeIcon icon={faBell} className="icon-header" />
                </button>
                <button className="admin-avatar">
                    <FontAwesomeIcon icon={faUserCircle} className="icon-header" />
                </button>

                <button className="logout-btn" onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} className="icon-header" />
                </button>
            </div>
        </header>
    );
};

export default Header;
