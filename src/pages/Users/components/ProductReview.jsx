// src/pages/ProductReview.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavUser from './NavUser';
import FooterUser from './FooterUser';
import Nav from '../../Nav';
import ReviewForm from './ReviewForm';
import '../css/ProductReview.css'; // Đảm bảo rằng bạn đã import CSS nếu cần

const ProductReview = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const product = location.state?.product;
    const [successMessage, setSuccessMessage] = useState('');

    const handleReviewSubmit = (reviewData) => {
        product.reviewed = true;
        // Logic gửi đánh giá sản phẩm và cập nhật trạng thái đánh giá
        console.log('Đánh giá sản phẩm:', reviewData);
        // Cập nhật trạng thái đánh giá
        product.reviewed = true;
        // Hiển thị thông báo đánh giá thành công
        setSuccessMessage('Đánh giá thành công!');
        // Điều hướng trở lại trang kiểm tra đơn hàng sau 2 giây
        setTimeout(() => {
            navigate('../order-check', { state: { updatedProduct: product } });
        }, 2000);
    };

    return (
        <div>
            <Nav />
            <div className="product-review-container-pr">
                {product ? (
                    <>
                        <ReviewForm product={product} onSubmit={handleReviewSubmit} />
                        {successMessage && <p className="success-message-pr">{successMessage}</p>}
                    </>
                ) : (
                    <p>Không tìm thấy sản phẩm để đánh giá.</p>
                )}
            </div>
        </div>
    );
};

export default ProductReview;
