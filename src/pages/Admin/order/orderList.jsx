import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Range } from 'react-range';
import { useOrders, STATUS_FILTERS, TABS } from './handleOrder';
import ReturnOrder from './returnOrder';
import './orderList.css';
import userService from '../../../services/customerManager';
const PriceRangeSlider = ({ priceRange, setPriceRange }) => {
    const MIN = 0;
    const MAX = 100000000;

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    return (
        <div className="price-range-slider">
            <div className="slider-container">
                <Range
                    step={100000}
                    min={MIN}
                    max={MAX}
                    values={[priceRange.min || MIN, priceRange.max || MAX]}
                    onChange={(values) => setPriceRange({ min: values[0], max: values[1] })}
                    renderTrack={({ props, children }) => (
                        <div
                            {...props}
                            className="slider-track"
                            style={{
                                ...props.style,
                                height: '4px',
                                width: '100%',
                                backgroundColor: '#e5e7eb',
                                background: `linear-gradient(to right, 
                                    #e5e7eb 0%, 
                                    #3b82f6 ${(priceRange.min / MAX) * 100}%, 
                                    #3b82f6 ${(priceRange.max / MAX) * 100}%, 
                                    #e5e7eb 100%)`,
                            }}
                        >
                            {children}
                        </div>
                    )}
                    renderThumb={({ props }) => (
                        <div
                            {...props}
                            className="slider-thumb"
                            style={{
                                ...props.style,
                                height: '16px',
                                width: '16px',
                                backgroundColor: '#3b82f6',
                                borderRadius: '50%',
                                cursor: 'pointer',
                            }}
                        />
                    )}
                />
            </div>
            <div className="price-range-values">
                <span>{formatPrice(priceRange.min || MIN)}</span>
                <span>{formatPrice(priceRange.max || MAX)}</span>
            </div>
        </div>
    );
};

