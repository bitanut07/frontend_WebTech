// ImageViewer.js
import React from 'react';

const ImageViewer = ({ image, onClose }) => {
    return (
        <div className="image-viewer-overlay" onClick={onClose}>
            <div className="image-viewer-content">
                <button className="image-viewer-close" onClick={onClose}>
                    <i className="fas fa-times"></i>
                </button>
                <img src={image} alt="Full size preview" className="image-viewer-img" />
            </div>
        </div>
    );
};

export default ImageViewer;
