import React, { useState, useEffect } from 'react';
import Nav from '../../Nav';
import '../../../assets/css/coupon.css';
import { getCoupons } from '../../../services/coupon';

const CouponList = () => {
    const [coupons, setCoupons] = useState([]);
    useEffect(() => {
        const getCoupon = async () => {
            const res = await getCoupons();
            setCoupons(res.coupons);
        };
        getCoupon();
    }, []);
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    return (
        <div className="coupon-container">
            <Nav />
            <h1>Danh sách Coupon</h1>
            <div className="coupon-list">
                {coupons.map((coupon) => (
                    <div key={coupon.name} className="coupon-card">
                        <div className="coupon-discount-t">{coupon.discount}%</div>
                        <div className="coupon-info">
                            <h2>{coupon.name}</h2>
                            <span className="expire-date">HSD: {formatDate(coupon.expire)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CouponList;
