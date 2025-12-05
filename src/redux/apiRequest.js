
import {
    loginStart,
    loginFailed,
    loginSuccess,
    registerFailed,
    registerSuccess,
    registerStart,
    logoutFailed,
    logoutStart,
    logoutSuccess,
} from './authSlice';
import Swal from 'sweetalert2';
import { login, register, logout } from '../services/auth';
const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart());

    try {
        const res = await login(user);
        if (res.success) {
            dispatch(loginSuccess({ infoUser: res.userData, accessToken: res.accessToken }));
            if (!res.userData.admin) {
                navigate('/');
            } else {
                navigate('/admin');
            }
            Swal.fire('Thành công !', res.mes, 'success');
        } else {
            dispatch(loginFailed());
            Swal.fire('Thất bại !', res.mes, 'error');
        }
    } catch (error) {
        dispatch(loginFailed());
        Swal.fire('Đăng nhập thất bại!', 'Có lỗi xảy ra, vui lòng thử lại sau', 'error');
    }
};

const registerUser = async (user, dispatch, navigate, setLoading) => {
    dispatch(registerStart());
    setLoading(true);
    try {
        const res = await register(user);

        if (res.success) {
            dispatch(registerSuccess());
            Swal.fire('Oop!', res.mes, 'success');

            navigate('/verify-otp');
        } else {
            dispatch(registerFailed());
            Swal.fire('Oop!', res.mes, 'error');
        }
    } catch (error) {
        dispatch(registerFailed());
        Swal.fire('Thất bại!', 'Có lỗi xảy ra, vui lòng thử lại sau', 'error');
    } finally {
        setLoading(false);
    }
};
const logoutUser = async (dispatch, navigate) => {
    dispatch(logoutStart());
    try {
        const res = await logout();
        if (res.success) {
            dispatch(logoutSuccess());
            Swal.fire('Thành công', res.mes, 'success');
            window.location.href = '/'
            navigate('/');
        } else {
            dispatch(logoutFailed());
            Swal.fire('Oop!', res.mes, 'error');
        }
    } catch (error) {
        dispatch(logoutFailed());
        Swal.fire('Oop!', 'Đăng xuất thất bại', 'error');
    }
};

export { loginUser, registerUser, logoutUser };
