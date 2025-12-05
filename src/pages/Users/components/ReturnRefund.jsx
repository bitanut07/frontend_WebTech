import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import orderApi from '../../../services/order';
import '../css/ReturnRefund.css';
import { createReturnRequest } from '../../../services/returnOrder';

const ReturnRefund = () => {
    const navigate = useNavigate();
    const { orderId } = useParams();
    const [images, setImages] = useState([]);
    const [returnReason, setReturnReason] = useState('');
    const [imagePreviewUrls, setImagePreviewUrls] = useState([]);

    useEffect(() => {
        if (!orderId) {
            toast.error('Không tìm thấy mã đơn hàng');
            navigate('/user/order-check');
        }
    }, [orderId, navigate]);

    // Handle image upload
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const currentCount = images.length;

        if (currentCount + files.length > 5) {
            toast.error('Chỉ được chọn tối đa 5 hình ảnh');
            return;
        }

        setImages((prevImages) => [...prevImages, ...files]);

        // Generate preview URLs for new files
        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setImagePreviewUrls((prevUrls) => [...prevUrls, ...newPreviews]);
    };

    const removeImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);

        const newPreviews = [...imagePreviewUrls];
        URL.revokeObjectURL(newPreviews[index]); // Clean up URL
        newPreviews.splice(index, 1);
        setImagePreviewUrls(newPreviews);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!returnReason || images.length === 0) {
            toast.warning('Vui lòng nhập lý do và tải lên ít nhất một hình ảnh');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('orderId', orderId);
            formData.append('reason', returnReason);

            images.forEach((image, index) => {
                formData.append(`images${index}`, image);
            });

            const response = await createReturnRequest(formData);

            if (response.success) {
                toast.success('Yêu cầu trả hàng đã được gửi');
                navigate('/user/order-check');
            } else {
                throw new Error(response.message || 'Failed to create return request');
            }
        } catch (error) {
            console.error('Error creating return request:', error);
            toast.error(error.response?.data?.message || 'Đã có lỗi xảy ra khi gửi yêu cầu');
        }
    };

    return (
        <div className="return-refund-container-rr">
            <h2>Yêu cầu trả hàng/hoàn tiền</h2>
            <form onSubmit={handleSubmit} className="return-refund-form-rr">
                <div className="form-group-rr">
                    <label className="image-upload-label-rr">
                        Hình ảnh hàng
                        <span className="image-count-rr">({imagePreviewUrls.length}/5 hình)</span>
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        required={images.length === 0}
                    />
                    <div className="image-preview-container-rr">
                        {imagePreviewUrls.map((url, index) => (
                            <div key={index} className="image-preview-rr">
                                <img src={url} alt={`Preview ${index + 1}`} />
                                <button type="button" className="remove-image-rr" onClick={() => removeImage(index)}>
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-group-rr">
                    <label>Lý do trả hàng:</label>
                    <textarea
                        value={returnReason}
                        onChange={(e) => setReturnReason(e.target.value)}
                        placeholder="Vui lòng mô tả lý do trả hàng..."
                        required
                    />
                </div>

                <button type="submit" className="submit-btn-rr">
                    Gửi yêu cầu
                </button>
            </form>
            <Link to="/user/order-check" className="back-link-rr">
                <i className="fas fa-arrow-left-rr"></i>
                Quay lại danh sách đơn hàng
            </Link>
            <ToastContainer />
        </div>
    );
};

export default ReturnRefund;
