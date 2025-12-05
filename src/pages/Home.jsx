import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from './Nav';
import Footer from './Footer';
import '../assets/css/home.css';
import productApi from '../services/product';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons';
import { CartContext } from '../context/CartContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FilterSort from './FilterSort';
import { useSearchParams } from 'react-router-dom';
import { updateWishlist, getWishlist } from '../services/user';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';

function Home() {
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(0);
    const productsPerPage = 10;
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [currentAdIndex, setCurrentAdIndex] = useState(0);
    const [isAd, setIsAd] = useState(false);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const videos = ['RHPdH3yP-Eg', '__W7T4k6YQg', 'uY6sCI0HW34'];

    const ads = [
        {
            image: 'https://cdn.nguyenkimmall.com/images/detailed/691/iphone-12-chinh-thuc-mo-ban-iphone-12-pro-max-len-ngoi-thumbnail.jpg',
            link: 'https://cdn.nguyenkimmall.com/images/detailed/691/iphone-12-chinh-thuc-mo-ban-iphone-12-pro-max-len-ngoi-thumbnail.jpg',
        },
        {
            image: 'https://genk.mediacdn.vn/2019/4/23/photo-1-15560365277871628784452.jpg',
            link: 'https://genk.mediacdn.vn/2019/4/23/photo-1-15560365277871628784452.jpg',
        },
        {
            image: 'https://cdn.tgdd.vn/Files/2020/06/11/1262208/sale_800x450.jpg',
            link: 'https://cdn.tgdd.vn/Files/2020/06/11/1262208/sale_800x450.jpg',
        },
        {
            image: 'https://cdn.tgdd.vn/Files/2021/08/03/1372716/laptop-1_1280x720-800-resize.jpg',
            link: 'https://cdn.tgdd.vn/Files/2021/08/03/1372716/laptop-1_1280x720-800-resize.jpg',
        },
    ];

    const [searchParams, setSearchParams] = useSearchParams();
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return !!localStorage.getItem('currentUser');
    });

    //Sử dụng cho FilterSort.jsx để lọc sản phẩm
    const [selectFilterChild, setSelectFilterChild] = useState([]);
    const [filterParams, setFilterParams] = useState([]);
    const [activeSort, setActiveSort] = useState(null);

    const categories = [
        { id: 'all', label: 'Tất cả sản phẩm' },
        { id: 'Phone', label: 'Điện thoại & Tablet' },
        { id: 'Laptop', label: 'Laptop' },
        { id: 'Watch', label: 'Đồng hồ' },
        { id: 'Camera', label: 'Camera' },
        { id: 'PC', label: 'PC' },
        { id: 'Monitor', label: 'Màn hình' },
        { id: 'TV', label: 'Tivi' },
    ];

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

    useEffect(() => {
        const checkAuthAndFetchWishlist = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setWishlistItems([]);
                setIsLoggedIn(false);
                return;
            }

            setIsLoggedIn(true);
            try {
                const response = await getWishlist();
                console.log('Response', response);
                if (response.success) {
                    setWishlistItems(response.data.wishlist || []);
                }
            } catch (error) {
                console.error('Error fetching wishlist:', error);
                setWishlistItems([]);
            }
        };

        checkAuthAndFetchWishlist();
        window.addEventListener('storage', checkAuthAndFetchWishlist);

        return () => {
            window.removeEventListener('storage', checkAuthAndFetchWishlist);
        };
    }, []); // Run on mount only
    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const response = await productApi.products.getFeatured(5);
                if (response.success) {
                    setFeaturedProducts(response.featuredProducts);
                }
            } catch (error) {
                console.error('Error fetching featured products:', error);
            }
        };

        fetchFeaturedProducts();
    }, []);
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const params = {
                    page: currentPage,
                    per_page: productsPerPage,
                    ...(selectedCategory !== 'all' && { productType: selectedCategory }),
                };

                searchParams.forEach((value, key) => {
                    params[key] = value;
                });

                const response = await productApi.products.getAll(params);
                setProducts(response.products);
                setTotalPages(response.totalPages);
            } catch (err) {
                setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage, selectedCategory, searchParams]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (isAd) {
                if (currentAdIndex < ads.length - 1) {
                    setCurrentAdIndex((prev) => prev + 1);
                } else {
                    setCurrentAdIndex(0);
                    setIsAd(false);
                }
            } else {
                if (currentVideoIndex < videos.length - 1) {
                    setCurrentVideoIndex((prev) => prev + 1);
                } else {
                    setCurrentVideoIndex(0);
                    setIsAd(true);
                }
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [currentVideoIndex, currentAdIndex, isAd, videos.length, ads.length]);

    const handleCategoryClick = (category) => {
        setSelectFilterChild([]);
        setFilterParams([]);
        const newParams = new URLSearchParams(searchParams);
        while (newParams.size > 0) {
            newParams.delete(newParams.keys().next().value);
        }
        setSearchParams(newParams);
        setSelectedCategory(category);
        setCurrentPage(1);
        // Add smooth scroll to products section
        document.getElementById('titleAllProducts').scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    const handleFilterChange = (filter) => {
        setSelectedCategory(filter.category);
    };

    const handlePrev = () => {
        setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
    };

    const handleNext = () => {
        setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
    };

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

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
                        position: 'top-right',
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    },
                );
            }
        } catch (error) {
            toast.error(error.message || 'Có lỗi xảy ra khi cập nhật danh sách yêu thích');
        }
    };

    const handleAddToCart = (e, product) => {
        e.stopPropagation();
        addToCart({
            id: product._id,
            name: product.name,
            price: product.price, // Store raw number
            image: product.thumbnail || '/images/default-product.jpg',
            quantity: 1,
        });
        toast.success('Đã thêm vào giỏ hàng!', {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    };

    return (
        <div className="container1">
            <Nav />
            <nav className="nav-container">
                <ul className="nav-list">
                    {categories.map((category) => (
                        <li
                            key={category.id}
                            onClick={() => {
                                handleCategoryClick(category.id);
                            }}
                            className={`nav-item ${selectedCategory === category.id ? 'active' : ''}`}
                        >
                            {category.label}
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="homeTop">
                <h2 className="title1">Tech Zone</h2>
                <p className="title2 animate-rise">Nơi cung cấp các thiết bị điện tử uy tín tại Việt Nam</p>
                <button
                    className="viewProducts"
                    onClick={() => {
                        document.getElementById('products-section').scrollIntoView({
                            behavior: 'smooth',
                        });
                    }}
                >
                    {' '}
                    Xem các sản phẩm
                </button>
            </div>
            <div className="videos">
                <div className="video-container">
                    <button
                        onClick={() => {
                            if (isAd) {
                                if (currentAdIndex > 0) {
                                    setCurrentAdIndex((prev) => prev - 1);
                                } else {
                                    setCurrentAdIndex(ads.length - 1);
                                    setIsAd(false);
                                }
                            } else {
                                if (currentVideoIndex > 0) {
                                    setCurrentVideoIndex((prev) => prev - 1);
                                } else {
                                    setCurrentVideoIndex(videos.length - 1);
                                    setIsAd(true);
                                }
                            }
                        }}
                    >
                        <i className="fas fa-angle-left"></i>
                    </button>

                    {isAd ? (
                        <a href={ads[currentAdIndex].link} target="_blank" rel="noopener noreferrer" className="active">
                            <img src={ads[currentAdIndex].image} alt={`Ad ${currentAdIndex + 1}`} />
                        </a>
                    ) : (
                        <iframe
                            className="active"
                            width="100%"
                            height="500"
                            src={`https://www.youtube.com/embed/${videos[currentVideoIndex]}`}
                            title="Product Showcase"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    )}

                    <button
                        onClick={() => {
                            if (isAd) {
                                if (currentAdIndex < ads.length - 1) {
                                    setCurrentAdIndex((prev) => prev + 1);
                                } else {
                                    setCurrentAdIndex(0);
                                    setIsAd(false);
                                }
                            } else {
                                if (currentVideoIndex < videos.length - 1) {
                                    setCurrentVideoIndex((prev) => prev + 1);
                                } else {
                                    setCurrentVideoIndex(0);
                                    setIsAd(true);
                                }
                            }
                        }}
                    >
                        <i className="fas fa-angle-right"></i>
                    </button>
                </div>

                <div className="video-dots">
                    {[...videos, ...ads].map((_, index) => (
                        <span
                            key={index}
                            className={`dot ${
                                (isAd && index >= videos.length && index - videos.length === currentAdIndex) ||
                                (!isAd && index < videos.length && index === currentVideoIndex)
                                    ? 'active'
                                    : ''
                            }`}
                            onClick={() => {
                                if (index < videos.length) {
                                    setIsAd(false);
                                    setCurrentVideoIndex(index);
                                } else {
                                    setIsAd(true);
                                    setCurrentAdIndex(index - videos.length);
                                }
                            }}
                        ></span>
                    ))}
                </div>
            </div>

            <div className="featured-products">
                <h2>Sản phẩm nổi bật</h2>
                <div className="featured-products-grid">
                    {featuredProducts.map((product) => (
                        <div
                            key={product._id}
                            className="card" // Changed from featured-card to card
                            onClick={() => navigate(`/user/product/${product._id}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="image">
                                <img
                                    src={product.thumbnail || '/images/default-product.jpg'}
                                    alt={product.name}
                                    onError={(e) => {
                                        e.target.src = '/images/default-product.jpg';
                                    }}
                                />
                            </div>
                            <div className="name">{product.name}</div>
                            <div className="prices">
                                {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                }).format(product.price)}
                            </div>
                            <div className="rating-like-container">
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
                                <div className="actions">
                                    <div className="like" onClick={(e) => handleFavoriteClick(e, product)}>
                                        <FontAwesomeIcon
                                            icon={wishlistItems.includes(product._id) ? fasHeart : farHeart}
                                            style={{
                                                color: wishlistItems.includes(product._id) ? '#ff4d4d' : '#666',
                                                cursor: 'pointer',
                                            }}
                                        />
                                    </div>
                                    <button className="add-to-cart-btn" onClick={(e) => handleAddToCart(e, product)}>
                                        <i className="fas fa-cart-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <FilterSort
                selectedCategory={selectedCategory}
                selectFilterChild={selectFilterChild}
                setSelectFilterChild={setSelectFilterChild}
                filterParams={filterParams}
                setFilterParams={setFilterParams}
                activeSort={activeSort}
                setActiveSort={setActiveSort}
                onFilterChange={handleFilterChange}
            />
            <h2 className="title" id="titleAllProducts">
                Toàn bộ sản phẩm
            </h2>

            <div className="content1" id="products-section">
                <main className="products" id="product-cards">
                    {loading ? (
                        <div>Đang tải sản phẩm...</div>
                    ) : error ? (
                        <div>{error}</div>
                    ) : products.length > 0 ? (
                        products.map((product) => (
                            <div
                                key={product._id}
                                className="card"
                                onClick={() => navigate(`/user/product/${product._id}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="image">
                                    <img
                                        src={product.thumbnail || '/images/default-product.jpg'}
                                        alt={product.name}
                                        onError={(e) => {
                                            e.target.src = '/images/default-product.jpg';
                                        }}
                                    />
                                </div>
                                <div className="name">{product.name}</div>
                                <div className="prices">
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    }).format(product.price)}
                                </div>
                                <div className="rating-like-container">
                                    <div className="rating">
                                        {[...Array(5)].map((_, index) => (
                                            <span
                                                key={index}
                                                className={`star ${
                                                    index < (product.avgStar || 0) ? 'filled' : 'empty'
                                                }`}
                                            >
                                                {index < (product.avgStar || 0) ? '★' : '☆'}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="actions">
                                        <div className="like" onClick={(e) => handleFavoriteClick(e, product)}>
                                            <FontAwesomeIcon
                                                icon={wishlistItems.includes(product._id) ? fasHeart : farHeart}
                                                style={{
                                                    color: wishlistItems.includes(product._id) ? '#ff4d4d' : '#666',
                                                    cursor: 'pointer',
                                                }}
                                            />
                                        </div>
                                        <button
                                            className="add-to-cart-btn"
                                            onClick={(e) => handleAddToCart(e, product)}
                                        >
                                            <i className="fas fa-cart-plus"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Không có sản phẩm trong danh mục này.</p>
                    )}
                </main>
            </div>
            {totalPages > 1 && (
                <div className="pagination">
                    <button onClick={handlePrev} disabled={currentPage === 1}>
                        Trước
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageClick(index + 1)}
                            className={currentPage === index + 1 ? 'active' : ''}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button onClick={handleNext} disabled={currentPage === totalPages}>
                        Sau
                    </button>
                </div>
            )}

            <ToastContainer />
            <Footer />
        </div>
    );
}

export default Home;
