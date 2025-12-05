import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getRevenueReport } from '../../../services/report';
import './ReportDialog.css';

const ReportDialog = ({ onClose, initialData }) => {
    const [dateRange, setDateRange] = useState('month');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [reportData, setReportData] = useState(initialData || []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchFilteredReport = async () => {
        try {
            setLoading(true);
            setError(null);
            const params = {
                year: selectedYear,
                month: dateRange === 'month' ? selectedMonth : undefined,
            };
            const data = await getRevenueReport(params);
            setReportData(data.revenueReport || []);
        } catch (error) {
            setError('Error fetching report data');
            console.error('Error fetching filtered report:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFilteredReport();
    }, [dateRange, selectedYear, selectedMonth]);

    const handleExport = () => {
        console.log('Exporting report...');
    };

    const totalRevenue = reportData.reduce((sum, item) => sum + (item.totalRevenue || 0), 0);
    const totalOrders = reportData.reduce((sum, item) => sum + (item.totalOrders || 0), 0);

    const chartData = reportData.map((item) => ({
        name: dateRange === 'month' ? `Ngày ${item._id.day}` : `Tháng ${item._id.month}`,
        'Doanh Thu': item.totalRevenue,
        'Số Đơn': item.totalOrders,
    }));

    return (
        <div className="dialog-overlay" onClick={onClose}>
            <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
                <div className="dialog-header">
                    <h2>Báo Cáo Chi Tiết</h2>
                    <button className="close-button" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="filter-controls">
                    <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="filter-select">
                        <option value="month">Theo Tháng</option>
                        <option value="year">Theo Năm</option>
                    </select>

                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="filter-select"
                    >
                        {Array.from({ length: 5 }, (_, i) => (
                            <option key={i} value={new Date().getFullYear() - i}>
                                {new Date().getFullYear() - i}
                            </option>
                        ))}
                    </select>

                    {dateRange === 'month' && (
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(Number(e.target.value))}
                            className="filter-select"
                        >
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    Tháng {i + 1}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="summary-cards">
                    <div className="summary-card">
                        <h3>Tổng Doanh Thu</h3>
                        <p>{totalRevenue.toLocaleString('vi-VN')} đ</p>
                    </div>
                    <div className="summary-card">
                        <h3>Tổng Đơn Hàng</h3>
                        <p>{totalOrders.toLocaleString('vi-VN')}</p>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-container">Loading...</div>
                ) : (
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis yAxisId="left" />
                                <YAxis yAxisId="right" orientation="right" />
                                <Tooltip />
                                <Legend />
                                <Line
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="Doanh Thu"
                                    stroke="var(--primary-color)"
                                    strokeWidth={2}
                                />
                                <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="Số Đơn"
                                    stroke="var(--secondary-color)"
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* <div className="dialog-footer">
                    <button className="export-button" onClick={handleExport} disabled={loading || error}>
                        Tải Xuống Báo Cáo
                    </button>
                </div> */}
            </div>
        </div>
    );
};

export default ReportDialog;
