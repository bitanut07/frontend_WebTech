import React from 'react';
import { Routes, Route } from 'react-router-dom';
import OrderList from './orderList';
import OrderDetail from './orderDetail';

const Orders = () => {
    return (
        <div className="orders-wrapper">
            <Routes>
                <Route index element={<OrderList />} />
                <Route path=":id" element={<OrderDetail />} />
            </Routes>
        </div>
    );
};

export default Orders;
