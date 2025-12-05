const LOCAL_STORAGE_KEY = 'currentUser';
export const getCurrentUser = () => {
    try {
        const user = localStorage.getItem(LOCAL_STORAGE_KEY);
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error('Error retrieving user from localStorage:', error);
        return null;
    }
};

export const setCurrentUser = (user) => {
    try {
        if (!user || typeof user !== 'object' || !user.infoUser || !user.accessToken) {
            throw new Error('Invalid user object');
        }
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
        console.error('Error saving user to localStorage:', error);
    }
};

export const removeCurrentUser = () => {
    try {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (error) {
        console.error('Error removing user from localStorage:', error);
    }
};
