// src/pages/Nav.jsx

import { Link } from 'react-router-dom';
import '../assets/css/nav.css';
import { useSelector } from 'react-redux';
import logoImage from './Users/img/logologo.png'; // Adjust path as needed
import NavigationIcon from '../components/NavigationIcon';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Nav() {
    const currentUser = useSelector((state) => state.auth.login?.currentUser || {});
    const { accessToken, infoUser } = currentUser;
    const isLogin = !!accessToken;
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        if (searchTerm.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <nav className="navHomePage-n">
            <Link to="/" className="logo-n">
                <img src={logoImage} alt="Website Logo" className="logo-image-n" /><span className="logoName">TechZone</span>
            </Link>
            <Link to="/user/order-check" className="checkingOrder-n styled-order-check">
                <i className="fas fa-clipboard-list order-icon"></i>
                <span>Kiểm tra đơn hàng</span>
            </Link>
            <div className="searching-n">
                <input
                    type="text"
                    placeholder="Sản phẩm bạn cần tìm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                {searchTerm && <button onClick={() => setSearchTerm('')}>✕</button>}
                <button onClick={handleSearch}>
                    <i className="fas fa-search"></i>
                </button>
            </div>

            <NavigationIcon isLogin={isLogin} user={infoUser} />
        </nav>
    );
}

export default Nav;
