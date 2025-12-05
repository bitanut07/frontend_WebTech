import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useCustomerList } from './handleCustomer';
import Swal from 'sweetalert2';
import './customersList.css';

const CustomerList = () => {
    const navigate = useNavigate();

    const {
        states: { filter, searchQuery, loading, error, selectedCustomers, isAdmin, filteredCustomers },
        handlers: { setFilter, setSearchQuery, toggleCustomerSelection, handleDeleteSelected },
    } = useCustomerList();

    const displayedCustomers = useMemo(() => {
        if (!filteredCustomers) return [];
        switch (filter) {
            case 'Active':
                return filteredCustomers.filter((customer) => customer.status === 'Active');
            case 'Blocked':
                return filteredCustomers.filter((customer) => customer.status === 'Blocked');
            default:
                return filteredCustomers;
        }
    }, [filter, filteredCustomers]);
    const handleShowDeleteConfirm = () => {
        Swal.fire({
            title: 'Xác nhận xóa',
            text: `Bạn có chắc chắn muốn xóa ${selectedCustomers.length} người dùng đã chọn?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
        }).then(async (result) => {
            if (result.isConfirmed) {
                await handleDeleteSelected();
            }
        });
    };

    const onSearchChange = (event) => {
        setSearchQuery(event.target.value); // Chỉ cập nhật searchQuery, không gọi API
    };
    const handleCustomerClick = (customerId) => {
        navigate(`detail/${customerId}`);
    };

    if (loading) return <div className="customers-loading">Đang tải danh sách người dùng...</div>;
    if (error || !isAdmin) return <div className="customers-error">{error || 'Bạn không có quyền truy cập'}</div>;

    return (
        <div className="customers-page">
            <div className="customers-search-section">
                <div className="customers-search-container">
                    <input
                        className="customers-search-box"
                        type="text"
                        placeholder="Tìm kiếm theo tên..."
                        value={searchQuery}
                        onChange={onSearchChange}
                    />
                    <button className="customers-search-btn">
                        <FontAwesomeIcon icon={faSearch} /> Tìm kiếm
                    </button>
                </div>
            </div>

            <div className="customers-content">
                <div className="customers-tabs">
                    <div className="tab-list">
                        {['All', 'Active', 'Blocked'].map((filterType) => (
                            <button
                                key={filterType}
                                className={`tab-item ${filter === filterType ? 'active' : ''}`}
                                onClick={() => setFilter(filterType)}
                            >
                                {filterType === 'All' ? 'Tất cả' : filterType === 'Active' ? 'Hoạt động' : 'Đã khóa'}
                            </button>
                        ))}
                    </div>
                    {selectedCustomers.length > 0 && (
                        <div className="bulk-actions">
                            <button className="delete-selected-btn" onClick={handleShowDeleteConfirm}>
                                <FontAwesomeIcon icon={faTrash} />
                                Xóa {selectedCustomers.length} người dùng đã chọn
                            </button>
                        </div>
                    )}
                </div>

                <div className="customers-grid-wrapper">
                    <div className="customers-grid">
                        {displayedCustomers.map((customer) => (
                            <div
                                key={customer.id}
                                className="customers-card"
                                onClick={() => handleCustomerClick(customer.id)}
                            >
                                <div className="customers-card-header">
                                    <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        checked={selectedCustomers.includes(customer.id)}
                                        onChange={() => toggleCustomerSelection(customer.id)}
                                    />
                                </div>
                                <div className="customers-avatar">
                                    {customer.avatar ? (
                                        <img
                                            src={customer.avatar}
                                            alt={`${customer.name}'s avatar`}
                                            onError={(e) => {
                                                e.target.src = '/default-avatar.png';
                                                e.target.onerror = null;
                                            }}
                                        />
                                    ) : (
                                        <div className="default-avatar">{customer.name.charAt(0).toUpperCase()}</div>
                                    )}
                                </div>
                                <h3 className="customers-list-name">{customer.name}</h3>
                                <p className="customers-email">{customer.email}</p>

                                <div className={`customers-status ${customer.status.toLowerCase()}`}>
                                    {customer.status === 'Active' ? 'Hoạt động' : 'Đã khóa'}
                                </div>

                                <div className="customers-details">
                                    <p>Đơn hàng: {customer.orders}</p>
                                    <p>Số dư: {customer.balance}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerList;
