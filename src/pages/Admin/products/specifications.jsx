// src/components/product/ProductSpecifications.jsx
import React from 'react';

const ProductSpecifications = ({ product, isEditing = false, onSpecChange, error }) => {
    if (!product) return null;

    const renderSpecificationFields = () => {
        const productSpecs = {
            Laptop: [
                { name: 'ram', label: 'RAM', required: true },
                { name: 'screen_size', label: 'Kích thước màn hình', required: true },
                { name: 'CPU', label: 'CPU', required: true },
                { name: 'hard_drive', label: 'Ổ cứng', required: true },
                { name: 'usage_demain', label: 'Nhu cầu sử dụng' },
                { name: 'graphics_card', label: 'Card đồ họa' },
                { name: 'brand', label: 'Thương hiệu' },
                { name: 'weight', label: 'Cân nặng' },
                { name: 'resolution', label: 'Độ phân giải' },
            ],
            TV: [
                { name: 'tv_size', label: 'Kích thước TV', required: true },
                { name: 'resolution_type', label: 'Loại độ phân giải', required: true },
                { name: 'CPU', label: 'CPU', required: true },
                { name: 'screen_type', label: 'Loại màn hình', required: true },
                { name: 'tv_type', label: 'Loại TV' },
                { name: 'refresh_rate', label: 'Tần số quét' },
                { name: 'brand', label: 'Thương hiệu' },
                { name: 'processor', label: 'Bộ xử lý' },
                { name: 'sound_technologies', label: 'Công nghệ âm thanh' },
                { name: 'operating_system', label: 'Hệ điều hành' },
            ],
            Phone: [
                { name: 'internal_storage', label: 'Bộ nhớ trong', required: true },
                { name: 'RAM_capacity', label: 'Dung lượng RAM', required: true },
                { name: 'screen_size', label: 'Kích thước màn hình', required: true },
                { name: 'operating_system', label: 'Hệ điều hành', required: true },
                { name: 'special_features', label: 'Tính năng đặc biệt' },
                { name: 'usage_demand', label: 'Nhu cầu sử dụng' },
            ],
            Watch: [
                { name: 'screen', label: 'Màn hình', required: true },
                { name: 'brand', label: 'Thương hiệu', required: true },
                { name: 'water_dust_resistance', label: 'Chống nước/bụi' },
                { name: 'battery_life', label: 'Thời lượng pin' },
                { name: 'charging_time', label: 'Thời gian sạc' },
                { name: 'compatibility', label: 'Tương thích' },
                { name: 'health_features', label: 'Tính năng sức khỏe' },
                { name: 'training_modes', label: 'Chế độ luyện tập' },
            ],
            Camera: [
                { name: 'brand', label: 'Thương hiệu', required: true },
                { name: 'camera_type', label: 'Loại máy ảnh', required: true },
                { name: 'camera_sensor', label: 'Cảm biến', required: true },
                { name: 'camera_resolution', label: 'Độ phân giải', required: true },
                { name: 'camera_lens', label: 'Ống kính' },
                { name: 'autofocus_system', label: 'Hệ thống lấy nét' },
                { name: 'image_stabilization', label: 'Chống rung' },
                { name: 'battery_life', label: 'Thời lượng pin' },
                { name: 'connectivity', label: 'Kết nối' },
            ],
            PC: [
                { name: 'PC_type', label: 'Loại PC', required: true },
                { name: 'CPU_type', label: 'Loại CPU', required: true },
                { name: 'RAM_capacity', label: 'Dung lượng RAM', required: true },
                { name: 'PC_weight', label: 'Cân nặng' },
                { name: 'power_supply', label: 'Nguồn điện' },
                { name: 'PC_socket', label: 'Socket' },
                { name: 'graphics_card', label: 'Card đồ họa' },
                { name: 'RAM_type', label: 'Loại RAM' },
                { name: 'hard_drive', label: 'Ổ cứng' },
                { name: 'chipset', label: 'Chipset' },
            ],
            Monitor: [
                { name: 'Monitor_size', label: 'Kích thước màn hình', required: true },
                { name: 'resolution', label: 'Độ phân giải', required: true },
                { name: 'Monitor_weight', label: 'Cân nặng' },
                { name: 'refresh_rate', label: 'Tần số quét' },
                { name: 'response_time', label: 'Thời gian phản hồi' },
                { name: 'monitor_ratio', label: 'Tỷ lệ màn hình' },
                { name: 'brightness', label: 'Độ sáng' },
                { name: 'screen_type', label: 'Loại màn hình' },
                { name: 'connectivity_ports', label: 'Cổng kết nối' },
            ],
        };

        if (!product?.productType) return null;

        const specs = productSpecs[product.productType];
        if (!specs) return null;

        return (
            <div className="form-section">
                <h2>Thông số kỹ thuật {product.productType}</h2>
                {error && <div className="error-message">{error}</div>}
                <div className="specs-grid">
                    {specs.map((field) => (
                        <div className="form-group" key={field.name}>
                            <label>
                                {field.label}
                                {field.required && <span className="required">*</span>}
                            </label>
                            <input
                                type={field.type || 'text'}
                                name={field.name}
                                value={product[field.name] || ''}
                                onChange={(e) => onSpecChange(field.name, e.target.value)}
                                required={field.required}
                                placeholder={`Nhập ${field.label.toLowerCase()}...`}
                                className="form-input"
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return renderSpecificationFields();
};

export default ProductSpecifications;
