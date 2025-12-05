import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/css/login.css';
import { loginUser } from '../redux/apiRequest.js';
import { useGoogleLogin } from '@react-oauth/google';
import { loginSuccess } from '../redux/authSlice.js';
import { requestGoogle } from '../services/auth.js';
import Swal from 'sweetalert2';
const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleBackHome = () => {
        navigate('/');
    };

    const validateForm = () => {
        const newErrors = {};
        if (!email) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email không hợp lệ';
        }
        if (!password) {
            newErrors.password = 'Vui lòng nhập mật khẩu';
        } else if (password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const reponseGoogle = async (authResult) => {
        try {
            if (authResult['code']) {
                const code = authResult['code'];
                const response = await requestGoogle(code);
                const user = {
                    infoUser: response.data.userData,
                    accessToken: response.data.accessToken,
                };
                localStorage.setItem('currentUser', JSON.stringify(user));
                dispatch(loginSuccess({ infoUser: response.data.userData, accessToken: response.data.accessToken }));
                if (response.data.userData.admin) {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
                Swal.fire('Thành công !', 'Đăng nhập thành công', 'success');
            }
        } catch (error) {
            console.log('error', error);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        const newUser = {
            email,
            password,
        };
        setLoading(true);
        loginUser(newUser, dispatch, navigate);
        setLoading(false);
    };
    const handleLoginGG = useGoogleLogin({
        onSuccess: reponseGoogle,
        onError: reponseGoogle,
        flow: 'auth-code',
    });

    return (
        <div className="login-container-l">
            <button className="back-home-btn-l" onClick={handleBackHome}>
                <i className="fas fa-arrow-left"></i> Quay lại trang chủ
            </button>
            <ToastContainer />

            <div className="login-box-l">
                <h1>Đăng nhập</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group-l">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value.trim());
                                setErrors({ ...errors, email: '' });
                            }}
                            className={errors.email ? 'error' : ''}
                            placeholder="Nhập email của bạn"
                        />
                        {errors.email && <span className="error-text-l">{errors.email}</span>}
                    </div>
                    <div className="form-group-l">
                        <label htmlFor="password">Mật khẩu</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value.trim());
                                    setErrors({ ...errors, password: '' });
                                }}
                                className={errors.password ? 'error' : ''}
                                placeholder="Nhập mật khẩu"
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                        </div>
                        {errors.password && <span className="error-text-l">{errors.password}</span>}
                    </div>
                    <div className="form-options-l">
                        <Link to="/forgot-password" className="forgot-link-l">
                            Quên mật khẩu?
                        </Link>
                    </div>
                    <button type="submit" className={`login-button-l ${loading ? 'loading' : ''}`} disabled={loading}>
                        {loading ? <div className="spinner-l"></div> : 'Đăng nhập'}
                    </button>
                </form>
                <div>
                    <button onClick={handleLoginGG} className="google-btn">
                        <div className="google-icon-wrapper">
                            <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                                <path
                                    fill="#EA4335"
                                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                                />
                                <path
                                    fill="#4285F4"
                                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                                />
                                <path fill="none" d="M0 0h48v48H0z" />
                            </svg>
                        </div>
                        <span className="btn-text">Đăng nhập bằng Google</span>
                    </button>
                </div>
                <div className="login-footer-l">
                    <p>
                        Chưa có tài khoản?{' '}
                        <Link to="/register" className="register-link-l">
                            Đăng ký ngay
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
