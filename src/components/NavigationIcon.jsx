import React from 'react';
import { Link } from 'react-router-dom';
import { FaRegHeart, FaShoppingBasket, FaUserAlt } from 'react-icons/fa';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../redux/apiRequest';
import NotificationDropdow from '../components/NotificationDropdown';
import '../assets/css/nav.css';
const NavigationIcon = ({ isLogin, user }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleLogout = () => {
        logoutUser(dispatch, navigate);
    };
    return (
        <div className="navigation-icons">
            <Link to={isLogin ? '/user/favorites' : '/login'} className={`icon-wrapper`}>
                <FaRegHeart className="icon heart-icon" />
                <span className="icon-label">Yêu thích</span>
            </Link>
            <div className={`wrapper-bell`}>
                <NotificationDropdow />
            </div>
            <Link to={isLogin ? '/user/cart' : '/login'} className={`icon-wrapper`}>
                <FaShoppingBasket className="icon cart-icon" />
                <span className="icon-label">Giỏ hàng</span>
            </Link>

            <div className="icon-wrapper" onMouseLeave={() => setShowTooltip(false)}>
                <div
                    className="icon-container"
                    onClick={() => {
                        if (isLogin) {
                            setShowTooltip((prev) => !prev);
                        } else {
                            navigate('/login');
                        }
                    }}
                >
                    <FaUserAlt className="icon user-icon" />
                    <span className="icon-label">{isLogin ? 'Người dùng' : 'Đăng nhập'}</span>
                </div>

                {showTooltip && isLogin && (
                    <div className="tooltip">
                        <button onClick={() => navigate('/user/profile')}>Thông tin cá nhân</button>
                        <button onClick={handleLogout}>Đăng xuất</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NavigationIcon;
