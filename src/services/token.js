export const getRefreshToken = () => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; refreshToken=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};
