import React from 'react';
import '../css/FooterUser.css';
function FooterUser() {
  return (
    <footer className="footer-fs">
      <div className="footer-content-fs">
        <h3>FiveForOne</h3>
        <p>This page is created by Team FiveForOne. If you have any feedback for us, please contact us with these social media.</p>
        <div className="social-icons-fs">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-facebook-f"></i>
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-twitter"></i>
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-instagram"></i>
        </a>
        </div>
      </div>
      <div className="footer-end-fs">
        <p>&copy; 2024 FiveForOne. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default FooterUser;