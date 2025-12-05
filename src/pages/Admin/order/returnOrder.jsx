import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faTimes } from '@fortawesome/free-solid-svg-icons';
import './returnOrder.css';
import { getAllReturns, getReturnDetail, processReturn } from '../../../services/returnOrder';
import ReturnDetailModal from './returnDetail';

const ReturnOrder = () => {
    const [returnRequests, setReturnRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedReturn, setSelectedReturn] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filter states
    const [activeTab, setActiveTab] = useState('Pending');
    const [showFilter, setShowFilter] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [tempFilters, setTempFilters] = useState({ startDate: '', endDate: '' });

    useEffect(() => {
        const fetchReturns = async () => {
            try {
                setLoading(true);
                const data = await getAllReturns();
                setReturnRequests(data.returns);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch return requests.');
                setLoading(false);
            }
        };

        fetchReturns();
    }, []);

    useEffect(() => {
        let filtered = [...returnRequests];

        // Apply status filter
        filtered = filtered.filter((request) => request.status === activeTab);

        // Apply date filters
        if (startDate) {
            filtered = filtered.filter((request) => new Date(request.createdAt) >= new Date(startDate));
        }
        if (endDate) {
            filtered = filtered.filter((request) => new Date(request.createdAt) <= new Date(endDate + 'T23:59:59'));
        }

        setFilteredRequests(filtered);
    }, [returnRequests, activeTab, startDate, endDate]);

    const handleView = async (id) => {
        try {
            const detail = await getReturnDetail(id);
            setSelectedReturn(detail.return_request);
            setIsModalOpen(true);
        } catch (error) {
            alert('Failed to fetch return details.');
        }
    };

    const handleProcess = async (id, status) => {
        try {
            // const updatedRequest = await processReturn(id, status);  // Comment this out if API isn't ready
            setReturnRequests((prev) =>
                prev.map((request) =>
                    request._id === id
                        ? {
                              ...request,
                              status,
                              processed_at: new Date().toISOString(),
                              processed_by: {
                                  _id: 'temp-id',
                                  fullName: 'Test User',
                                  email: 'test@example.com',
                              },
                          }
                        : request,
                ),
            );
            if (isModalOpen) {
                setIsModalOpen(false);
                setSelectedReturn(null);
            }
        } catch (error) {
            alert(`Failed to ${status.toLowerCase()} return request.`);
        }
    };

    const handleApplyFilters = () => {
        setStartDate(tempFilters.startDate);
        setEndDate(tempFilters.endDate);
        setShowFilter(false);
    };
    function formatDate(isoDateString) {
        const date = new Date(isoDateString);
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        };

        return date.toLocaleDateString('en-GB', options).replace(',', '');
    }
    const handleResetFilters = () => {
        setTempFilters({ startDate: '', endDate: '' });
        setStartDate('');
        setEndDate('');
    };

    if (loading) return <div>Loading return requests...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="return-container">
            <div className="return-header">
                <div className="filter-tabs">
                    <div className="status-tabs">
                        {['Pending', 'Approved', 'Rejected'].map((status) => (
                            <button
                                key={status}
                                className={`tab ${activeTab === status ? 'active' : ''}`}
                                onClick={() => setActiveTab(status)}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                    <button className="filter-button" onClick={() => setShowFilter(!showFilter)}>
                        <FontAwesomeIcon icon={faFilter} />
                        Lọc
                    </button>
                </div>
            </div>

            {showFilter && (
                <div className="filter-popup">
                    <button className="close-filter-button" onClick={() => setShowFilter(false)}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                    <div className="filter-section">
                        <h3>Thời gian yêu cầu</h3>
                        <div className="date-inputs">
                            <div className="date-input-group">
                                <label>Từ ngày:</label>
                                <input
                                    type="date"
                                    value={tempFilters.startDate}
                                    onChange={(e) => setTempFilters((prev) => ({ ...prev, startDate: e.target.value }))}
                                />
                            </div>
                            <div className="date-input-group">
                                <label>Đến ngày:</label>
                                <input
                                    type="date"
                                    value={tempFilters.endDate}
                                    onChange={(e) => setTempFilters((prev) => ({ ...prev, endDate: e.target.value }))}
                                    min={tempFilters.startDate}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="filter-actions">
                        <button className="reset-button" onClick={handleResetFilters}>
                            Đặt lại
                        </button>
                        <button className="apply-button" onClick={handleApplyFilters}>
                            Áp dụng
                        </button>
                    </div>
                </div>
            )}

            <div className="return-table">
                <table>
                    <thead>
                        <tr>
                            <th>Mã yêu cầu</th>
                            <th>Đơn hàng</th>
                            <th>Khách hàng</th>
                            <th>Ngày yêu cầu</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRequests.length === 0 ? (
                            <tr>
                                <td colSpan="6">Không có yêu cầu trả hàng nào.</td>
                            </tr>
                        ) : (
                            filteredRequests.map((request) => (
                                <tr key={request._id}>
                                    <td>{request._id}</td>
                                    <td>{request.order?._id || 'N/A'}</td> {/* Add optional chaining here */}
                                    <td>{request.user ? request.user.fullName : 'Không có thông tin'}</td>
                                    <td>{formatDate(request.createdAt)}</td>
                                    <td>{request.status}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button onClick={() => handleView(request._id)}>View</button>
                                            <button
                                                onClick={() => handleProcess(request._id, 'Approved')}
                                                disabled={request.status !== 'Pending'}
                                            >
                                                Chấp nhận
                                            </button>
                                            <button
                                                onClick={() => handleProcess(request._id, 'Rejected')}
                                                disabled={request.status !== 'Pending'}
                                            >
                                                Từ chối
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <ReturnDetailModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedReturn(null);
                }}
                returnDetail={selectedReturn}
                onProcess={handleProcess}
            />
        </div>
    );
};

export default ReturnOrder;
