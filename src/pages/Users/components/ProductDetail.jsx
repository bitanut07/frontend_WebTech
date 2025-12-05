import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../../../context/CartContext';
import { toast } from 'react-toastify';
import Nav from '../../Nav';
import Footer from './FooterUser';
import productApi from '../../../services/product';
import '../css/ProductDetail.css';
import { ToastContainer } from 'react-toastify';

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('description');
    const [currentImage, setCurrentImage] = useState(0);
    const allImages = product ? [product.thumbnail, ...(product.listImage || [])] : [];
    const [similarProducts, setSimilarProducts] = useState([]);
    const [loadingSimilar, setLoadingSimilar] = useState(false);
    const [sameCategoryProducts, setSameCategoryProducts] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await productApi.products.getById(id);
                setProduct(response);
            } catch (error) {
                toast.error('Không thể tải thông tin sản phẩm');
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, navigate]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    const handleBuyNow = () => {
        try {
            // Silently add to cart first
            addToCart({
                id: product._id,
                name: product.name,
                price: product.price,
                image: product.thumbnail,
                quantity: quantity,
            });

            // Navigate to purchase page
            navigate('/user/purchase-page', {
                state: {
                    selectedProducts: [
                        {
                            id: product._id,
                            name: product.name,
                            price: product.price,
                            image: product.thumbnail,
                            quantity: quantity,
                        },
                    ],
                    fromBuyNow: true,
                    totalAmount: product.price * quantity,
                },
            });
        } catch (error) {
            console.error('Error in buy now:', error);
            toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
        }
    };

    const handleQuantityChange = (action) => {
        if (action === 'increase') {
            setQuantity((prev) => prev + 1);
        } else if (action === 'decrease' && quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    const handleAddToCart = () => {
        addToCart({
            id: product._id,
            name: product.name,
            price: product.price,
            image: product.thumbnail,
            quantity: quantity,
        });
        toast.success(`Đã thêm ${quantity} ${product.name} vào giỏ hàng`, {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    };

    useEffect(() => {
        if (!product) return;

        const fetchSimilarProducts = async () => {
            if (!product?.name || !product?.productType) return;

            setLoadingSimilar(true);
            try {
                const response = await productApi.products.getProductsSimilar(product.name, product.productType);

                if (response.success) {
                    const productsArray = Array.isArray(response?.products) ? response.products : [];
                    const filtered = productsArray.filter((p) => p && p._id && p._id !== product._id).slice(0, 4);
                    setSimilarProducts(filtered);
                }
            } catch (error) {
                console.error('Error:', error);
                setSimilarProducts([]);
            } finally {
                setLoadingSimilar(false);
            }
        };

        const fetchSameCategory = async () => {
            if (!product?.productType) return;

            setLoadingSimilar(true);
            try {
                const response = await productApi.products.getProductByCategory(product.productType);
                console.log('a', response);
                // Ensure response is an array
                const productsArray = Array.isArray(response) ? response : (Array.isArray(response?.products) ? response.products : []);
                const filtered = productsArray.filter((p) => p && p._id && p._id !== product._id).slice(0, 4);
                setSameCategoryProducts(filtered);
            } catch (error) {
                console.error('Error fetching similar products:', error);
                setSameCategoryProducts([]);
            } finally {
                setLoadingSimilar(false);
            }
        };

        fetchSameCategory();
        fetchSimilarProducts();
    }, [product]);

    const getSpecifications = (product) => {
        const filterMappings = {
            Laptop: {
                'Thương hiệu': product.brand,
                RAM: product.ram,
                CPU: product.CPU,
                'Màn hình': product.screen_size,
                'Ổ cứng': product.hard_drive,
                'Card đồ họa': product.graphics_card,
                'Nhu cầu sử dụng': product.usage_demain,
                'Khối lượng': product.weight,
                'Độ phân giải': product.resolution,
                'Điểm nổi bật': product.special_features,
            },
            Phone: {
                'Thương hiệu': product.brand,
                'Bộ nhớ trong': product.internal_storage,
                RAM: product.RAM_capacity,
                'Hệ điều hành': product.operating_system,
                'Nhu cầu sử dụng': product.usage_demand,
                'Tính năng nổi bật': product.special_features,
            },
            TV: {
                'Kích thước màn hình': product.screen_size,
                'Độ phân giải': product.resolution,
                'Loại màn hình': product.panel_type,
                'Tần số quét': product.refresh_rate,
                'Công nghệ điều chỉnh ánh sáng': product.hdr_support,
                'Nền tảng thông minh': product.smart_platform,
                'Các thiết bị có thể kết nối': product.connectivity,
                'Cổng audio': product.audio_output,
                'Tính năng nổi bật': product.special_features,
            },
            Watch: {
                'Thương hiệu': product.brand,
                'Tương thích': product.compatibility,
                'Khối lượng': product.weight,
                'Màn hình': product.screen,
                'Khả năng chống nước, chống bụi': product.water_dust_resistance,
                'Tính năng dần cho sức khỏe': product.health_features,
                'Chất liệu dây đeo': product.strap_material,
                'Thời lượng pin': product.battery_life,
                'Thời gian sạc': product.charging_time,
                'Tính năng nổi bật': product.special_features,
                'Chế độ luyện tập': product.training_modes,
            },
            Camera: {
                'Thương hiệu': product.brand,
                'Loại máy ảnh': product.camera_type,
                'Độ phân giải': product.camera_resolution,
                'Độ cảm ứng': product.camera_sensor,
                Lens: product.camera_lens,
                'Hệ thống lấy nét tự động': product.autofocus_system,
                'Chế độ chống rung': product.image_stabilization,
                'Thời lượng pin': product.battery_life,
                'Khả năng chống bụi và chống nước': product.water_dust_resistance,
                'Cổng kết nối': product.connectivity,
                'Kích thước': product.size,
                'Vật đính kèm': product.included_accessories,
                'Loại màn hình': product.screen_type,
            },
            PC: {
                CPU: product.CPU_type,
                RAM: product.RAM_capacity,
                'Loại RAM': product.RAM_type,
                'Số lượng cổng RAM': product.number_of_RAM_slots,
                'Khối lượng': product.PC_weight,
                'Loại PC': product.PC_type,
                'Nguồn điện': product.power_supply,
                'Card đồ họa': product.graphics_card,
                Chipset: product.chipset,
                'Đặc điểm cổng I/O': product.features_of_rear_IO_ports,
                'Tính năng nổi bật': product.special_features,
            },
            Monitor: {
                'Loại màn hình': product.screen_type,
                'Kích thước màn hình': product.Monitor_size,
                'Độ phân giải': product.resolution,
                'Khối lượng màn hình': product.Monitor_weight,
                'Tần số quét': product.refresh_rate,
                'Thời gian phản hồi': product.response_time,
                'Tỉ lệ màn hình': product.monitor_ratio,
                'Tỉ lệ tương phản tĩnh': product.static_contrast_ratio,
                'Tỉ lệ tương phản động': product.dynamic_contrast_ratio,
                'Góc nhìn': product.viewing_angle,
                'Độ sáng màn hình': product.brightness,
                'Độ phủ màu': product.color_coverage,
                'Cổng kết nối': product.connection_ports,
                'Công dụng khác': product.other_utilities,
                'Tính năng nổi bật': product.special_features,
            },
        };

        return filterMappings[product.productType] || {};
    };

    const renderRatingBars = (ratings) => {
        const totalRatings = ratings.length;
        const ratingCounts = [0, 0, 0, 0, 0];
   
        ratings.forEach(rating => {
            if (rating.star >= 1 && rating.star <= 5) {
                ratingCounts[rating.star - 1]++;
            } else {
                console.warn('Invalid rating:', rating); // Log any invalid ratings
            }
        });

        console.log('Rating Counts:', ratingCounts); // Log the rating counts array

        return ratingCounts.reverse().map((count, index) => (
            <div key={index} className="rating-bar">
                <span>{5 - index} sao</span>
                <div className="bar">
                    <div
                        className="filled-bar"
                        style={{ width: count > 0 ? `${(count / totalRatings) * 100}%` : '0%' }}
                    ></div>
                </div>
                <span>{count} đánh giá</span>
            </div>
        ));
    }
    
    if (!product) return <div className="not-found">Không tìm thấy sản phẩm</div>;

    const getVersionDifference = (baseName, versionName) => {
        // Split names into words
        const baseWords = baseName.split(' ');
        const versionWords = versionName.split(' ');

        // Find different words
        const differences = versionWords.filter((word, index) => {
            // Check if word is different from base name
            return (
                word !== baseWords[index] &&
                // Only include specs/numbers and common version identifiers
                /(\d+(\.\d+)?\s*(K|inch|GB|TB|MHz|W|QN|QN85D|QN800D|2024)|Standard|Pro|Lite|Plus|Max|8K|4K)\b/i.test(
                    word,
                )
            );
        });

        return differences.join(' ');
    };
    return (
        <div className="container-pd">
            <ToastContainer />
            <Nav />
            <div className="product-detail-pd">
                <div className="product-content-pd">
                    <div className="product-image-section-pd">
                        <div className="main-image-pd">
                            <button
                                className="nav-btn prev"
                                onClick={() => setCurrentImage((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))}
                            >
                                <i className="fas fa-chevron-left"></i>
                            </button>
                            <img src={allImages[currentImage]} alt={product.name} />
                            <button
                                className="nav-btn next"
                                onClick={() => setCurrentImage((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))}
                            >
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>

                        <div className="thumbnail-gallery-pd">
                            {allImages.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`${product.name} ${index + 1}`}
                                    className={`thumbnail ${currentImage === index ? 'active' : ''}`}
                                    onClick={() => setCurrentImage(index)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="product-info-pd">
                        <h1>{product.nameDetail}</h1>
                        {similarProducts.length > 0 && (
                            <div className="product-versions">
                                <h3>Các phiên bản khác:</h3>
                                <div className="versions-grid">
                                    {similarProducts.map((version) => (
                                        <div
                                            key={version._id}
                                            className={`version-item ${version._id === product._id ? 'active' : ''}`}
                                            onClick={() => {
                                                navigate(`/user/product/${version._id}`);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                        >
                                            <div className="version-details">
                                                <p>{getVersionDifference(product.nameDetail, version.nameDetail)}</p>
                                                <span className="version-price">{formatPrice(version.price)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="rating-section-pd">
                            <div className="rating-pd">
                                {[...Array(5)].map((_, index) => (
                                    <span
                                        key={index}
                                        className={`star-pd ${
                                            index < (product.avgStar || 0) ? 'filled-pd' : 'empty-pd'
                                        }`}
                                    >
                                        {index < (product.avgStar || 0) ? '★' : '☆'}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="price-section-pd">
                            <div className="price-pd">{formatPrice(product.price)}</div>
                            <div className="stock-pd">Còn hàng: {product.quantity} sản phẩm</div>
                        </div>

                        <div className="quantity-section-pd">
                            <span>Số lượng:</span>
                            <div className="quantity-selector-pd">
                                <button onClick={() => handleQuantityChange('decrease')}>-</button>
                                <span>{quantity}</span>
                                <button onClick={() => handleQuantityChange('increase')}>+</button>
                            </div>
                        </div>

                        <div className="action-buttons-pd">
                            <button className="add-to-cart-pd" onClick={handleAddToCart}>
                                Thêm vào giỏ hàng
                            </button>
                            <button className="buy-now-pd" onClick={handleBuyNow}>
                                Mua ngay
                            </button>
                        </div>

                        <div className="product-tabs">
                            <div className="tab-navigation">
                                <button
                                    className={`tab-button ${activeTab === 'description' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('description')}
                                >
                                    Mô tả sản phẩm
                                </button>
                                <button
                                    className={`tab-button ${activeTab === 'specifications' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('specifications')}
                                >
                                    Thông số kỹ thuật
                                </button>
                            </div>

                            <div className="tab-content">
                                {activeTab === 'description' && (
                                    <div className="description-content">
                                        <p>{product.description}</p>
                                    </div>
                                )}
                                {activeTab === 'specifications' && (
                                    <div className="specifications-content">
                                        <table className="specs-table-pd">
                                            <tbody>
                                                {Object.entries(getSpecifications(product)).map(
                                                    ([key, value]) =>
                                                        value &&
                                                        value !== 'N/A' && (
                                                            <tr key={key}>
                                                                <td className="spec-key-pd">{key}:</td>
                                                                <td className="spec-value-pd">{value}</td>
                                                            </tr>
                                                        ),
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="reviews-content">
                    <h2>Đánh giá và nhận xét {product.nameDetail}</h2>
                    <div className="average-rating">
                        <div
                            className={`average-rating-value ${
                                product.ratings && product.ratings.length > 0 ? 'has-ratings' : ''
                            }`}
                        >
                            {product.avgStar} ★
                        </div>
                        <div className="rating-bars">{renderRatingBars(product.ratings)}</div>
                    </div>
                    {product.ratings && product.ratings.length > 0 ? (
                        product.ratings.map((review, index) => (
                            <div key={index} className="review-item">
                                <div className="review-header">
                                    <div className="info">
                                        <img src={review.postedBy.avatar} alt={review.postedBy.fullName} />
                                        <span className="reviewer-name">{review.postedBy.fullName || 'Ẩn danh'}</span>
                                    </div>
                                    <span className="rating">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={`star ${i < review.star ? 'filled' : 'empty'}`}>
                                                {i < review.star ? '★' : '☆'}
                                            </span>
                                        ))}
                                    </span>
                                </div>
                                <div className="review-text">{review.comment}</div>
                            </div>
                        ))
                    ) : (
                        <div>Chưa có đánh giá nào</div>
                    )}
                </div>
                {sameCategoryProducts.length > 0 && (
                    <div className="same-category-products">
                        <h3>Các sản phẩm tương tự</h3>
                        <div className="products-grid">
                            {sameCategoryProducts.map((product) => (
                                <div
                                    key={product._id}
                                    className="product-item"
                                    onClick={() => {
                                        navigate(`/user/product/${product._id}`);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                >
                                    <img src={product.thumbnail} alt={product.name} />
                                    <div className="product-details">
                                        <h4>{product.name}</h4>
                                        <span className="product-price">{formatPrice(product.price)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default ProductDetail;
