import React, { useState } from 'react';
import '../../src/assets/css/newPassword.css';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../services/auth';
const NewPassword = () => {
    const navigate = useNavigate();
    const [passwords, setPasswords] = useState({
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({
        password: '',
        confirmPassword: '',
        match: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: '',
            match: '',
        }));
    };

    const togglePasswordVisibility = (field) => {
        if (field === 'password') {
            setShowPassword(!showPassword);
        } else {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let isValid = true;
        const newErrors = {
            password: '',
            confirmPassword: '',
            match: '',
        };

        if (passwords.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        if (passwords.confirmPassword.length < 6) {
            newErrors.confirmPassword = 'Password must be at least 6 characters';
            isValid = false;
        }

        if (passwords.password !== passwords.confirmPassword) {
            newErrors.match = 'Passwords do not match';
            isValid = false;
        }

        setErrors(newErrors);

        if (isValid) {
            try {
                const password = passwords.password;
                const res = await changePassword(password);
                if (res.success) {
                    navigate('/login');
                    Swal.fire('Thành công !', 'Đổi mật khẩu thành công', 'success');
                } else {
                    Swal.fire('Thất bại !', res.mes, 'error');
                }
            } catch (error) {
                throw error;
            }
        }
    };

    return (
        <div className="password-change-container">
            <div className="password-change-form">
                <h2>Change Password</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="password">New Password</label>
                        <div className="password-input-container">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={passwords.password}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => togglePasswordVisibility('password')}
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                        {errors.password && <span className="error">{errors.password}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <div className="password-input-container">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={passwords.confirmPassword}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => togglePasswordVisibility('confirm')}
                            >
                                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                        {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
                    </div>

                    {errors.match && <span className="error match-error">{errors.match}</span>}

                    <button type="submit" className="submit-button">
                        Change Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewPassword;
