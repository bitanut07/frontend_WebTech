// src/pages/Users/components/MessengerIcon.jsx
import React from 'react';
import '../css/MessengerIcon.css';

function MessengerIcon() {
    return (
        <a 
            href="https://m.me/thunder.manjoume.56" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="fb-messenger-icon"
            aria-label="Chat on Messenger"
        >
            <i className="fab fa-facebook-messenger"></i>
        </a>
    );
}
export default MessengerIcon;