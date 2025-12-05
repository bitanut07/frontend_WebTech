// Favorites.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../../context/CartContext';
import productApi from '../../../services/product';
import { getWishlist, updateWishlist } from '../../../services/user';
import { toast } from 'react-toastify';
import '../css/Favorites.css';
import Nav from '../../Nav';
const Favorites = () => {
    const [favoriteItems, setFavoriteItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { cartItems, addToCart, updateCartItemQuantity } = useContext(CartContext);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchWishlistWithDetails = async () => {
            try {
                setLoading(true);
                const wishlistResponse = await getWishlist();
                console.log(100)
                if (!wishlistResponse.success || !wishlistResponse.data.wishlist) {
                    throw new Error('Invalid wishlist data');
                }
    
                const productPromises = wishlistResponse.data.wishlist.map(async (productId) => {
                    try {
                        const productData = await productApi.products.getById(productId);
                        
                        // Direct access to product data without .product nesting
                        return {
                            id: productData._id,
                            name: productData.name,
                            price: new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND'
                            }).format(productData.price),
                            rawPrice: productData.price,
                            image: productData.thumbnail || '/images/default-product.jpg',
                            selected: false
                        };
                    } catch (err) {
                        console.error(`Error processing product ${productId}:`, err);
                        return null;
                    }
                });
    
                const products = (await Promise.all(productPromises))
                    .filter(product => product !== null);
                
                setFavoriteItems(products);
            } catch (error) {
                console.error('Error fetching wishlist:', error);
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchWishlistWithDetails();
    }, []);


    const handleRemove = async (id) => {
        try {
            const response = await updateWishlist(id);
            if (response.success) {
                setFavoriteItems(prev => prev.filter(item => item.id !== id));
                toast.success(response.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleAddToCart = () => {
        const selectedItems = favoriteItems.filter((item) => item.selected);
        if (selectedItems.length === 0) {
            toast.warning('Vui lòng chọn ít nhất một sản phẩm');
            return;
        }

        selectedItems.forEach((item) => {
            const cartItem = cartItems.find((cartItem) => cartItem.id === item.id);
            if (cartItem) {
                updateCartItemQuantity(item.id, cartItem.quantity + 1);
            } else {
                addToCart({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    quantity: 1
                });
            }
        });

        setFavoriteItems(prev => 
            prev.map(item => ({ ...item, selected: false }))
        );
        toast.success('Đã thêm sản phẩm vào giỏ hàng');
        navigate('../Cart');
    };

    const handleSelectItem = (id) => {
        setFavoriteItems(favoriteItems.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item)));
    };

    const handleClearFavorites = async () => {
        try {
            // Remove each item from wishlist
            await Promise.all(
                favoriteItems.map(item => updateWishlist(item.id))
            );
            setFavoriteItems([]);
            toast.success('Đã xóa tất cả sản phẩm yêu thích');
        } catch (error) {
            toast.error(error.message);
        }
    };


    return (
        <div>
            <Nav />
            <div className="favorites-container-f">
                <h1>Sản phẩm yêu thích</h1>
                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                            <p>Đang tải...</p>
                    </div>
                ) : favoriteItems.length === 0 ? (
                    <div>Không có sản phẩm yêu thích nào</div>
                ) : (
                    <table className="favorites-table-f">
                        <thead>
                            <tr>
                                <th>Chọn</th>
                                <th>Hình ảnh</th>
                                <th>Tên sản phẩm</th>
                                <th>Đơn giá</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {favoriteItems.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={item.selected}
                                            onChange={() => handleSelectItem(item.id)}
                                        />
                                    </td>
                                    <td>
                                        <img 
                                            src={item.image} 
                                            alt={item.name} 
                                            className="favorites-image-f"
                                            onError={(e) => {
                                                e.target.src = '/images/default-product.jpg';
                                            }}
                                        />
                                    </td>
                                    <td>{item.name}</td>
                                    <td>{item.price}</td>
                                    <td>
                                        <button 
                                            onClick={() => handleRemove(item.id)} 
                                            className="remove-button-f"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                <div className="favorites-actions-f">
                    <button onClick={handleAddToCart} className="add-to-cart-button-f">
                        Thêm vào giỏ hàng
                    </button>
                    <button onClick={handleClearFavorites} className="clear-favorites-button-f">
                        Xóa tất cả
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Favorites;
