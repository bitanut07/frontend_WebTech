// src/pages/Users/components/ChangePassword.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import NavUser from './NavUser';
import Nav from '../../Nav';
import '../css/ChangePassword.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { changePassword } from '../../../services/user';

const ChangePassword = () => {
    const navigate = useNavigate();
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const togglePasswordVisibility = (field) => {
        setShowPasswords((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };
    const validateForm = () => {
        const newErrors = {};
        if (!formData.currentPassword) {
            newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
        }
        if (!formData.newPassword) {
            newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
        } else if (formData.newPassword.length < 6) {
            newErrors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự';
        }
        if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
    
        setLoading(true);
        try {
            const response = await changePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });
            
            if (response.success) {
                toast.success('Đổi mật khẩu thành công!');
                setTimeout(() => navigate('/user/profile'), 2000);
            }
        } catch (error) {
            console.error('Change password error:', error);
            if (error.message.includes('current')) {
                setErrors({ currentPassword: 'Mật khẩu hiện tại không đúng' });
            } else {
                toast.error(error.message || 'Đổi mật khẩu thất bại');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="change-password-page-cp">
            <Nav />
            <div className="change-password-container-cp">
                <div className="change-password-box-cp">
                    <h2>Đổi mật khẩu</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group-cp">
                            <label>Mật khẩu hiện tại</label>
                            <div className="password-input-wrapper-cp">
                                <input
                                    type={showPasswords.current ? 'text' : 'password'}
                                    value={formData.currentPassword}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            currentPassword: e.target.value,
                                        })
                                    }
                                    className={errors.currentPassword ? 'error' : ''}
                                />
                                <button
                                    type="button"
                                    className="toggle-password-cp"
                                    onClick={() => togglePasswordVisibility('current')}
                                >
                                    {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {errors.currentPassword && (
                                <span className="error-message-cp">{errors.currentPassword}</span>
                            )}
                        </div>

                        <div className="form-group-cp">
                            <label>Mật khẩu mới</label>
                            <div className="password-input-wrapper-cp">
                                <input
                                    type={showPasswords.new ? 'text' : 'password'}
                                    value={formData.newPassword}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            newPassword: e.target.value,
                                        })
                                    }
                                    className={errors.newPassword ? 'error' : ''}
                                />
                                <button
                                    type="button"
                                    className="toggle-password-cp"
                                    onClick={() => togglePasswordVisibility('new')}
                                >
                                    {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {errors.newPassword && <span className="error-message-cp">{errors.newPassword}</span>}
                        </div>

                        <div className="form-group-cp">
                            <label>Xác nhận mật khẩu mới</label>
                            <div className="password-input-wrapper-cp">
                                <input
                                    type={showPasswords.confirm ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            confirmPassword: e.target.value,
                                        })
                                    }
                                    className={errors.confirmPassword ? 'error' : ''}
                                />
                                <button
                                    type="button"
                                    className="toggle-password-cp"
                                    onClick={() => togglePasswordVisibility('confirm')}
                                >
                                    {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <span className="error-message-cp">{errors.confirmPassword}</span>
                            )}
                        </div>

                        <button type="submit" className="submit-btn-cp" disabled={loading}>
                            {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                        </button>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default ChangePassword;
