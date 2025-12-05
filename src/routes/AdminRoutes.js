// AdminRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminHome from '../pages/Admin/AdminHome/AdminHome';
import Customers from '../pages/Admin/customers/customers';
import Orders from '../pages/Admin/order/orders';
import Products from '../pages/Admin/products/products';
import AdminLayout from '../pages/Admin/Layout/adminLayout';
import Coupon from '../pages/Admin/coupon/coupon';
import Notifications from '../pages/Admin/notification/Notifications';
const AdminRoutes = () => {
    return (
        <Routes>
            <Route element={<AdminLayout />}>
                <Route path="/" element={<AdminHome />} />
                <Route path="home" element={<AdminHome />} />
                <Route path="customers/*" element={<Customers />} />
                <Route path="orders/*" element={<Orders />} />
                <Route path="products/*" element={<Products />} />
                <Route path="coupon/*" element={<Coupon />} />
                <Route path="create-notification" element={<Notifications />} />
            </Route>
        </Routes>
    );
};

export default AdminRoutes;
