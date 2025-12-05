import React, { useState, useEffect, useContext } from 'react';
import { FaStar } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import productApi from '../../../services/product';
import '../css/ReviewForm.css';

const ReviewForm = ({ product, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    
    const navigate = useNavigate();
    const { orderId } = useParams();
    const { user } = useContext(UserContext);
    const [userData, setUserData] = useState({
        fullName: '',
        email: ''
    });

    const validateForm = () => {
        if (rating === 0) {
            setError('Vui lòng chọn số sao đánh giá');
            return false;
        }
        if (!reviewText.trim()) {
            setError('Vui lòng nhập nhận xét của bạn');
            return false;
        }
        return true;
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
    
        if (!validateForm()) return;
    
        setIsSubmitting(true);
        try {
            const ratingData = {
                star: rating,
                comment: reviewText,
            };
            await productApi.products.rate(product.id, ratingData);
    
            // Update the product's review status
            const updatedProduct = { ...product, reviewed: true };
    
            // Show success message and navigate back
            setShowNotification(true);
            setTimeout(() => {
                setShowNotification(false);
                navigate('/user/order-check', { 
                    state: { 
                        updatedOrder: {
                            orderId,
                            products: [updatedProduct]
                        }
                    } 
                });
            }, 2000);
    
        } catch (err) {
            // setError('Có lỗi xảy ra, vui lòng thử lại');
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleBack = () => {
        navigate(-1); // Go back to previous page
    };

    useEffect(() => {
        // Fallback to localStorage if context is not available
        if (!user) {
            const localUser = JSON.parse(localStorage.getItem('user')) || {};
            const registeredUsers = JSON.parse(localStorage.getItem('users') || '[]');
            const currentUser = registeredUsers.find(u => u.email === localUser.email) || {};
            setUserData(currentUser);
        } else {
            setUserData(user);
        }
    }, [user]);
    
    return (
        <div className="review-form-container-rf">
        {showNotification && (
            <div className="notification-rf success-rf">
                Đánh giá của bạn đã được ghi nhận!
            </div>
        )}
        {error && (
            <div className="notification-rf error-rf">
                {error}
            </div>
        )}
        <div className="back-button-container-rf">
            <button onClick={() => navigate(-1)} className="back-button-rf">
                ← Quay lại chi tiết đơn hàng
            </button>
        </div>
        <div className="product-info-rf">
            <img src={product.image} alt={product.name} className="product-image-rf" />
            <h2>{product.name}</h2>
        </div>
        
        <div className="review-content-rf">
            <h3>Đánh giá sản phẩm</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group-rf">
                    <label>Đánh giá</label>
                    <div className="star-rating-rf">
                        {[...Array(5)].map((_, index) => {
                            const ratingValue = index + 1;
                            return (
                                <label key={index}>
                                    <input
                                        type="radio"
                                        name="rating"
                                        value={ratingValue}
                                        onClick={() => setRating(ratingValue)}
                                    />
                                    <FaStar
                                        className="star-rf"
                                        color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                                        onMouseEnter={() => setHover(ratingValue)}
                                        onMouseLeave={() => setHover(0)}
                                    />
                                </label>
                            );
                        })}
                    </div>
                </div>


                <div className="form-group-rf">
                    <label>Nhận xét của bạn</label>
                    <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                        className="textarea-rf"
                    />
                </div>

                <button 
                    type="submit" 
                    className="submit-button-rf" 
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                </button>
            </form>
        </div>
    </div>
    );
};

export default ReviewForm;