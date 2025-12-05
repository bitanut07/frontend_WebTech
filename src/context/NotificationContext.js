import React, { createContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import axios from 'axios';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [hasNewNotification, setHasNewNotification] = useState(false);
    const [socket, setSocket] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const currentUser = useSelector((state) => state.auth.login?.currentUser || {});
    const userId = currentUser?.infoUser?._id || '';
    const accessToken = currentUser?.accessToken;
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    useEffect(() => {
        if (!userId) return;

        const newSocket = io(API_URL);
        setSocket(newSocket);

        newSocket.emit('user_connected', userId);

        newSocket.on('new_notification', handleNewNotification);

        fetchNotifications();

        return () => {
            newSocket.off('new_notification', handleNewNotification);
            newSocket.close();
        };
    }, [userId]);

    const handleNewNotification = (notification) => {
        setNotifications((prev) => {
            const prevArray = Array.isArray(prev) ? prev : [];
            return [notification, ...prevArray];
        });
        setHasNewNotification(true);
    };

    const fetchNotifications = async () => {
        if (!userId) return;

        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/notification/${userId}`);
            // Ensure notifications is always an array
            const notificationsData = response.data;
            if (Array.isArray(notificationsData)) {
                setNotifications(notificationsData);
            } else if (notificationsData && Array.isArray(notificationsData.notifications)) {
                setNotifications(notificationsData.notifications);
            } else if (notificationsData && Array.isArray(notificationsData.data)) {
                setNotifications(notificationsData.data);
            } else {
                console.warn('Unexpected notifications format:', notificationsData);
                setNotifications([]);
            }
            setError(null);
        } catch (error) {
            setError('Không thể tải thông báo');
            console.error('Error fetching notifications:', error);
            setNotifications([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            await axios.put(`${API_URL}/notification/mark-read/${notificationId}`, null, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            setNotifications((prev) => {
                if (!Array.isArray(prev)) return [];
                return prev.map((notification) =>
                    notification._id === notificationId ? { ...notification, isRead: true } : notification,
                );
            });
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.put(`${API_URL}/notification/mark-all-read`, null, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setNotifications((prev) => {
                if (!Array.isArray(prev)) return [];
                return prev.map((notification) => ({ ...notification, isRead: true }));
            });
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            throw error;
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            console.log('token: ', accessToken);
            await axios.delete(`${API_URL}/notification/delete/${notificationId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setNotifications((prev) => {
                if (!Array.isArray(prev)) return [];
                return prev.filter((notification) => notification._id !== notificationId);
            });
        } catch (error) {
            console.error('Error deleting notification:', error);
            throw error;
        }
    };

    const deleteAllNotifications = async () => {
        try {
            await axios.delete(`${API_URL}/notification/all/${userId}`);
            setNotifications([]);
        } catch (error) {
            console.error('Error deleting all notifications:', error);
            throw error;
        }
    };

    const refreshNotifications = () => {
        fetchNotifications();
    };

    const value = {
        notifications,
        hasNewNotification,
        loading,
        error,
        setHasNewNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteAllNotifications,
        refreshNotifications,
    };

    return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};
