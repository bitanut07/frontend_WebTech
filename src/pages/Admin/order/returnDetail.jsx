import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './returnDetail.css';

const ReturnDetailModal = ({ isOpen, onClose, returnDetail, onProcess }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    if (!isOpen || !returnDetail) return null;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    // Prevent closing when clicking inside the modal
    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    // Image viewer handlers
    const openImageViewer = (image) => {
        setSelectedImage(image);
    };

    const closeImageViewer = () => {
        setSelectedImage(null);
    };

    return (
        <>
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={handleModalClick}>
                    <div className="modal-header">
                        <h2 className="modal-title">Chi tiết đơn trả hàng</h2>
                        <button className="close-button" onClick={onClose}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>

                    <div className="section">
                        <h3 className="section-title">Thông tin đơn hàng</h3>
                        <div className="info-grid">
                            <div className="info-item">Mã đơn hàng: {returnDetail.order._id}</div>
                            <div className="info-item">Ngày đặt: {formatDate(returnDetail.order.date_order)}</div>
                            <div className="info-item">Tổng tiền: {formatPrice(returnDetail.order.total_price)}</div>
                            <div className="info-item">Giảm giá: {formatPrice(returnDetail.order.discount)}</div>
                        </div>
                    </div>

                    <div className="section">
                        <h3 className="section-title">Thông tin khách hàng</h3>
                        <div className="info-grid">
                            <div className="info-item">Tên: {returnDetail.user.fullName}</div>
                            <div className="info-item">Email: {returnDetail.user.email}</div>
                            <div className="info-item">SĐT: {returnDetail.user.phone}</div>
                        </div>
                    </div>

                    <div className="section">
                        <h3 className="section-title">Thông tin trả hàng</h3>
                        <div className="info-grid">
                            <div className="info-item">Lý do: {returnDetail.reason}</div>
                            <div className="info-item">Trạng thái: {returnDetail.status}</div>
                            <div className="info-item">Ngày yêu cầu: {formatDate(returnDetail.created_at)}</div>
                            <div className="info-item">Mô tả: {returnDetail.description}</div>
                        </div>
                    </div>

                    {returnDetail.images && returnDetail.images.length > 0 && (
                        <div className="section">
                            <h3 className="section-title">Hình ảnh sản phẩm</h3>
                            <div className="images-grid">
                                {returnDetail.images.map((image, index) => (
                                    <div key={index} className="image-container">
                                        <img
                                            src={image}
                                            alt={`Hình ảnh trả hàng ${index + 1}`}
                                            onClick={() => openImageViewer(image)}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="section">
                        <h3 className="section-title">Sản phẩm</h3>
                        <div className="items-list">
                            {returnDetail.order.items.map((item) => (
                                <div key={item._id} className="item-row">
                                    <span>Mã SP: {item.product}</span>
                                    <span>SL: {item.quantity}</span>
                                    <span>{formatPrice(item.price)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {returnDetail.status === 'Pending' && (
                        <div className="action-buttons">
                            <button className="reject-button" onClick={() => onProcess(returnDetail._id, 'Rejected')}>
                                Từ chối
                            </button>
                            <button className="accept-button" onClick={() => onProcess(returnDetail._id, 'Approved')}>
                                Chấp nhận
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {selectedImage && (
                <div
                    className="modal-overlay"
                    onClick={closeImageViewer}
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', zIndex: 1001 }}
                >
                    <div
                        onClick={handleModalClick}
                        style={{ maxWidth: '90%', maxHeight: '90vh', position: 'relative' }}
                    >
                        <button
                            className="close-button"
                            onClick={closeImageViewer}
                            style={{ position: 'absolute', right: '-30px', top: '-30px', color: 'white' }}
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                        <img
                            src={selectedImage}
                            alt="Full size"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '90vh',
                                objectFit: 'contain',
                            }}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default ReturnDetailModal;