const UserIdLink = ({ userId, onMouseEnter, onMouseLeave }) => {
    const handleClick = (e) => {
        e.stopPropagation();
    };

    return (
        <Link
            to={`/admin/customers/detail/${userId}`}
            onClick={handleClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className="user-id-link"
        >
            {userId}
        </Link>
    );
};

const OrderList = () => {
    const navigate = useNavigate();
    const { states, setters, handlers } = useOrders();
    const [userDetails, setUserDetails] = useState({});
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [activePopup, setActivePopup] = useState(null);
    const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
    const {
        activeTab,
        activeStatusFilter,
        searchQuery,
        orders,
        loading,
        error,
        startDate,
        endDate,
        priceRange,
        showFilters,
    } = states;

    const { setActiveTab, setActiveStatusFilter, setStartDate, setEndDate, setPriceRange, setShowFilters } = setters;

    const { fetchOrders, handleSearch, filterOrders, searchOrders } = handlers;

    useEffect(() => {
        const loadData = async () => {
            await fetchOrders();
            if (orders?.length) {
                await fetchUserDetails(orders);
            }
        };

        loadData();
    }, [activeStatusFilter]);
    const handleUserHover = (userId, event) => {
        const rect = event.target.getBoundingClientRect();
        setPopupPosition({
            top: rect.bottom + window.scrollY + 5,
            left: rect.left + window.scrollX,
        });
        setActivePopup(userId);
    };

    const fetchUserDetails = async (orders) => {
        setLoadingUsers(true);
        const userDetailsMap = {};

        try {
            const uniqueUserIds = [...new Set(orders.map((order) => order.order_by))];
            const userDetailsPromises = uniqueUserIds.map((userId) => userService.getUserDetail(userId));
            const userDetails = await Promise.all(userDetailsPromises);

            userDetails.forEach((detail, index) => {
                if (detail) {
                    userDetailsMap[uniqueUserIds[index]] = detail.fullname;
                }
            });
        } catch (error) {
            console.error('Error fetching user details:', error);
        }

        setUserDetails(userDetailsMap);
        setLoadingUsers(false);
    };

    const renderFilterSidebar = () => (
        <>
            <div className={`filter-overlay ${showFilters ? 'show' : ''}`} onClick={() => setShowFilters(false)} />
            <div className={`sidebar-filter ${showFilters ? 'show' : ''}`}>
                <div className="filter-header">
                    <h4>Bộ lọc đơn hàng</h4>
                    <button className="close-filter" onClick={() => setShowFilters(false)}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                <div className="filter-section">
                    <h5>Lọc theo ngày</h5>
                    <div className="date-inputs">
                        <div className="input-group">
                            <label>Từ ngày</label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </div>
                        <div className="input-group">
                            <label>Đến ngày</label>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className="filter-section">
                    <h5>Lọc theo giá</h5>
                    <PriceRangeSlider priceRange={priceRange} setPriceRange={setPriceRange} />
                </div>

                <div className="filter-actions">
                    <button className="apply-filter" onClick={() => setShowFilters(false)}>
                        Xác nhận
                    </button>
                    <button
                        className="reset-filter"
                        onClick={() => {
                            setStartDate('');
                            setEndDate('');
                            setPriceRange({ min: '', max: '' });
                        }}
                    >
                        Đặt lại
                    </button>
                </div>
            </div>
        </>
    );

    const renderOrderList = () => {
        const filteredOrders = filterOrders(orders);
        const searchedOrders = searchOrders(filteredOrders);

        return (
            <>
                <div className="search-add-container">
                    <input
                        className="search-box"
                        type="text"
                        placeholder="tìm kiếm đơn hàng..."
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                    <button className="search-btn" onClick={() => handleSearch()}>
                        <FontAwesomeIcon icon={faSearch} /> tìm kiếm
                    </button>
                </div>

                <div className="status-filters">
                    <div className="filter-pills">
                        <div className="filtertab">
                            {STATUS_FILTERS.map((status) => (
                                <button
                                    key={status.value}
                                    className={`pill ${activeStatusFilter === status.value ? 'active' : ''}`}
                                    onClick={() => setActiveStatusFilter(status.value)}
                                >
                                    {status.label}
                                </button>
                            ))}
                        </div>
                        <button
                            className={`filter-btn ${showFilters ? 'active' : ''}`}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <span>lọc</span>
                        </button>
                    </div>
                </div>
                {renderFilterSidebar()}
                {loading ? (
                    <div className="loading">Loading...</div>
                ) : error ? (
                    <div className="error">{error}</div>
                ) : (
                    <div className="orders-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>khách hàng</th>
                                    <th>ngày đặt</th>
                                    <th>tổng tiền</th>
                                    <th>trạng thái</th>
                                    <th>địa chỉ</th>
                                    {/* <th className="action-column">hành động</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {searchedOrders.map((order) => (
                                    <tr key={order._id} className="order-row">
                                        <td className="relative">
                                            <Link
                                                to={`/admin/orders/${order._id}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="user-id-link"
                                            >
                                                {order._id}
                                            </Link>
                                        </td>
                                        <td className="relative">
                                            <UserIdLink
                                                userId={order.order_by}
                                                onMouseEnter={(e) => handleUserHover(order.order_by, e)}
                                                onMouseLeave={() => setActivePopup(null)}
                                            />
                                        </td>
                                        <td>{new Date(order.date_order).toLocaleDateString('vi-VN')}</td>
                                        <td>
                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND',
                                            }).format(order.total_price)}
                                        </td>
                                        <td>
                                            <span className={`status-badge ${order.status?.toLowerCase()}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>{order.address_shipping || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </>
        );
    };

    return (
        <div className="orders-container">
            <div className="order-tabs">
                <div className="tab-group">
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
            </div>

            {activeTab === 'thông tin chung' ? renderOrderList() : <ReturnOrder returnRequests={[]} />}
        </div>
    );
};

export default OrderList;
