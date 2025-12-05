import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CustomerList from './customerList';
import CustomerDetail from './cusProfile';

const Customers = () => {
    return (
        <div className="customers-wrapper">
            <Routes>
                <Route index element={<CustomerList />} />
                <Route path="detail/:id" element={<CustomerDetail />} />
                <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
        </div>
    );
};

export default Customers;
