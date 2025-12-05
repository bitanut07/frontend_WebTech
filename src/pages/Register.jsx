// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import '../assets/css/register.css';
import { registerUser } from '../redux/apiRequest.js';
import LoadingModal from '../components/Loading.jsx';
const Register = () => {
    sessionStorage.setItem('isRegister', true);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        fullName: '',
        password: '',
        confirmPassword: '',
        email: '',
        birthday: '',
        phone: '',
        address: '',
        city: '',
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!formData.username) newErrors.username = 'Vui lòng nhập tên đăng nhập';
        if (!formData.fullName) newErrors.fullName = 'Vui lòng nhập họ tên';
        if (!formData.password) newErrors.password = 'Vui lòng nhập mật khẩu';
        else if (formData.password.length < 6) newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu không khớp';
        }
        if (!formData.email) newErrors.email = 'Vui lòng nhập email';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email không hợp lệ';
        if (!formData.birthday) newErrors.birthday = 'Vui lòng chọn ngày sinh';
        if (!formData.phone) newErrors.phone = 'Vui lòng nhập số điện thoại';
        if (!formData.city) newErrors.city = 'Vui lòng chọn tỉnh/thành phố';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const newUser = {
                    username: formData.username,
                    fullName: formData.fullName,
                    email: formData.email,
                    password: formData.password,
                    birthday: formData.birthday,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                };
                registerUser(newUser, dispatch, navigate, setLoading);
            } catch (error) {
                toast.error('Đăng ký thất bại!');
            }
        }
    };
    const [showPassword, setShowPassword] = useState({
        password: false,
        confirmPassword: false,
    });
    return (
        <div className="register-page-r">
            {isLoading && <LoadingModal />}
            <Link to="/" className="back-home-r">
                <i className="fas fa-arrow-left"></i>
                Quay về trang chủ
            </Link>
            <div className="register-container-r">
                <div className="register-header-r">
                    <h2>Đăng ký tài khoản</h2>
                    <p>Vui lòng điền đầy đủ thông tin bên dưới</p>
                </div>

                <form onSubmit={handleSubmit} className="register-form-r">
                    <div className="form-row-r">
                        <div className="form-group-r">
                            <label>Tên đăng nhập</label>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                className={errors.username ? 'error' : ''}
                            />
                            {errors.username && <span className="error-message-r">{errors.username}</span>}
                        </div>

                        <div className="form-group-r">
                            <label>Họ và tên</label>
                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className={errors.fullName ? 'error' : ''}
                            />
                            {errors.fullName && <span className="error-message-r">{errors.fullName}</span>}
                        </div>
                    </div>

                    <div className="form-row-r">
                        <div className="form-group-r">
                            <label>Mật khẩu</label>
                            <div className="password-input-r">
                                <input
                                    type={showPassword.password ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className={errors.password ? 'error' : ''}
                                />
                                <button
                                    type="button"
                                    className="password-toggle-r"
                                    onClick={() =>
                                        setShowPassword({
                                            ...showPassword,
                                            password: !showPassword.password,
                                        })
                                    }
                                >
                                    <i className={`fas ${showPassword.password ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                            {errors.password && <span className="error-message-r">{errors.password}</span>}
                        </div>

                        <div className="form-group-r">
                            <label>Xác nhận mật khẩu</label>
                            <div className="password-input-r">
                                <input
                                    type={showPassword.confirmPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className={errors.confirmPassword ? 'error' : ''}
                                />
                                <button
                                    type="button"
                                    className="password-toggle-r"
                                    onClick={() =>
                                        setShowPassword({
                                            ...showPassword,
                                            confirmPassword: !showPassword.confirmPassword,
                                        })
                                    }
                                >
                                    <i
                                        className={`fas ${showPassword.confirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                                    ></i>
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <span className="error-message-r">{errors.confirmPassword}</span>
                            )}
                        </div>
                    </div>

                    <div className="form-row-r">
                        <div className="form-group-r">
                            <label>Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className={errors.email ? 'error' : ''}
                            />
                            {errors.email && <span className="error-message-r">{errors.email}</span>}
                        </div>

                        <div className="form-group-r">
                            <label>Ngày sinh</label>
                            <input
                                type="date"
                                value={formData.birthday}
                                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                                className={errors.birthday ? 'error' : ''}
                            />
                            {errors.birthday && <span className="error-message-r">{errors.birthday}</span>}
                        </div>
                    </div>

                    <div className="form-row-r">
                        <div className="form-group-r">
                            <label>Số điện thoại</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className={errors.phone ? 'error' : ''}
                            />
                            {errors.phone && <span className="error-message-r">{errors.phone}</span>}
                        </div>

                        <div className="form-group-r">
                            <label>Tỉnh/Thành phố</label>
                            <select
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                className={errors.city ? 'error' : ''}
                            >
                                <option value="">Chọn tỉnh/thành phố</option>
                                <option value="hanoi">Hà Nội</option>
                                <option value="hcm">TP. Hồ Chí Minh</option>
                                <option value="an_giang">An Giang</option>
                                <option value="ba_ria_vung_tau">Bà Rịa - Vũng Tàu</option>
                                <option value="bac_lieu">Bạc Liêu</option>
                                <option value="bac_can">Bắc Kạn</option>
                                <option value="bac_giang">Bắc Giang</option>
                                <option value="bac_ninh">Bắc Ninh</option>
                                <option value="ben_tre">Bến Tre</option>
                                <option value="binh_duong">Bình Dương</option>
                                <option value="binh_dinh">Bình Định</option>
                                <option value="binh_phuoc">Bình Phước</option>
                                <option value="binh_thuan">Bình Thuận</option>
                                <option value="ca_mau">Cà Mau</option>
                                <option value="cao_bang">Cao Bằng</option>
                                <option value="can_tho">Cần Thơ</option>
                                <option value="da_nang">Đà Nẵng</option>
                                <option value="dak_lak">Đắk Lắk</option>
                                <option value="dak_nong">Đắk Nông</option>
                                <option value="dien_bien">Điện Biên</option>
                                <option value="dong_nai">Đồng Nai</option>
                                <option value="dong_thap">Đồng Tháp</option>
                                <option value="gia_lai">Gia Lai</option>
                                <option value="ha_giang">Hà Giang</option>
                                <option value="ha_nam">Hà Nam</option>
                                <option value="ha_noi">Hà Nội</option>
                                <option value="ha_tinh">Hà Tĩnh</option>
                                <option value="hai_duong">Hải Dương</option>
                                <option value="hai_phong">Hải Phòng</option>
                                <option value="hau_giang">Hậu Giang</option>
                                <option value="hoa_binh">Hòa Bình</option>
                                <option value="hung_yen">Hưng Yên</option>
                                <option value="ho_chi_minh">TP. Hồ Chí Minh</option>
                                <option value="khanh_hoa">Khánh Hòa</option>
                                <option value="kien_giang">Kiên Giang</option>
                                <option value="kon_tum">Kon Tum</option>
                                <option value="lai_chau">Lai Châu</option>
                                <option value="lam_dong">Lâm Đồng</option>
                                <option value="lang_son">Lạng Sơn</option>
                                <option value="lao_cai">Lào Cai</option>
                                <option value="long_an">Long An</option>
                                <option value="nam_dinh">Nam Định</option>
                                <option value="nghe_an">Nghệ An</option>
                                <option value="ninh_binh">Ninh Bình</option>
                                <option value="ninh_thuan">Ninh Thuận</option>
                                <option value="phu_tho">Phú Thọ</option>
                                <option value="phu_yen">Phú Yên</option>
                                <option value="quang_binh">Quảng Bình</option>
                                <option value="quang_nam">Quảng Nam</option>
                                <option value="quang_ngai">Quảng Ngãi</option>
                                <option value="quang_ninh">Quảng Ninh</option>
                                <option value="quang_tri">Quảng Trị</option>
                                <option value="soc_trang">Sóc Trăng</option>
                                <option value="son_la">Sơn La</option>
                                <option value="tay_ninh">Tây Ninh</option>
                                <option value="thai_binh">Thái Bình</option>
                                <option value="thai_nguyen">Thái Nguyên</option>
                                <option value="thanh_hoa">Thanh Hóa</option>
                                <option value="thua_thien_hue">Thừa Thiên Huế</option>
                                <option value="tien_giang">Tiền Giang</option>
                                <option value="tra_vinh">Trà Vinh</option>
                                <option value="tuyen_quang">Tuyên Quang</option>
                                <option value="vinh_long">Vĩnh Long</option>
                                <option value="vinh_phuc">Vĩnh Phúc</option>
                                <option value="yen_bai">Yên Bái</option>
                            </select>
                            {errors.city && <span className="error-message-r">{errors.city}</span>}
                        </div>
                    </div>

                    <div className="form-group-r">
                        <label>Địa chỉ</label>
                        <textarea
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="register-button-r">
                        Đăng ký
                    </button>

                    <div className="login-link-r">
                        Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Register;
