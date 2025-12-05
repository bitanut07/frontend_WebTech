import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getRevenueReport } from '../../../services/report';

const DashboardReport = () => {
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateRange, setDateRange] = useState('month'); // 'month', 'year', 'custom'
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');

    const fetchReport = async () => {
        try {
            setLoading(true);
            const params = {
                year: selectedYear,
                month: dateRange === 'month' ? selectedMonth : undefined,
                startDate: dateRange === 'custom' ? customStartDate : undefined,
                endDate: dateRange === 'custom' ? customEndDate : undefined,
            };
            const data = await getRevenueReport(params);
            setReportData(data.revenueReport || []);
        } catch (err) {
            setError('Không thể tải dữ liệu báo cáo.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, [dateRange, selectedYear, selectedMonth, customStartDate, customEndDate]);

    const totalRevenue = reportData.reduce((sum, item) => sum + item.totalRevenue, 0);
    const totalOrders = reportData.reduce((sum, item) => sum + item.totalOrders, 0);

    const formatChartData = () => {
        return reportData.map((item) => ({
            name: dateRange === 'month' ? `Ngày ${item._id.day}` : `Tháng ${item._id.month}`,
            'Doanh Thu': item.totalRevenue,
            'Số Đơn': item.totalOrders,
        }));
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <div className="mb-6">
                <div className="flex gap-4 mb-4">
                    <select
                        className="p-2 border rounded"
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        style={{ borderColor: 'var(--primary-color)' }}
                    >
                        <option value="month">Theo Tháng</option>
                        <option value="year">Theo Năm</option>
                        <option value="custom">Tùy Chọn</option>
                    </select>

                    {dateRange !== 'custom' && (
                        <select
                            className="p-2 border rounded"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            style={{ borderColor: 'var(--primary-color)' }}
                        >
                            {Array.from({ length: 5 }, (_, i) => (
                                <option key={i} value={new Date().getFullYear() - i}>
                                    {new Date().getFullYear() - i}
                                </option>
                            ))}
                        </select>
                    )}

                    {dateRange === 'month' && (
                        <select
                            className="p-2 border rounded"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(Number(e.target.value))}
                            style={{ borderColor: 'var(--primary-color)' }}
                        >
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    Tháng {i + 1}
                                </option>
                            ))}
                        </select>
                    )}

                    {dateRange === 'custom' && (
                        <div className="flex gap-4">
                            <input
                                type="date"
                                className="p-2 border rounded"
                                value={customStartDate}
                                onChange={(e) => setCustomStartDate(e.target.value)}
                                style={{ borderColor: 'var(--primary-color)' }}
                            />
                            <input
                                type="date"
                                className="p-2 border rounded"
                                value={customEndDate}
                                onChange={(e) => setCustomEndDate(e.target.value)}
                                style={{ borderColor: 'var(--primary-color)' }}
                            />
                        </div>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="text-center p-4">Đang tải...</div>
            ) : error ? (
                <div className="text-red-500 text-center p-4">{error}</div>
            ) : (
                <>
                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--primary-color)' }}>
                            <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-color-light)' }}>
                                Tổng Doanh Thu
                            </h3>
                            <p className="text-2xl font-bold" style={{ color: 'var(--text-color-light)' }}>
                                {totalRevenue.toLocaleString('vi-VN')} đ
                            </p>
                        </div>
                        <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--secondary-color)' }}>
                            <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-color-light)' }}>
                                Tổng Đơn Hàng
                            </h3>
                            <p className="text-2xl font-bold" style={{ color: 'var(--text-color-light)' }}>
                                {totalOrders.toLocaleString('vi-VN')}
                            </p>
                        </div>
                    </div>

                    <div className="h-96 w-full">
                        <ResponsiveContainer>
                            <LineChart data={formatChartData()}>
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
                </>
            )}
        </div>
    );
};

export default DashboardReport;
