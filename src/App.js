// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminRoutes from './routes/AdminRoutes';
import UserRoutes from './routes/UserRoutes';
import ForgotPassword from './pages/ForgotPassword';
import './assets/css/variables.css';
import { CartProvider } from './context/CartContext'; // Import CartProvider
import { NotificationProvider } from './context/NotificationContext.js';
import VerifyRegisterFailed from './components/VerifyRegisterFailed';
import SearchResults from './pages/SearchResults';
import MessengerIcon from './pages/Users/components/MessengerIcon.jsx';
import VerifyOTP from './pages/VerifyOTP.jsx';
import NewPassword from './pages/NewPassword.jsx';
function App() {
    return (
        <NotificationProvider>
            <CartProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/admin/*" element={<AdminRoutes />} />
                        <Route path="/user/*" element={<UserRoutes />} />
                        <Route path="/search" element={<SearchResults />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/verify-register/failed" element={<VerifyRegisterFailed />} />
                        <Route path="/verify-otp" element={<VerifyOTP />} />
                        <Route path="/new-password" element={<NewPassword />} />
                    </Routes>
                </Router>
                <MessengerIcon />
            </CartProvider>
        </NotificationProvider>
    );
}

export default App;
