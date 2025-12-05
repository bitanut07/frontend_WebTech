// specifications.js
import React from 'react';

const ProductSpecifications = ({ product, isEditing, onSpecChange, error }) => {
    const handleSpecificationChange = (e) => {
        const { name, value } = e.target;
        onSpecChange({
            target: {
                name: name,
                value: value,
                type: 'specification',
            },
        });
    };
    const renderSpecifications = () => {
        switch (product.productType) {
            case 'Laptop':
                return (
                    <>
                        <div className="form-group">
                            <label>
                                RAM <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                name="ram"
                                value={product.specifications?.ram || ''}
                                onChange={handleSpecificationChange}
                                placeholder="VD: 8GB DDR4"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>
                                Kích thước màn hình <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                name="screen_size"
                                value={product.specifications?.screen_size || ''}
                                onChange={handleSpecificationChange}
                                placeholder="VD: 15.6 inch"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>
                                CPU <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                name="CPU"
                                value={product.specifications?.CPU || ''}
                                onChange={handleSpecificationChange}
                                placeholder="VD: Intel Core i5-12500H"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>
                                Ổ cứng <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                name="hard_drive"
                                value={product.specifications?.hard_drive || ''}
                                onChange={handleSpecificationChange}
                                placeholder="VD: 512GB SSD NVMe"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Card đồ họa</label>
                            <input
                                type="text"
                                name="graphics_card"
                                value={product.specifications?.graphics_card || ''}
                                onChange={handleSpecificationChange}
                                placeholder="VD: NVIDIA GeForce RTX 3050"
                            />
                        </div>
                        <div className="form-group">
                            <label>Thương hiệu</label>
                            <input
                                type="text"
                                name="brand"
                                value={product.specifications?.brand || ''}
                                onChange={handleSpecificationChange}
                                placeholder="VD: Dell"
                            />
                        </div>
                        <div className="form-group">
                            <label>Cân nặng</label>
                            <input
                                type="text"
                                name="weight"
                                value={product.specifications?.weight || ''}
                                onChange={handleSpecificationChange}
                                placeholder="VD: 2.1 kg"
                            />
                        </div>
                        <div className="form-group">
                            <label>Độ phân giải</label>
                            <input
                                type="text"
                                name="resolution"
                                value={product.specifications?.resolution || ''}
                                onChange={handleSpecificationChange}
                                placeholder="VD: 1920x1080"
                            />
                        </div>
                    </>
                );
            case 'TV':
                return (
                    <>
                        <div className="form-group">
                            <label>
                                Kích thước TV <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                name="tv_size"
                                value={product.specifications?.tv_size || ''}
                                onChange={handleSpecificationChange}
                                placeholder="VD: 55 inch"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>
                                Độ phân giải <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                name="resolution_type"
                                value={product.specifications?.resolution_type || ''}
                                onChange={handleSpecificationChange}
                                placeholder="VD: 4K UHD"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>
                                CPU <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                name="CPU"
                                value={product.specifications?.CPU || ''}
                                onChange={handleSpecificationChange}
                                placeholder="VD: Crystal 4K"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>
                                Loại màn hình <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                name="screen_type"
                                value={product.specifications?.screen_type || ''}
                                onChange={handleSpecificationChange}
                                placeholder="VD: QLED"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Tần số quét</label>
                            <input
                                type="text"
                                name="refresh_rate"
                                value={product.specifications?.refresh_rate || ''}
                                onChange={handleSpecificationChange}
                                placeholder="VD: 60Hz"
                            />
                        </div>
                        <div className="form-group">
                            <label>Hệ điều hành</label>
                            <input
                                type="text"
                                name="operating_system"
                                value={product.specifications?.operating_system || ''}
                                onChange={handleSpecificationChange}
                                placeholder="VD: Android TV"
                            />
                        </div>
                    </>
                );

            case 'Phone':
                return (
                    <>
                        <div className="form-group">
                            <label>
                                Bộ nhớ trong <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                name="internal_storage"
                                value={product.specifications?.internal_storage || ''}
                                onChange={handleSpecificationChange}
                                placeholder="VD: 128GB"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>
                                RAM <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                name="RAM_capacity"
                                value={product.specifications?.RAM_capacity || ''}
                                onChange={handleSpecificationChange}
                                placeholder="VD: 8GB"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>
                                Kích thước màn hình <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                name="screen_size"
                                value={product.specifications?.screen_size || ''}
                                onChange={handleSpecificationChange}
                                placeholder="VD: 6.1 inch"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>
                                Hệ điều hành <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                name="operating_system"
                                value={product.specifications?.operating_system || ''}
                                onChange={handleSpecificationChange}
                                placeholder="VD: Android 13"
                                required
                            />
                        </div>
                    </>
                );

            case 'Watch':
                return (
                    <>
                        <div className="form-group">
                            <label>
                                Màn hình <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                name="screen"
                                value={product.specifications?.screen || ''}
                                onChange={handleSpecificationChange}
                                placeholder="VD: AMOLED 1.43 inch"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>
                                Thương hiệu <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                name="brand"
                                value={product.specifications?.brand || ''}
                                onChange={handleSpecificationChange}
                                placeholder="VD: Apple"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Thời lượng pin</label>
                            <input
                                type="text"
                                name="battery_life"
                                value={product.specifications?.battery_life || ''}
                                onChange={handleSpecificationChange}
                                placeholder="VD: 18 giờ"
                            />
                        </div>
                        <div className="form-group">
                            <label>Chống nước, bụi</label>
                            <input
                                type="text"
                                name="water_dust_resistance"
                                value={product.specifications?.water_dust_resistance || ''}
                                onChange={handleSpecificationChange}
                                placeholder="VD: IP68"
                            />
                        </div>
                    </>
                );

            case 'Camera':
                return (
                    <>
                        <div className="form-group">
                            <label>
                                Thương hiệu <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                name="brand"
                                value={product.specifications?.brand || ''}
                                onChange={handleSpecificationChange}
                                placeholder="VD: Canon"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>
                                Loại máy ảnh <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                name="camera_type"
                                value={product.specifications?.camera_type || ''}
                                onChange={handleSpecificationChange}
                                placeholder="VD: DSLR"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>
                                Cảm biến <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                name="camera_sensor"
                                value={product.specifications?.camera_sensor || ''}
                                onChange={handleSpecificationChange}
                                placeholder="VD: CMOS APS-C"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>
                                Độ phân giải <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                name="camera_resolution"
                                value={product.specifications?.camera_resolution || ''}
                                onChange={handleSpecificationChange}
                                placeholder="VD: 24.1MP"
                                required
                            />
                        </div>
                    </>
                );

            case 'PC':
                return (
                    <>
                        <div className="form-group">
                            <label>
                                Loại PC <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                name="PC_type"
                                value={product.specifications?.PC_type || ''}
                                onChange={handleSpecificationChange}
                                placeholder="VD: Desktop"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>
                                CPU <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                name="CPU_type"
                                value={product.specifications?.CPU_type || ''}
                                onChange={handleSpecificationChange}
                                placeholder="VD: Intel Core i7-12700K"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>
                                RAM <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                name="RAM_capacity"
                                value={product.specifications?.RAM_capacity || ''}
                                onChange={handleSpecificationChange}
                                placeholder="VD: 32GB"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Card đồ họa</label>
                            <input
                                type="text"
                                name="graphics_card"
                                value={product.specifications?.graphics_card || ''}
                                onChange={handleSpecificationChange}
                                placeholder="VD: NVIDIA RTX 3060"
                            />
                        </div>
                    </>
                );

            case 'Monitor':
                return (
                    <>
                        <div className="form-group">
                            <label>
                                Kích thước màn hình <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                name="Monitor_size"
                                value={product.specifications?.Monitor_size || ''}
                                onChange={handleSpecificationChange}
                                placeholder="VD: 27 inch"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>
                                Độ phân giải <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                name="resolution"
                                value={product.specifications?.resolution || ''}
                                onChange={handleSpecificationChange}
                                placeholder="VD: 2560x1440"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Tần số quét</label>
                            <input
                                type="text"
                                name="refresh_rate"
                                value={product.specifications?.refresh_rate || ''}
                                onChange={handleSpecificationChange}
                                placeholder="VD: 165Hz"
                            />
                        </div>
                        <div className="form-group">
                            <label>Thời gian phản hồi</label>
                            <input
                                type="text"
                                name="response_time"
                                value={product.specifications?.response_time || ''}
                                onChange={handleSpecificationChange}
                                placeholder="VD: 1ms"
                            />
                        </div>
                    </>
                );

            default:
                return <p>Vui lòng chọn loại sản phẩm</p>;
        }
    };

    return (
        <div className="form-section">
            <h2>Thông số kỹ thuật</h2>
            {product.productType && <div className="specifications-container">{renderSpecifications()}</div>}
        </div>
    );
};

export default ProductSpecifications;
