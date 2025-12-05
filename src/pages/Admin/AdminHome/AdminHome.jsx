// AdminHome.jsx
import React, { useEffect, useState } from 'react';
import OrderList from '../order/orderList';
import ReportDialog from './ReportDialog';
import { getRevenueReport } from '../../../services/report';
import './adminHome.css';

const AdminHome = () => {
    const [report, setReport] = useState({ revenue: 0, totalOrders: 0 });
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                setLoading(true);
                // Lấy năm và tháng hiện tại
                const currentDate = new Date();
                const requestData = {
                    year: currentDate.getFullYear(),
                    month: currentDate.getMonth() + 1,
                };

                const response = await getRevenueReport(requestData);

                if (response.success && response.revenueReport) {
                    // Tính tổng từ dữ liệu báo cáo
                    const totalRevenue = response.revenueReport.reduce(
                        (sum, item) => sum + (item.totalRevenue || 0),
                        0,
                    );
                    const totalOrders = response.revenueReport.reduce((sum, item) => sum + (item.totalOrders || 0), 0);

                    setReport({
                        revenue: totalRevenue,
                        totalOrders: totalOrders,
                    });
                    setReportData(response.revenueReport);
                } else {
                    setError('Dữ liệu không hợp lệ');
                }
            } catch (err) {
                console.error('Error fetching report:', err);
                setError(err.response?.data?.msg || 'Không thể tải dữ liệu báo cáo');
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, []);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(value);
    };

    return (
        <div className="admin-home">
            <div className="dashboard-report" onClick={() => setShowDialog(true)}>
                {loading ? (
                    <p>Đang tải...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : (
                    <>
                        <div className="report-card">
                            <h3>Tổng Doanh Thu</h3>
                            <p className="report-value">{formatCurrency(report.revenue)}</p>
                        </div>
                        <div className="report-card">
                            <h3>Tổng Đơn Hàng</h3>
                            <p className="report-value">{report.totalOrders.toLocaleString('vi-VN')}</p>
                        </div>
                    </>
                )}
            </div>

            {showDialog && <ReportDialog onClose={() => setShowDialog(false)} initialData={reportData} />}

            <div className="dashboard-content">
                <OrderList />
            </div>
        </div>
    );
};

export default AdminHome;
