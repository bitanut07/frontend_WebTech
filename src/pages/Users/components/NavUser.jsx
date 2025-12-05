// src/pages/Nav.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/NavUser.css';
import logoImage from '../img/logo.png';

function NavUser({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (onSearch) {
            onSearch(value);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        navigate('/', { state: { searchTerm } });
        setSearchTerm('');
    };

    const clearSearch = () => {
        setSearchTerm('');
        if (onSearch) {
            onSearch('');
        }
    };

    const handleLogout = () => {
        // Optional: Add confirmation
        if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
            // Clear user data
            localStorage.removeItem('user');
            localStorage.removeItem('favorites');
            localStorage.removeItem('cart');
            setUser(null);

            // Redirect to home
            navigate('/');
        }
    };

    return (
        <nav className="navHomePage-nu">
            <Link to="/" className="logo-nu">
                <img src={logoImage} alt="Website Logo" className="logo-image-nu" />
            </Link>
            <Link to="/user/order-check" className="checkingOrder-nu">
                Kiểm tra đơn hàng
            </Link>
            <form className="searching-nu" onSubmit={handleSearchSubmit}>
                <input
                    type="text"
                    placeholder="Sản phẩm bạn cần tìm"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                {searchTerm && (
                    <button type="button" onClick={clearSearch} className="clear-search-btn-nu">
                        ×
                    </button>
                )}
                <button type="submit">
                    <i className="fas fa-search"></i>
                </button>
            </form>
            <div className="icons-nu">
                <Link to="/user/favorites">
                    <i className="far fa-heart"></i>
                </Link>
                <Link to="/user/cart">
                    <i className="fas fa-shopping-basket"></i>
                </Link>
                {user ? (
                    <div className="user-profile-nu">
                        <Link to="/user/profile" className="profile-link-nu">
                            <i className="fas fa-user"></i>
                            <span>{user.username}</span>
                        </Link>
                        <button onClick={handleLogout} className="logout-btn-nu">
                            <i className="fas fa-sign-out-alt"></i>
                        </button>
                    </div>
                ) : (
                    <Link to="/login" className="login-link-nu">
                        <i className="fas fa-sign-in-alt"></i>
                        <span>Đăng nhập</span>
                    </Link>
                )}
            </div>
        </nav>
    );
}

export default NavUser;
