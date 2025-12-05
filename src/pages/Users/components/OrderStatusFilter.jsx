import React from 'react';
import '../css/OrderStatusFilter.css'; 

const OrderStatusFilter = ({ selectedStatus, onSelectStatus }) => {
    const statuses = [
        'Tất cả',
        'Chờ xác nhận/Thanh toán',
        'Chờ giao hàng',
        'Đang vận chuyển',
        'Hoàn thành',
        'Đã hủy',
        'Đang xử lý trả hàng',
        'Trả hàng/Hoàn tiền'
    ];

    return (
        <div className="order-status-filter-osf">
            {statuses.map(status => (
                <button
                    key={status}
                    className={selectedStatus === status ? 'active' : ''}
                    onClick={() => onSelectStatus(status)}
                >
                    {status}
                </button>
            ))}
        </div>
    );
};

export default OrderStatusFilter;