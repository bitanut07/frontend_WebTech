import React from 'react';
import '../assets/css/loading.css';
const LoadingModal = () => {
    return (
        <div className="overlay-loading">
            <div className="spinner-loading"></div>
        </div>
    );
};

export default LoadingModal;
