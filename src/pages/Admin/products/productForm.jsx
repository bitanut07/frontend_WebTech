// src/components/product/ProductForm.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductForm } from './handleProductForm';
import { useProducts, CATEGORIES, TABS } from './handleProduct';
import ProductSpecifications from './spec';
import ImageViewer from './imageViewer';
import './productForm.css';

const ProductForm = () => {
    const navigate = useNavigate();
    const { states, handlers } = useProductForm();
    const { product, loading, error, viewerImage, imagePreview, isEditing } = states;

    const {
        handleChange,
        handleImageUpload,
        handleImageClick,
        handleCloseViewer,
        handleRemoveImage,
        handleSpecChange,
        handleSubmit,
    } = handlers;

    if (loading) return <div className="loading">Đang tải...</div>;

    return (
        <div className="product-form-wrapper">
            <div className="form-header-product">
                <div className="action-buttons-product">
                    <button className="cancel-btn-product" onClick={() => navigate('/admin/products')}>
                        ✕ hủy
                    </button>
                    <button className="submit-btn-product" onClick={handleSubmit}>
                        {isEditing ? '✓ lưu thay đổi' : '+ thêm sản phẩm'}
                    </button>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-container">
                <div className="form-content">
                    {/* Left Column */}
                    <div className="left-column">
                        {/* Thông tin chung */}
                        <div className="form-section">
                            <h2>Thông tin chung</h2>
                            <div className="form-group">
                                <label>
                                    Tên sản phẩm <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={product.name}
                                    onChange={handleChange}
                                    placeholder="Nhập tên sản phẩm..."
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Tên chi tiết <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="nameDetail"
                                    value={product.nameDetail}
                                    onChange={handleChange}
                                    placeholder="Nhập tên chi tiết sản phẩm..."
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Phiên bản</label>
                                <input
                                    type="text"
                                    name="version"
                                    value={product.version}
                                    onChange={handleChange}
                                    placeholder="Nhập phiên bản sản phẩm..."
                                />
                            </div>

                            <div className="form-group">
                                <label>Màu sắc</label>
                                <input
                                    type="text"
                                    name="color"
                                    value={product.color}
                                    onChange={handleChange}
                                    placeholder="Nhập màu sắc sản phẩm..."
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Mô tả <span className="required">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={product.description}
                                    onChange={handleChange}
                                    placeholder="Nhập mô tả sản phẩm..."
                                    rows="4"
                                    required
                                />
                            </div>

                            {/* Media Section */}
                            <div className="media-section">
                                <h2>
                                    Hình ảnh <span className="required">*</span>
                                </h2>
                                {/* Thumbnail */}
                                <div className="upload-group">
                                    <label>Hình ảnh chính</label>
                                    <div className="upload-area">
                                        <div className="upload-content">
                                            <span className="upload-icon">📷</span>
                                            <span className="upload-text">
                                                Kéo thả hình ảnh vào đây hoặc click để chọn file
                                            </span>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="upload-input"
                                            onChange={(e) => handleImageUpload(e, 'thumbnail')}
                                            required={!imagePreview.thumbnail}
                                        />
                                        {imagePreview.thumbnail && (
                                            <div className="preview-list">
                                                <div className="preview-item">
                                                    <img
                                                        src={imagePreview.thumbnail}
                                                        alt="Thumbnail"
                                                        className="preview-thumbnail"
                                                    />
                                                    <button
                                                        className="preview-remove"
                                                        onClick={() => handleRemoveImage('thumbnail')}
                                                        type="button"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* List Images */}
                                <div className="upload-group">
                                    <label>Hình ảnh phụ</label>
                                    <div className="upload-area">
                                        <div className="upload-content">
                                            <span className="upload-icon">📷</span>
                                            <span className="upload-text">
                                                Kéo thả hình ảnh vào đây hoặc click để chọn file
                                            </span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                className="upload-input"
                                                onChange={(e) => handleImageUpload(e, 'listImage')}
                                            />
                                        </div>
                                        {imagePreview.listImage?.length > 0 && (
                                            <div className="preview-list">
                                                {product.listImage.map((image, index) => (
                                                    <div key={index} className="preview-item">
                                                        <img
                                                            src={imagePreview.listImage[index]}
                                                            alt={`Preview ${index + 1}`}
                                                            className="preview-thumbnail"
                                                            onClick={() =>
                                                                handleImageClick(imagePreview.listImage[index])
                                                            }
                                                        />
                                                        <button
                                                            type="button"
                                                            className="preview-remove"
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // Thêm dòng này
                                                                handleRemoveImage('listImage', index);
                                                            }}
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <ProductSpecifications
                            product={product}
                            isEditing={isEditing}
                            onSpecChange={handleSpecChange}
                            error={error}
                        />
                    </div>

                    {/* Right Column */}
                    <div className="right-column">
                        <div className="form-section">
                            <h2>
                                Phân loại <span className="required">*</span>
                            </h2>
                            <div className="form-group">
                                <label>Danh mục sản phẩm</label>
                                <select name="productType" value={product.productType} onChange={handleChange} required>
                                    <option value="">Chọn danh mục</option>
                                    <option value="Laptop">Laptop</option>
                                    <option value="TV">TV</option>
                                    <option value="Phone">Điện thoại</option>
                                    <option value="Watch">Đồng hồ</option>
                                    <option value="Camera">Máy ảnh</option>
                                    <option value="PC">PC</option>
                                    <option value="Monitor">Màn hình</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-section">
                            <div className="form-group">
                                <label>Sản phẩm nổi bật</label>
                                <select name="isFeature" value={product.isFeature.toString()} onChange={handleChange}>
                                    <option value="false">Không</option>
                                    <option value="true">Có</option>
                                </select>
                            </div>
                        </div>
                        {/* Giá và tồn kho */}
                        <div className="form-section">
                            <h2>
                                Giá & Kho hàng <span className="required">*</span>
                            </h2>
                            <div className="form-group">
                                <label>Giá bán (VNĐ)</label>
                                <div className="price-input">
                                    <input
                                        type="number"
                                        name="price"
                                        value={product.price}
                                        onChange={handleChange}
                                        placeholder="Nhập giá bán..."
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Số lượng tồn kho</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={product.stock}
                                    onChange={handleChange}
                                    placeholder="Nhập số lượng..."
                                    min="0"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Giảm giá (%)</label>
                                <input
                                    type="number"
                                    name="discount"
                                    value={product.discount}
                                    onChange={handleChange}
                                    placeholder="Nhập % giảm giá..."
                                    min="0"
                                    max="100"
                                />
                            </div>
                        </div>

                        {/* Trạng thái */}
                        <div className="form-section">
                            <h2>Trạng thái</h2>
                            <div className="form-group">
                                <select name="status" value={product.status} onChange={handleChange} required>
                                    <option value="active">Đang bán</option>
                                    <option value="draft">Nháp</option>
                                    <option value="inactive">Ngừng bán</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="spacer"></div>
                </div>
            </div>
            {viewerImage && <ImageViewer image={viewerImage} onClose={handleCloseViewer} />}
        </div>
    );
};

export default ProductForm;
