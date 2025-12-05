// CouponForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createCoupon, updateCoupon, getCoupons } from '../../../services/coupon';
import Swal from 'sweetalert2';
import createNotification from '../../../services/createNotification';
import './couponForm.css';

const CouponForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [couponData, setCouponData] = useState({
        name: '',
        discount: '',
        expire: '',
        description: '',
    });

    useEffect(() => {
        if (id) fetchCouponDetails();
    }, [id]);

    const fetchCouponDetails = async () => {
        try {
            setIsLoading(true);
            const response = await getCoupons();
            if (response.success) {
                const coupon = response.coupons.find((c) => c._id === id);
                if (coupon) {
                    setCouponData({
                        name: coupon.name,
                        discount: coupon.discount * 100,
                        expire: new Date(coupon.expire).toISOString().split('T')[0],
                        description: coupon.description || '',
                    });
                } else {
                    throw new Error('Không tìm thấy mã giảm giá');
                }
            }
        } catch (error) {
            Swal.fire({
                title: 'Lỗi',
                text: error.message || 'Không thể tải thông tin mã giảm giá',
                icon: 'error',
            });
            navigate('..');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setIsLoading(true);
            const data = {
                ...couponData,
                discount: Number(couponData.discount * 0.01),
                expire: new Date(couponData.expire),
            };

            const response = id ? await updateCoupon(id, data) : await createCoupon(data);

            if (response.success) {
                if (!id) {
                    await createNotification.createNotification({
                        selectedUsers: [],
                        title: 'Coupon mới',
                        content: `Có mã giảm giá mới: ${couponData.name} - Giảm ${couponData.discount}%`,
                        type: 'coupon',
                        toUrl: '/user/coupon',
                    });
                }

                Swal.fire({
                    title: 'Thành công',
                    text: id ? 'Cập nhật mã giảm giá thành công' : 'Thêm mã giảm giá mới thành công',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                });

                navigate('..');
            }
        } catch (error) {
            Swal.fire('Lỗi', error.response?.data?.message || 'Có lỗi xảy ra', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const validateForm = () => {
        const errors = [];

        if (!couponData.name.trim()) {
            errors.push('Vui lòng nhập tên mã giảm giá');
        }

        if (
            !couponData.discount ||
            isNaN(couponData.discount) ||
            Number(couponData.discount) <= 0 ||
            Number(couponData.discount) > 100
        ) {
            errors.push('Phần trăm giảm giá phải từ 1-100');
        }

        if (!couponData.expire) {
            errors.push('Vui lòng chọn ngày hết hạn');
        }

        if (errors.length) {
            Swal.fire({
                title: 'Lỗi',
                html: errors.join('<br>'),
                icon: 'error',
            });
            return false;
        }
        return true;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCouponData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="container">
            <div className="wrapper">
                <div className="form-card">
                    <div className="form-header">
                        <div className="title-group">
                            <span className="title-icon">🏷️</span>
                            <h1 className="title">{id ? 'Cập nhật mã giảm giá' : 'Thêm mã giảm giá mới'}</h1>
                        </div>
                        <div className="header-actions">
                            <button
                                className="btn cancel-btn-coupon"
                                onClick={() => navigate('..')}
                                disabled={isLoading}
                            >
                                ✕ Hủy
                            </button>
                            <button className="btn submit-btn-coupon" onClick={handleSubmit} disabled={isLoading}>
                                + {id ? 'Cập nhật' : 'Thêm mới'}
                            </button>
                        </div>
                    </div>

                    <div className="form-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">
                                    <span className="label-icon">🏷️</span>
                                    Tên mã giảm giá
                                    <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={couponData.name}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="Nhập tên mã giảm giá"
                                    maxLength={50}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">
                                        <span className="label-icon">%</span>
                                        Phần trăm giảm giá
                                        <span className="required">*</span>
                                    </label>
                                    <div className="input-group">
                                        <input
                                            type="number"
                                            name="discount"
                                            value={couponData.discount}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            placeholder="Nhập phần trăm"
                                            min="1"
                                            max="100"
                                        />
                                        <span className="input-icon">%</span>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        <span className="label-icon">📅</span>
                                        Ngày hết hạn
                                        <span className="required">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="expire"
                                        value={couponData.expire}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {isLoading && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                </div>
            )}
        </div>
    );
};

export default CouponForm;
