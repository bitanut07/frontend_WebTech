import { NotificationContext } from '../context/NotificationContext';
import React, { useState, useRef, useEffect, useContext } from 'react';
import { FaRegBell, FaEllipsisH } from 'react-icons/fa';
import '../assets/css/notificationDropdown.css';

const IconsNotification = {
    question: '/icon_question.png',
    info: '/icon_speaker.png',
    coupon: '/icon_coupon.png',
    confirmed: '/icon_order.png',
    shipping: '/icon_shipping.png',
    cancelled: '/icon_cancel.png',
    delivered: '/icon_delivered.png',
};

const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showAllNotifications, setShowAllNotifications] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const dropdownRef = useRef(null);
    const { notifications, hasNewNotification, setHasNewNotification, markAsRead, deleteNotification, markAllAsRead } =
        useContext(NotificationContext);
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    const visibleNotifications = showAllNotifications ? notifications : notifications.slice(0, 10);
    // useEffect(() => {
    //     const handleGlobalClick = (event) => {
    //         if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
    //             setShowAllNotifications(false);
    //             setIsOpen(false);
    //             setActiveMenu(null);
    //         } else if (!event.target.closest('.notification-actions')) {
    //             setActiveMenu(null);
    //         }
    //     };

    //     document.addEventListener('mousedown', handleGlobalClick);
    //     return () => document.removeEventListener('mousedown', handleGlobalClick);
    // }, []);

    useEffect(() => {
        if (hasNewNotification) {
            const timer = setTimeout(() => setHasNewNotification(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [hasNewNotification]);
    useEffect(() => {
        setActiveMenu(null);
    }, [notifications]);
    const formatTimeAgo = (date) => {
        const now = new Date();
        const diff = now - new Date(date);
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (minutes < 60) return `${minutes} phút trước`;
        if (hours < 24) return `${hours} giờ trước`;
        if (days < 30) return `${days} ngày trước`;
        return new Date(date).toLocaleDateString('vi-VN');
    };

    const handleNotificationClick = async (notification, e) => {
        const isFromActionMenu = e.target.closest('.notification-actions');
        if (!isFromActionMenu && notification.toUrl) {
            await markAsRead(notification._id);
            window.location.href = notification.toUrl;
        }
    };

    const toggleActionMenu = (notificationId, e) => {
        console.log('test: ', notificationId);
        e.preventDefault();
        e.stopPropagation();
        setActiveMenu((prevMenu) => (prevMenu === notificationId ? null : notificationId));
    };

    const handleAction = async (action, notificationId, e) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            if (action === 'delete') {
                await deleteNotification(notificationId);
            } else if (action === 'markRead') {
                await markAsRead(notificationId);
            }
        } catch (error) {
            console.error('Error performing action:', error);
        }
        setActiveMenu(null);
    };

    return (
        <div className="notification-container">
            {hasNewNotification && (
                <div className="floating-notification">
                    <p>Bạn có 1 thông báo mới</p>
                    <button onClick={() => setHasNewNotification(false)}>Đóng</button>
                </div>
            )}

            <div
                className="notification-trigger"
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen) setHasNewNotification(false);
                }}
            >
                <div className="notification-icon-wrapper">
                    <FaRegBell className="notification-icon" />
                    {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                </div>
                <span className="notification-label">Thông báo</span>
            </div>

            <div className={`notification-dropdown ${isOpen ? 'open' : ''}`} ref={dropdownRef}>
                <div className="dropdown-arrow" />

                <div className="notification-header">
                    <h3>Thông báo</h3>
                    <span className="mark-read" onClick={(e) => markAllAsRead()}>
                        Đánh dấu đã đọc
                    </span>
                </div>

                <div className="notification-list">
                    {visibleNotifications.map((notification) => (
                        <div
                            key={notification._id}
                            className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                            onClick={(e) => handleNotificationClick(notification, e)}
                        >
                            <img
                                src={IconsNotification[notification.type] || IconsNotification.question}
                                alt="notification icon"
                                className="notification-image"
                            />

                            <div className="notification-content">
                                <div className="notification-header-content">
                                    <h4 className="notification-title">{notification.title}</h4>
                                </div>
                                <p className="notification-text">{notification.content}</p>
                                <span className="notification-time">{formatTimeAgo(notification.createAt)}</span>
                            </div>

                            <div className="notification-actions" onClick={(e) => e.stopPropagation()}>
                                <button
                                    className="action-button"
                                    onClick={(e) => toggleActionMenu(notification._id, e)}
                                >
                                    <FaEllipsisH />
                                </button>
                                {activeMenu === notification._id && (
                                    <div className="action-menu">
                                        <button
                                            onClick={(e) => handleAction('markRead', notification._id, e)}
                                            className="action-menu-item"
                                        >
                                            Đánh dấu đã đọc
                                        </button>
                                        <button
                                            onClick={(e) => handleAction('delete', notification._id, e)}
                                            className="action-menu-item"
                                        >
                                            Xóa thông báo
                                        </button>
                                    </div>
                                )}
                            </div>

                            {!notification.isRead && <div className="unread-dot" />}
                        </div>
                    ))}
                </div>
                {!showAllNotifications && notifications.length > 10 && (
                    <div className="notification-footer">
                        <button className="view-all-button" onClick={() => setShowAllNotifications(true)}>
                            Xem tất cả thông báo
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationDropdown;
