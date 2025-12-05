import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCoupons } from '../../../services/coupon';
import Swal from 'sweetalert2';
import './coupon.css';

const CouponList = () => {
    const [coupons, setCoupons] = useState([]);
    const [filteredCoupons, setFilteredCoupons] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCoupons();
    }, []);

    useEffect(() => {
        // Filter coupons whenever the search query changes
        const lowerCaseQuery = searchQuery.toLowerCase();
        const filtered = coupons.filter(
            (coupon) =>
                coupon.name.toLowerCase().includes(lowerCaseQuery) || coupon._id.toLowerCase().includes(lowerCaseQuery),
        );
        setFilteredCoupons(filtered);
    }, [searchQuery, coupons]);

    const fetchCoupons = async () => {
        try {
            setIsLoading(true);
            const response = await getCoupons();
            if (response.success) {
                setCoupons(response.coupons);
                setFilteredCoupons(response.coupons); // Initially show all coupons
            }
        } catch (error) {
            Swal.fire('Lỗi', 'Không thể tải danh sách mã giảm giá', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <div className="coupon-container">
            <div className="coupon-content">
                <div className="coupon-header">
                    <div className="search-add-container">
                        <input
                            className="search-box"
                            type="text"
                            placeholder="Tìm kiếm mã giảm giá..."
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                        <button className="add-btn" onClick={() => handleNavigate('add')}>
                            <span className="icon">+</span>
                            Thêm khuyến mãi
                        </button>
                    </div>
                </div>

                <div className="coupon-content">
                    <div className="coupon-list">
                        {isLoading ? (
                            <p>Đang tải...</p>
                        ) : filteredCoupons.length === 0 ? (
                            <p>Không tìm thấy mã giảm giá nào</p>
                        ) : (
                            filteredCoupons.map((coupon) => (
                                <div
                                    key={coupon._id}
                                    className="coupon-item"
                                    onClick={() => handleNavigate(`edit/${coupon._id}`)}
                                >
                                    <div className="coupon-dot"></div>
                                    <div className="coupon-info">
                                        <div className="coupon-name">{coupon.name}</div>
                                        <div className="coupon-details">
                                            <span className="discount">{(coupon.discount * 100).toFixed(0)}%</span>
                                            <div className="date-range">
                                                <span>{new Date(coupon.expire).toLocaleDateString('vi-VN')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CouponList;
