import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Nav from './Nav';
import '../assets/css/SearchResults.css';
import productApi from '../services/product';
import { updateWishlist, getWishlist } from '../services/user';

const SearchResults = () => {
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const searchQuery = searchParams.get('q');
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('favorites');
        return saved ? JSON.parse(saved) : [];
    });
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return !!localStorage.getItem('currentUser');
    });
    const [wishlistItems, setWishlistItems] = useState([]);
    const handleAddToCart = (e, product) => {
        e.stopPropagation();
        addToCart({
            id: product._id,
            name: product.name,
            price: product.price,
            image: product.thumbnail || '/images/default-product.jpg',
            quantity: 1
        });
        toast.success('Đã thêm vào giỏ hàng!');
    };
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };
    useEffect(() => {
        const fetchWishlist = async () => {
            if (!isLoggedIn) {
                setWishlistItems([]);
                return;
            }
            try {
                const response = await getWishlist();
                if (response.success) {
                    setWishlistItems(response.data.wishlist || []);
                }
            } catch (error) {
                console.error('Error fetching wishlist:', error);
                setWishlistItems([]);
            }
        };

        fetchWishlist();
    }, [isLoggedIn]);

    const handleFavoriteClick = async (e, product) => {
        e.stopPropagation();
        try {
            const isInWishlist = wishlistItems.includes(product._id);
            const response = await updateWishlist(product._id);
            
            if (response.success) {
                const newWishlist = await getWishlist();
                setWishlistItems(newWishlist.data.wishlist || []);
                
                toast.success(
                    isInWishlist 
                        ? 'Đã xóa khỏi danh sách sản phẩm yêu thích'
                        : 'Đã thêm vào danh sách sản phẩm yêu thích', 
                    {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    }
                );
            }
        } catch (error) {
            toast.error(error.message || 'Có lỗi xảy ra khi cập nhật danh sách yêu thích');
        }
    };
    useEffect(() => {
        const fetchSearchResults = async () => {
            setLoading(true);
            try {
                // Use the product API with search parameters
                const response = await productApi.products.getAll({
                    name: searchQuery, // Add search query as name filter
                    per_page: 100 // Increase items per page for search
                });
                
                // Ensure products is an array before filtering
                const productsArray = Array.isArray(response?.products) ? response.products : [];
                
                // Filter products by name match
                const filteredProducts = productsArray.filter(product => 
                    product && product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase())
                );
                
                setProducts(filteredProducts);
            } catch (error) {
                console.error('Search error:', error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        if (searchQuery) {
            fetchSearchResults();
        }
    }, [searchQuery]);

    return (
        <div>
            <Nav />
            <div className="search-results-container">
                <h2>Kết quả tìm kiếm cho "{searchQuery}"</h2>
                {loading ? (
                    <div>Đang tải...</div>
                ) : (
                    <div className="search-results-grid">
                        {products.length > 0 ? (
                            products.map(product => (
                                <div 
                                    key={product._id} 
                                    className="product-card"
                                    onClick={() => navigate(`/user/product/${product._id}`)}
                                >
                                    <img 
                                        src={product.thumbnail || '/images/default-product.jpg'} 
                                        alt={product.name} 
                                        className="product-image"
                                        onError={(e) => {
                                            e.target.src = '/images/default-product.jpg';
                                        }}
                                    />
                                    <h3>{product.name}</h3>
                                    <p className="price">
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(product.price)}
                                    </p>
                                    <div className="rating">
                                        {[...Array(5)].map((_, index) => (
                                            <span
                                                key={index}
                                                className={`star ${index < (product.avgStar || 0) ? 'filled' : 'empty'}`}
                                            >
                                                {index < (product.avgStar || 0) ? '★' : '☆'}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="product-actions">
                                        <button 
                                            className="favorite-btn"
                                            onClick={(e) => handleFavoriteClick(e, product)}
                                        >
                                            <FontAwesomeIcon 
                                                icon={wishlistItems.includes(product._id) ? fasHeart : farHeart}
                                                style={{
                                                    color: wishlistItems.includes(product._id) ? '#ff4d4d' : '#666',
                                                    cursor: 'pointer',
                                                }}
                                            />
                                        </button>
                                        <button 
                                            className="add-to-cart-btn"
                                            onClick={(e) => handleAddToCart(e, product)}
                                        >
                                            <i className="fas fa-cart-plus"></i>
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Không tìm thấy sản phẩm phù hợp.</p>
                        )}
                    </div>
                )}
            </div>
            <ToastContainer />
        </div>
    );
};

export default SearchResults;