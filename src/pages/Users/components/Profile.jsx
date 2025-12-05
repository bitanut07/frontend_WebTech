// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/Profile.css';
import Nav from '../../Nav';
import { getCurrentUser, updateUser, uploadAvatar } from '../../../services/user';
// import { formatDate } from '../../../utils/dateUtils';
const Profile = () => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState({
        username: '',
        fullName: '',
        email: '',
        phone: '',
        address: '',
        birthday: '',
        avatar: '/default-avatar.png',
        totalSpending: 0,
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const response = await getCurrentUser();
                if (response.success) {
                    setUserData((prev) => ({
                        ...prev,
                        ...response.data,
                        avatar: response.data?.avatar || '/default-avatar.png',
                    }));
                }
            } catch (error) {
                console.error('Fetch user error:', error);
                toast.error('Không thể lấy thông tin người dùng');
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    if (loading) return <div>Loading...</div>;

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            const formattedData = {
                fullName: userData.fullName,
                phone: userData.phone,
                address: userData.address || '',
                birthday: userData.birthday,
            };

            const response = await updateUser(formattedData);

            if (response.success) {
                setIsEditing(false);
                toast.success('Cập nhật thông tin thành công!');

                const updatedUser = await getCurrentUser();
                if (updatedUser.success) {
                    setUserData((prev) => ({
                        ...prev,
                        ...updatedUser.data,
                        birthday: updatedUser.data?.birthday,
                        avatar: updatedUser.data?.avatar || '/default-avatar.png',
                    }));
                }
            }
        } catch (error) {
            console.error('Update error:', error);
            toast.error(error.message || 'Cập nhật thất bại');
        } finally {
            setLoading(false);
        }
    };
    const navigationItems = [
        { title: 'Giỏ hàng', path: '/user/cart', icon: 'fas fa-shopping-cart' },
        { title: 'Sản phẩm yêu thích', path: '/user/favorites', icon: 'fas fa-heart' },
        { title: 'Kiểm tra đơn hàng', path: '/user/order-check', icon: 'fas fa-clipboard-check' },
        {
            title: 'Đổi mật khẩu',
            path: '/user/change-password',
            icon: 'fas fa-lock',
            disabled: !userData.password,
            tooltip: 'Chỉ khả dụng cho tài khoản đăng ký bằng mật khẩu',
        },
    ];
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return date.toLocaleDateString('vi-VN', options);
    };
    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.match(/image.*/)) {
            toast.error('Vui lòng chọn file ảnh');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            toast.error('Kích thước ảnh không được vượt quá 2MB');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('avatar', file);

            const response = await uploadAvatar(formData);
            if (response.success) {
                toast.success('Cập nhật ảnh đại diện thành công!');
                const updatedUser = await getCurrentUser();
                if (updatedUser.success) {
                    setUserData((prev) => ({
                        ...prev,
                        avatar: updatedUser.data?.avatar || '/default-avatar.png',
                    }));
                }
            }
        } catch (error) {
            console.error('Upload avatar error:', error);
            toast.error('Cập nhật ảnh đại diện thất bại');
        }
    };
    const refreshUserData = async () => {
        const response = await getCurrentUser();
        if (response.success) {
            setUserData((prev) => ({
                ...prev,
                ...response.data,
                birthday: response.data?.birthday ? new Date(response.data.birthday).toISOString().split('T')[0] : '',
                avatar: response.data?.avatar || '/default-avatar.png',
            }));
        }
    };
    return (
        <div className="profile-page-p">
            <Nav />
            <ToastContainer />

            <div className="profile-container-p">
                {/* Left Column */}
                <div className="profile-info-p">
                    <div className="avatar-section-p">
                        <img src={userData.avatar} alt="Profile" className="profile-avatar-p" />
                        {isEditing && (
                            <div className="avatar-upload-p">
                                <input
                                    type="file"
                                    id="avatar-input"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    style={{ display: 'none' }}
                                />
                                <label htmlFor="avatar-input" className="change-avatar-btn-p">
                                    <i className="fas fa-camera"></i>
                                </label>
                            </div>
                        )}
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleUpdate} className="edit-form">
                            <div className="form-group-p">
                                <label>Họ và tên</label>
                                <input
                                    type="text"
                                    value={userData.fullName}
                                    onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
                                />
                            </div>
                            <div className="form-group-p">
                                <label>Email</label>
                                <input type="email" value={userData.email} readOnly />
                            </div>
                            <div className="form-group-p">
                                <label>Số điện thoại</label>
                                <input
                                    type="tel"
                                    value={userData.phone}
                                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                                />
                            </div>
                            <div className="form-group-p">
                                <label>Ngày sinh</label>
                                <input
                                    type="date"
                                    value={userData.birthday}
                                    onChange={(e) => setUserData({ ...userData, birthday: e.target.value })}
                                />
                            </div>
                            <div className="form-group-p">
                                <label>Địa chỉ</label>
                                <textarea
                                    value={userData.address}
                                    onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                                />
                            </div>
                            <div className="form-actions-p">
                                <button type="submit" className="save-btn-p">
                                    Lưu thay đổi
                                </button>
                                <button type="button" className="cancel-btn-p" onClick={() => setIsEditing(false)}>
                                    Hủy
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="info-display">
                            <div className="info-header-p">
                                <h2>Thông tin cá nhân</h2>
                                <button onClick={() => setIsEditing(true)} className="edit-btn-p">
                                    <i className="fas fa-edit"></i> Chỉnh sửa
                                </button>
                            </div>
                            <div className="info-content-p">
                                <p>
                                    <strong>Họ và tên:</strong> {userData.fullName}
                                </p>
                                <p>
                                    <strong>Email:</strong> {userData.email}
                                </p>
                                <p>
                                    <strong>Số điện thoại:</strong> {userData.phone}
                                </p>
                                <p>
                                    <strong>Ngày sinh:</strong> {formatDate(userData.birthday)}
                                </p>
                                <p>
                                    <strong>Địa chỉ:</strong> {userData.address}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div className="profile-actions-p">
                    <div className="stats-card-p">
                        <div className="stats-icon-p">
                            <i className="fas fa-wallet"></i>
                        </div>
                        <div className="stats-info-p">
                            <h3>Tổng chi tiêu</h3>
                            <p className="stats-value-p">{formatCurrency(userData.totalSpending || 0)}</p>
                        </div>
                    </div>

                    <div className="navigation-buttons-p">
                        {navigationItems.map((item, index) => (
                            <button
                                key={index}
                                className={`nav-button-p ${item.disabled ? 'disabled' : ''}`}
                                onClick={() => !item.disabled && navigate(item.path)}
                                title={item.disabled ? item.tooltip : ''}
                                disabled={item.disabled}
                            >
                                <i className={item.icon}></i>
                                {item.title}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
