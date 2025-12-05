// pages/Admin/coupon/coupon.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CouponList from './couponList';
import CouponForm from './couponForm';

const Coupon = () => {
    return (
        <div className="customers-wrapper">
            <Routes>
                <Route path="/" element={<CouponList />} />
                <Route path="add" element={<CouponForm />} />
                <Route path="edit/:id" element={<CouponForm />} />
            </Routes>
        </div>
    );
};

export default Coupon;
