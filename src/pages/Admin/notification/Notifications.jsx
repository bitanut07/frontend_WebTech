import { useEffect, useState } from 'react';
import './notification.css';
import userService from '../../../services/customerManager';
import createNotiService from '../../../services/createNotification';
import Swal from 'sweetalert2';
const Notifications = () => {
    const [isUserListOpen, setIsUserListOpen] = useState(false);
    const [users, setUser] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        selectedUsers: [],
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const users = await userService.getAllUsers();
                setUser(users.users);
            } catch (err) {
                console.error('Fetch Users Error:', err);
            }
        };
        fetchUsers();
    }, []);
    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Tiêu đề không được để trống';
            isValid = false;
        }

        if (!formData.content.trim()) {
            newErrors.content = 'Nội dung không được để trống';
            isValid = false;
        }

        if (formData.selectedUsers.length === 0) {
            newErrors.users = 'Vui lòng chọn ít nhất một người nhận';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const res = await createNotiService.createNotification(formData);
                if (res.data.success) {
                    Swal.fire('Thành công !', 'Tạo thông báo thành công', 'success');
                    setFormData({
                        title: '',
                        content: '',
                        selectedUsers: [],
                    });
                }
            } catch (error) {
                throw error;
            }
        }
    };

    const toggleUserSelect = (userId) => {
        setFormData((prev) => ({
            ...prev,
            selectedUsers: prev.selectedUsers.includes(userId)
                ? prev.selectedUsers.filter((id) => id !== userId)
                : [...prev.selectedUsers, userId],
        }));
    };

    const handleSelectAll = () => {
        setFormData((prev) => ({
            ...prev,
            selectedUsers: prev.selectedUsers.length === users.length ? [] : users.map((user) => user._id),
        }));
    };

    return (
        <div className="notifications-container">
            <form onSubmit={handleSubmit} className="notification-form">
                <h1 className="form-title">Tạo thông báo mới</h1>

                <div className="form-group">
                    <label>Tiêu đề</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className={`form-input-noti${errors.title ? 'error' : ''}`}
                    />
                    {errors.title && <span className="error-mes">{errors.title}</span>}
                </div>

                <div className="form-group">
                    <label>Nội dung</label>
                    <textarea
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className={errors.content ? 'error' : ''}
                    />
                    {errors.content && <span className="error-mes">{errors.content}</span>}
                </div>

                <div className="form-group">
                    <label>Người nhận</label>
                    <div className="user-selector" onClick={() => setIsUserListOpen(!isUserListOpen)}>
                        <span>{formData.selectedUsers.length} người được chọn</span>
                        <span className={`arrow ${isUserListOpen ? 'up' : 'down'}`}></span>
                    </div>

                    {isUserListOpen && (
                        <div className="user-list">
                            <div className="select-all">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.selectedUsers.length === users.length}
                                        onChange={handleSelectAll}
                                    />
                                    Chọn tất cả
                                </label>
                            </div>
                            {users.map((user) => (
                                <div key={user._id} className="user-item">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={formData.selectedUsers.includes(user._id)}
                                            onChange={() => toggleUserSelect(user._id)}
                                        />
                                        {user.email}
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                    {errors.users && <span className="error-mes">{errors.users}</span>}
                </div>

                <button type="submit" className="submit-btn">
                    Gửi thông báo
                </button>
            </form>
        </div>
    );
};

export default Notifications;
