import React from 'react';

const VerifyRegisterFailed = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Đăng ký thất bại</h1>
            <p>Liên kết xác thực đã hết hạn hoặc không hợp lệ.</p>
            <a href="/register">Quay lại đăng ký</a>
        </div>
    );
};

export default VerifyRegisterFailed;
