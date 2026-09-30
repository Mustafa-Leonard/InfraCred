import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Box } from '@mui/material';
import {
    Report as ReportIcon,
    ListAlt as ListIcon,
    Map as MapIcon,
    GroupWork as ClusterIcon,
    Business as AuthorityIcon,
    LocationOn as GeoIcon,
    Settings as AdminIcon,
    CheckCircle as ConfirmIcon,
    CheckCircle,
    Dashboard as DashboardIcon,
    Person as PersonIcon,
    People as PeopleIcon,
    Notifications as AlertIcon,
    Assessment as AnalyticsIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

interface SidebarProps {
    mobileOpen: boolean;
    onClose: () => void;
}

const drawerWidth = 240;

const Sidebar = ({ mobileOpen, onClose }: SidebarProps) => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const getMenuItems = () => {
        const items = [];
        const role = user?.role?.toLowerCase();

        if (role === 'citizen') {
            items.push(
                { text: 'My Reports', icon: <ListIcon />, path: '/my-reports' },
                { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
                { text: 'Notifications', icon: <AlertIcon />, path: '/notifications' },
                { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
                { text: 'Citizen Map', icon: <MapIcon />, path: '/nearby' },
                { text: 'New Report', icon: <ReportIcon />, path: '/report' },
                { text: 'Validate Reports', icon: <ConfirmIcon />, path: '/confirm' }
            );
        } else if (role === 'authority') {
            items.push(
                { text: 'Dashboard', icon: <DashboardIcon />, path: '/authority/dashboard' },
                { text: 'Assigned Reports', icon: <ClusterIcon />, path: '/authority/assigned?is_active=true' },
                { text: 'In Progress', icon: <ReportIcon />, path: '/authority/in-progress?is_active=true' },
                { text: 'Resolved', icon: <CheckCircle />, path: '/authority/resolved?is_active=false' },
                { text: 'Analytics', icon: <AnalyticsIcon />, path: '/authority/map' },
                { text: 'Notifications', icon: <AlertIcon />, path: '/notifications' },
                { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
                { text: 'Team', icon: <PeopleIcon />, path: '/authority/users' }
            );
        } else if (role === 'admin') {
            items.push(
                { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
                { text: 'Resolved', icon: <CheckCircle />, path: '/authority/resolved?is_active=false' },
                { text: 'In Progress', icon: <ReportIcon />, path: '/authority/in-progress?is_active=true' },
                { text: 'Assigned Reports', icon: <ClusterIcon />, path: '/authority/assigned?is_active=true' },
                { text: 'Analytics', icon: <AnalyticsIcon />, path: '/authority/map' },
                { text: 'Infra Types', icon: <AdminIcon />, path: '/admin/infra-types' },
                { text: 'Jurisdictions', icon: <GeoIcon />, path: '/admin/jurisdictions' },
                { text: 'Agencies', icon: <AuthorityIcon />, path: '/admin/agencies' },
                { text: 'Routing Rules', icon: <ListIcon />, path: '/admin/routing' },
                { text: 'Teams', icon: <PeopleIcon />, path: '/authority/users' },
                { text: 'Notifications', icon: <AlertIcon />, path: '/notifications' },
                { text: 'Profile', icon: <PersonIcon />, path: '/profile' }
            );
        }

        return items;
    };

    const handleNavigate = (path: string) => {
        navigate(path);
        onClose(); // Close mobile drawer after navigation
    };

    const isSelected = (path: string) => {
        const currentPath = location.pathname;
        const targetPath = path.split('?')[0];
        return currentPath === targetPath;
    };

    const drawerContent = (
        <Box sx={{ bgcolor: 'background.paper', height: '100%' }}>
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
                <List>
                    {getMenuItems().map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton
                                onClick={() => handleNavigate(item.path)}
                                selected={isSelected(item.path)}
                                sx={{
                                    borderRadius: '0 24px 24px 0',
                                    mr: 1,
                                    '&.Mui-selected': {
                                        bgcolor: 'primary.light',
                                        color: 'primary.main',
                                        '& .MuiListItemIcon-root': { color: 'primary.main' }
                                    }
                                }}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 500 }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Box>
    );

    return (
        <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={onClose}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* Desktop Drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid #eee' },
                }}
                open
            >
                {drawerContent}
            </Drawer>
        </Box>
    );
};

export default Sidebar;
