import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { Menu as MenuIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import NotificationsMenu from '../common/NotificationsMenu';

interface NavbarProps {
    onToggleSidebar?: () => void;
}

const Navbar = ({ onToggleSidebar }: NavbarProps) => {
    const { isAuthenticated, user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                borderBottom: '1px solid',
                borderColor: 'rgba(226, 232, 240, 0.8)'
            }}
        >
            <Toolbar sx={{ px: { md: 4 } }}>
                {isAuthenticated && (
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={onToggleSidebar}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                )}
                <Box
                    sx={{
                        flexGrow: 1,
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5
                    }}
                    onClick={() => navigate('/')}
                >
                    <Typography
                        variant="h5"
                        component="div"
                        sx={{
                            fontWeight: 900,
                            letterSpacing: '-1.5px',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <Box
                            component="span"
                            sx={{
                                background: 'linear-gradient(135deg, #1e40af 0%, #10b981 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            InfraCred
                        </Box>
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            color: 'text.secondary',
                            fontSize: '0.7rem',
                            fontWeight: 500,
                            letterSpacing: '0.5px',
                            display: { xs: 'none', sm: 'block' }
                        }}
                    >
                        Report. Track. Resolve public infrastructure issues
                    </Typography>
                </Box>

                {isAuthenticated ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <NotificationsMenu />
                        <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1 }}>
                                    {user?.username}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                                    {user?.role} Portal
                                </Typography>
                            </Box>
                            <Box sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #1e40af 0%, #10b981 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 800,
                                boxShadow: '0 4px 12px rgba(30, 64, 175, 0.2)'
                            }}>
                                {user?.username?.charAt(0).toUpperCase()}
                            </Box>
                        </Box>
                        <IconButton
                            onClick={handleLogout}
                            color="error"
                            sx={{
                                bgcolor: 'rgba(244, 63, 94, 0.05)',
                                '&:hover': { bgcolor: 'rgba(244, 63, 94, 0.1)' }
                            }}
                        >
                            <LogoutIcon />
                        </IconButton>
                    </Box>
                ) : (
                    <Button
                        variant="contained"
                        onClick={() => navigate('/login')}
                        sx={{ px: 4 }}
                    >
                        Sign In
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
