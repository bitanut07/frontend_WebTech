// import axios from 'axios';
// import Swal from 'sweetalert2';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
// const axiosInstance = axios.create({
//     baseURL: API_URL,
//     withCredentials: true,
//     timeout: 10000,
//     headers: {
//         'Content-Type': 'application/json',
//     }
// });

// axiosInstance.interceptors.request.use(
//     (config) => {
//         const currentUser = JSON.parse(localStorage.getItem('currentUser'));

//         if (currentUser?.accessToken) {
//             config.headers.Authorization = `Bearer ${currentUser.accessToken}`;
//         }

//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// axiosInstance.interceptors.response.use(
//     (response) => {
//         console.log('API Response:', {
//             url: response.config.url,
//             status: response.status,
//             data: response.data
//         });
//         return response;
//     },
//     (error) => {
//         if (error.response) {
//             console.error('API Error:', {
//                 url: error.config.url,
//                 status: error.response.status,
//                 data: error.response.data
//             });

//             switch (error.response.status) {
//                 case 401:
//                     localStorage.removeItem('currentUser');
//                     Swal.fire({
//                         icon: 'warning',
//                         title: 'Phiên đăng nhập hết hạn',
//                         text: 'Vui lòng đăng nhập lại',
//                         confirmButtonText: 'Đăng nhập'
//                     }).then(() => {
//                         window.location.href = '/login';
//                     });
//                     break;
//                 case 403:
//                     Swal.fire('Lỗi', 'Bạn không có quyền truy cập', 'error');
//                     break;
//                 default:
//                     Swal.fire('Lỗi', 'Đã có lỗi xảy ra', 'error');
//             }
//         }
//         return Promise.reject(error);
//     }
// );

// export default axiosInstance;

import axios from 'axios';
import Swal from 'sweetalert2';
import { refreshToken } from './auth';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    timeout: 60000, // 60 giây timeout mặc định
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if (currentUser?.accessToken) {
            config.headers.Authorization = `Bearer ${currentUser.accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
    (response) => {
        console.log('API Response:', {
            url: response.config.url,
            status: response.status,
            data: response.data,
        });
        return response;
    },
    async (error) => {
        // Xử lý timeout error
        if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
            console.error('Request Timeout:', {
                url: error.config?.url,
                timeout: error.config?.timeout,
            });
            await Swal.fire({
                icon: 'error',
                title: 'Yêu cầu hết thời gian chờ',
                text: 'Kết nối đến server mất quá nhiều thời gian. Vui lòng kiểm tra kết nối mạng và thử lại.',
                confirmButtonText: 'Đồng ý',
            });
            return Promise.reject(error);
        }

        if (error.response) {
            console.error('API Error:', {
                url: error.config.url,
                status: error.response.status,
                data: error.response.data,
            });

            const originalRequest = error.config;

            if (originalRequest._retry) {
                return Promise.reject(error);
            }

            switch (error.response.status) {
                case 401:
                    localStorage.removeItem('currentUser');
                    await Swal.fire({
                        icon: 'warning',
                        title: 'Phiên đăng nhập hết hạn',
                        text: 'Vui lòng đăng nhập lại',
                        confirmButtonText: 'Đăng nhập',
                    });
                    window.location.href = '/login';
                    break;

                case 403:
                    try {
                        originalRequest._retry = true;
                        const response = await refreshToken();

                        if (response.success) {
                            const currentUser = JSON.parse(localStorage.getItem('currentUser'));

                            const updatedUser = {
                                ...currentUser,
                                accessToken: response.accessToken,
                            };
                            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                            originalRequest.headers['Authorization'] = `Bearer ${response.accessToken}`;
                            return axiosInstance(originalRequest);
                        }
                    } catch (refreshError) {
                        await Swal.fire('Lỗi', 'Bạn không có quyền truy cập', 'error');
                    }
                    break;

                default:
                    await Swal.fire('Lỗi', 'Đã có lỗi xảy ra', 'error');
            }
        } else if (error.request) {
            // Request đã được gửi nhưng không nhận được response
            console.error('No response received:', {
                url: error.config?.url,
            });
            await Swal.fire({
                icon: 'error',
                title: 'Không thể kết nối đến server',
                text: 'Vui lòng kiểm tra kết nối mạng và thử lại.',
                confirmButtonText: 'Đồng ý',
            });
        }
        return Promise.reject(error);
    },
);

export default axiosInstance;
