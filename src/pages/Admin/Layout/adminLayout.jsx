import React from 'react';
import SideBar from '../components/SideBar/SideBar';
import Header from '../components/header/header';
import { Outlet } from 'react-router-dom';
import './adminLayout.css';

const AdminLayout = () => {
    return (
        <div className="admin-layout">
            <div className="sidebar">
                <SideBar />
            </div>
            <div className="main-content">
                <div className="header">
                    <Header />
                </div>
                <div className="content-area">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
