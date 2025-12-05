import Swal from 'sweetalert2';

import '../assets/css/SearchResults.css';
import '../../src/assets/css/verifyOTP.css';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyOtp } from '../services/auth';
const VerifyOTP = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(600);
    const [error, setError] = useState('');
    const [isRunning, setIsRunning] = useState(true);
    const inputs = useRef([]);

    useEffect(() => {
        let countdown;

        if (isRunning && timer > 0) {
            countdown = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 0) {
                        clearInterval(countdown);
                        setIsRunning(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => clearInterval(countdown);
    }, [timer, isRunning]);
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
        setError('');

        if (element.value && index < 5) {
            inputs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            if (!otp[index] && index > 0) {
                inputs.current[index - 1].focus();
            }
            const newOtp = [...otp];
            newOtp[index] = '';
            setOtp(newOtp);
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text/plain').slice(0, 6);
        if (/^\d+$/.test(pastedData)) {
            const otpArray = pastedData.split('').slice(0, 6);
            setOtp([...otpArray, ...Array(6 - otpArray.length).fill('')]);
            inputs.current[Math.min(pastedData.length, 5)].focus();
        }
    };

    const verifyOTP = async () => {
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError('Vui lòng nhập đủ 6 số OTP');
            return;
        }
        const isRegister = sessionStorage.getItem('isRegister') === 'true';
        const body = {
            otp: otpString,
            isRegister: isRegister,
        };
        // const res = await axios.post(`${url}/auth/verify-otp`, body, { withCredentials: true });
        const res = await verifyOtp(body)
        if (res.success === false) {
            Swal.fire('Thất bại !', res.mes, 'error');
            return;
        } else {
            if (isRegister) {
                navigate('/login');
                Swal.fire('Thành công !', res.mes, 'success');
            } else {
                navigate('/new-password');
                Swal.fire('Thành công !', 'Xác thực OTP thành công', 'success');
            }
        }
    };

    const handleResend = () => {
        setTimer(300);
        setIsRunning(true);
        setOtp(['', '', '', '', '', '']);
        setError('');
    };

    const handleBack = () => {
        navigate('/login');
    };

    return (
        <div className="container-otp">
            <div className="otp-card">
                <div className="header-otp">
                    <h2>Xác thực OTP</h2>
                    <p>Vui lòng nhập mã OTP đã được gửi đến email của bạn</p>
                </div>

                <div className="otp-inputs">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(ref) => (inputs.current[index] = ref)}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(e.target, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onPaste={handlePaste}
                            className="otp-input"
                        />
                    ))}
                </div>

                {error && (
                    <div className="error-message">
                        <span>⚠️ {error}</span>
                    </div>
                )}

                <div className="timer">
                    <p>Thời gian còn lại: {formatTime(timer)}</p>
                </div>

                <div className="button-group">
                    <button onClick={handleBack} className="back-button">
                        Quay lại
                    </button>
                    {timer === 0 && (
                        <button onClick={handleResend} className="resend-button">
                            Gửi lại mã
                        </button>
                    )}
                </div>

                <button onClick={verifyOTP} className="verify-button">
                    Xác nhận
                </button>
            </div>
        </div>
    );
};

export default VerifyOTP;
