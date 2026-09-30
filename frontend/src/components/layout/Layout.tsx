import React, { useState, useEffect, useRef } from 'react';
import { Box, Toolbar } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

const Layout = () => {
    const { isAuthenticated } = useAuthStore();
    const [mobileOpen, setMobileOpen] = useState(false);

    const location = useLocation();
    const mainContentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (mainContentRef.current) {
            mainContentRef.current.scrollTop = 0;
        }
    }, [location.pathname]);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Navbar onToggleSidebar={handleDrawerToggle} />
            {isAuthenticated && (
                <Sidebar
                    mobileOpen={mobileOpen}
                    onClose={handleDrawerToggle}
                />
            )}
            <Box
                component="main"
                ref={mainContentRef}
                sx={{
                    flexGrow: 1,
                    p: { xs: 2, md: 4 },
                    width: '100%',
                    height: '100vh',
                    overflowY: 'auto',
                    bgcolor: 'background.default',
                    backgroundImage: 'radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.03) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(168, 85, 247, 0.03) 0, transparent 50%)',
                    backgroundAttachment: 'fixed',
                    position: 'relative',
                    scrollBehavior: 'smooth',
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};

export default Layout;
