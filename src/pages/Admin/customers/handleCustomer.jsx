// useCustomerList.js
import { useState, useEffect } from 'react';
import userService from '../../../services/customerManager';
import Swal from 'sweetalert2';

export const useCustomerList = () => {
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 0,
        totalUsers: 0,
    });

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await userService.getAllUsers();
            console.log('res1: ', response);
            if (response?.success) {
                setCustomers(response.data.users);
            } else {
                setError('Không thể tải danh sách người dùng');
            }
        } catch (err) {
            console.error('Fetch Users Error:', err);
            setError(err.message || 'Không thể tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    };
    const checkAdminStatus = () => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if (!currentUser?.infoUser) {
            setError('Không tìm thấy thông tin người dùng');
            setLoading(false);
            return;
        }

        const adminStatus = currentUser.infoUser.admin === true;
        setIsAdmin(adminStatus);

        if (!adminStatus) {
            setError('Bạn không có quyền truy cập');
            setLoading(false);

            Swal.fire({
                icon: 'warning',
                title: 'Truy cập bị từ chối',
                text: 'Bạn không có quyền quản trị',
                footer: `Email: ${currentUser.infoUser.email || 'Không xác định'}`,
            });
        } else {
            fetchUsers(1);
        }
    };

    useEffect(() => {
        checkAdminStatus();
    }, []);

    const handleLockUnlock = async (userId) => {
        try {
            await userService.toggleUserBlock(userId);
            Swal.fire('Thành công', 'Đã thay đổi trạng thái người dùng', 'success');
            fetchUsers(pagination.currentPage);
        } catch (err) {
            Swal.fire('Lỗi', 'Không thể thay đổi trạng thái người dùng', 'error');
        }
    };

    const handleDeleteSelected = async () => {
        try {
            await Promise.all(selectedCustomers.map((userId) => userService.deleteUser(userId)));
            Swal.fire({
                title: 'Xóa thành công',
                text: `Đã xóa ${selectedCustomers.length} người dùng`,
                icon: 'success',
            });
            fetchUsers(pagination.currentPage);
            setSelectedCustomers([]);
        } catch (err) {
            Swal.fire('Lỗi', 'Không thể xóa người dùng', 'error');
        }
    };

    const toggleCustomerSelection = (userId) => {
        setSelectedCustomers((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId],
        );
    };

    const getFilteredCustomers = () => {
        const searchLower = searchQuery.toLowerCase().trim();
        return customers
            .filter((customer) => filter === 'All' || customer.status === filter)
            .filter((customer) => !searchLower || customer.name.toLowerCase().includes(searchLower));
    };

    const changePage = (newPage) => {
        fetchUsers(newPage);
    };

    return {
        states: {
            filter,
            searchQuery,
            loading,
            error,
            selectedCustomers,
            isAdmin,
            filteredCustomers: getFilteredCustomers(),
            pagination,
        },
        handlers: {
            setFilter,
            setSearchQuery,
            handleLockUnlock,
            handleDeleteSelected,
            toggleCustomerSelection,
            changePage,
            fetchUsers,
        },
    };
};
