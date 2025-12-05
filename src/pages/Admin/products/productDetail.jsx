import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productApi from '../../../services/product';
import './productDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('mô tả');
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(true);

    const isAdmin = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        return user?.role === 'admin';
    };

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const data = await productApi.products.getById(id);
                console.log('Fetching product with ID:', id);
                console.log('Received product data:', data);
                setProduct(data);
                setSelectedImage(data.thumbnail);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [id]);
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };
    const getColorCode = (colorName) => {
        const colorMap = {
            Đen: '#000000',
            Trắng: '#FFFFFF',
            Vàng: '#FFD700',
            Bạc: '#C0C0C0',
            // Thêm các màu khác nếu cần
        };
        return colorMap[colorName] || '#FFFFFF';
    };
    // const handleEditClick = () => {
    //     const user = JSON.parse(localStorage.getItem('user'));
    //     if (!user || user.role !== 'admin') {
    //         alert('Bạn cần có quyền admin để sửa sản phẩm');
    //         return;
    //     }
    //     navigate(`/admin/products/${id}/edit`);
    // };

    if (loading) return <div>Loading...</div>;
    if (!product) return <div>Product not found</div>;

    const renderSpecifications = () => {
        const excludedFields = [
            '_id',
            'name',
            'description',
            'thumbnail',
            'listImage',
            'ratings',
            'createdAt',
            'updatedAt',
            '__v',
            'price',
            'originalPrice',
        ];

        return Object.entries(product).map(([key, value]) => {
            if (!excludedFields.includes(key) && value) {
                return (
                    <div key={key} className="spec-item">
                        <span className="spec-label">{key.replace(/_/g, ' ')}</span>
                        <span className="spec-value">{value}</span>
                    </div>
                );
            }
            return null;
        });
    };

    return (
        <div className="product-detail-wrapper">
            <div className="product-detail-header"></div>

            <div className="product-detail-body">
                <div className={`product-detail-main ${product.isFeature ? 'featured' : ''}`}>
                    {product.isFeature && <div className="featured-badge">Sản phẩm nổi bật ★</div>}
                    <div className="product-gallery">
                        <div className="main-image-container">
                            <img src={selectedImage} alt={product.name} className="main-image" />
                        </div>
                        <div className="image-list">
                            <img
                                src={product.thumbnail}
                                alt="Thumbnail"
                                className={`thumbnail ${selectedImage === product.thumbnail ? 'active' : ''}`}
                                onClick={() => setSelectedImage(product.thumbnail)}
                            />
                            {product.listImage?.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`View ${index + 1}`}
                                    className={`thumbnail ${selectedImage === image ? 'active' : ''}`}
                                    onClick={() => setSelectedImage(image)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="product-info">
                        <div className="product-header">
                            <div className="brand-model">
                                Brand: {product.brand} {product.version && `- ${product.version}`}
                            </div>
                            <h1 className="product-name">{product.name}</h1>
                            <div className="rating">
                                {Array(5)
                                    .fill(0)
                                    .map((_, index) => (
                                        <span
                                            key={index}
                                            className={
                                                index < Math.floor(product.avgStar || 0) ? 'star filled' : 'star'
                                            }
                                        >
                                            {index < Math.floor(product.avgStar || 0) ? '★' : '☆'}
                                        </span>
                                    ))}
                            </div>
                        </div>

                        <div className="price-info">
                            <div className="price-values">
                                <span className="current-price">{formatPrice(product.price)}</span>
                            </div>
                        </div>

                        {/* Thêm hiển thị số lượng */}
                        <div className="quantity-info">
                            <span className="quantity-label">Số lượng còn lại:</span>
                            <span className="quantity-value">{product.quantity}</span>
                        </div>

                        {/* Hiển thị màu sắc */}
                        {product.color && (
                            <div className="color-options">
                                <div className="color-label">Màu sắc:</div>
                                <div className="color-list">
                                    {product.color.map((color, index) => (
                                        <div key={index} className="color-option">
                                            <div
                                                className="color-dot"
                                                style={{
                                                    backgroundColor: getColorCode(color),
                                                    border:
                                                        getColorCode(color) === '#FFFFFF' ? '1px solid #eee' : 'none',
                                                }}
                                            />
                                            <span>{color}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="product-detail-tabs">
                    <div className="tab-header">
                        <button
                            className={`tab-btn ${activeTab === 'mô tả' ? 'active' : ''}`}
                            onClick={() => setActiveTab('mô tả')}
                        >
                            mô tả
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'đánh giá' ? 'active' : ''}`}
                            onClick={() => setActiveTab('đánh giá')}
                        >
                            đánh giá
                        </button>
                    </div>

                    <div className="tab-content">
                        {activeTab === 'mô tả' && (
                            <div className="description-content">
                                <p>{product.description}</p>
                                <div className="product-specs">{renderSpecifications()}</div>
                            </div>
                        )}
                        {activeTab === 'đánh giá' && (
                            <div className="reviews-content">
                                {product.ratings && product.ratings.length > 0 ? (
                                    product.ratings.map((rating, index) => (
                                        <div key={index} className="review-item">
                                            <div className="review-stars">
                                                {Array(5)
                                                    .fill(0)
                                                    .map((_, i) => (
                                                        <span
                                                            key={i}
                                                            className={i < rating.star ? 'star filled' : 'star'}
                                                        >
                                                            {i < rating.star ? '★' : '☆'}
                                                        </span>
                                                    ))}
                                            </div>
                                            <p className="review-text">{rating.comment}</p>
                                            <div className="review-meta">
                                                {new Date(rating.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-reviews">
                                        <span className="no-reviews-icon">📝</span>
                                        <p className="no-reviews-text">Chưa có đánh giá nào cho sản phẩm này</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
