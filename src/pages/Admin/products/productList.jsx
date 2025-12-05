import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faFilter, faCalendar, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useProducts, CATEGORIES, TABS } from './handleProduct';
import './productList.css';
import HighlightText from '../components/HighlightText';
const ProductList = () => {
    const { states, actions } = useProducts();
    const { products, loading, error, currentPage, totalPages, activeTab, selectedCategory, searchQuery, isSearching } =
        states;
    const {
        setActiveTab,
        handlePageChange,
        handleCategoryChange,
        handleDeleteProduct,
        handleProductClick,
        handleSearchChange,
        // handleEditProduct,
        handleAddProduct,
        fetchProducts,
    } = actions;

    if (error) {
        return (
            <div className="error-container">
                <div className="error-message">
                    {error}
                    <button onClick={fetchProducts}>Thử lại</button>
                </div>
            </div>
        );
    }

    return (
        <div className="product-container">
            <div className="product-header">
                <div className="search-section">
                    <input
                        className="search-input"
                        type="text"
                        placeholder="tìm kiếm sản phẩm..."
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />
                    <div className="filter-dropdown">
                        <select
                            value={selectedCategory}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            className="type-filter"
                        >
                            {CATEGORIES.map((category) => (
                                <option key={category.value} value={category.value}>
                                    {category.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button className="add-button" onClick={handleAddProduct}>
                        <FontAwesomeIcon icon={faPlus} /> thêm sản phẩm
                    </button>
                </div>

                <div className="filter-tabs">
                    <div className="status-tabs">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <div className="view-options">
                        {/* <button className="view-button">
                            <FontAwesomeIcon icon={faCalendar} /> ngày
                        </button>
                        <button className="view-button">
                            <FontAwesomeIcon icon={faFilter} /> bộ lọc
                        </button> */}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="loading">Đang tải...</div>
            ) : (
                <>
                    {isSearching && products.length === 0 ? (
                        <div className="no-results">Không tìm thấy sản phẩm phù hợp</div>
                    ) : (
                        <>
                            <div className="product-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>sản phẩm</th>
                                            <th>SKU</th>
                                            <th>phân loại</th>
                                            <th>số lượng</th>
                                            <th>giá cả</th>
                                            <th>trạng thái</th>
                                            <th>brand</th>
                                            <th>thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((product) => (
                                            <tr key={product._id}>
                                                <td className="product-info-table">
                                                    <div
                                                        className="product-info-wrapper"
                                                        onClick={() => handleProductClick(product._id)}
                                                    >
                                                        <img
                                                            src={product.thumbnail || '/placeholder.png'}
                                                            alt={product.name}
                                                            className="product-thumbnail"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = '/placeholder.png';
                                                            }}
                                                        />
                                                        <div className="product-name-list">
                                                            <HighlightText
                                                                text={product.name}
                                                                highlight={searchQuery}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{product._id}</td>
                                                <td>{product.productType || 'N/A'}</td>
                                                <td>{product.quantity}</td>
                                                <td>
                                                    {new Intl.NumberFormat('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND',
                                                    }).format(product.price)}
                                                </td>
                                                <td>
                                                    <span
                                                        className={`status ${
                                                            product.quantity > 0 ? 'in-stock' : 'out-of-stock'
                                                        }`}
                                                    >
                                                        {product.quantity > 0 ? 'Còn hàng' : 'Hết hàng'}
                                                    </span>
                                                </td>
                                                <td>{product.brand || 'N/A'}</td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button
                                                            className="delete-button-table"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteProduct(product._id);
                                                            }}
                                                            title="Xóa"
                                                        >
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {isSearching ? (
                                <div className="search-results">Tìm thấy {products.length} kết quả</div>
                            ) : (
                                totalPages > 1 && (
                                    <div className="pagination">
                                        <button
                                            className="page-button"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            Trước
                                        </button>

                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`page-button ${currentPage === page ? 'active' : ''}`}
                                            >
                                                {page}
                                            </button>
                                        ))}

                                        <button
                                            className="page-button"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        >
                                            Sau
                                        </button>
                                    </div>
                                )
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default ProductList;
