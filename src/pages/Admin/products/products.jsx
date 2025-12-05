import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductList from './productList';
import ProductDetail from './productDetail';
import ProductForm from './productForm';

const Products = () => {
    return (
        <div className="products-wrapper">
            <Routes>
                <Route path="/" element={<ProductList />} />
                <Route path="add" element={<ProductForm isEdit={false} />} />
                <Route path=":id" element={<ProductDetail />} />
                <Route path=":id/edit" element={<ProductForm isEdit={true} />} />
            </Routes>
        </div>
    );
};

export default Products;
