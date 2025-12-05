// src/pages/Users/components/ForgotPassword.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import { FaLock } from 'react-icons/fa';
import '../assets/css/ForgotPassword.css';
import { forgotPassword } from '../services/user';
const ForgotPassword = () => {
    sessionStorage.setItem('isRegister', false);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const validateEmail = (email) => {
        return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateEmail(email)) {
            setError('Email không hợp lệ');
            return;
        }
        sessionStorage.setItem('email', email);
        const res = await forgotPassword(email);

        if (res.success) {
            navigate('/verify-otp');
        } else {
            Swal.fire('Thất bại !', res.mes, 'error');
        }
    };

    return (
        <div className="forgot-password-page-fp">
            <div className="forgot-password-container-fp">
                <div className="forgot-password-box-fp">
                    <div className="icon-container-fp">
                        <FaLock className="lock-icon-fp" />
                    </div>
                    <h2>Quên mật khẩu?</h2>
                    <p className="description-fp">
                        Nhập email của bạn và chúng tôi sẽ gửi lại mật khẩu tạm thời cho bạn
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group-fp">
                            <label>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Nhập email của bạn"
                                className={error ? 'error' : ''}
                            />
                            {error && <span className="error-message-fp">{error}</span>}
                        </div>

                        <button type="submit" className="submit-btn-fp" disabled={loading}>
                            {loading ? 'Đang xử lý...' : 'Gửi yêu cầu'}
                        </button>

                        <div className="links-fp">
                            <Link to="/login" className="back-to-login-fp">
                                ← Quay lại đăng nhập
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default ForgotPassword;
