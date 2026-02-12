import { useState, useEffect } from 'react';
import {
    IconButton, Badge, Menu, MenuItem, Typography, Box,
    List, ListItem, ListItemText, ListItemAvatar, Avatar,
    Button, Divider, Fade
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    CheckCircle as CheckCircleIcon,
    Info as InfoIcon,
    Warning as WarningIcon,
    Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import client from '../../api/client';
import { useNavigate } from 'react-router-dom';

const NotificationsMenu = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const navigate = useNavigate();

    const open = Boolean(anchorEl);

    const fetchNotifications = async () => {
        try {
            const res = await client.get('/notifications/notifications/');
            // Adjust depending on pagination
            const data = res.data.results ? res.data.results : res.data;
            setNotifications(data || []);

            // Calculate unread count locally or fetch from endpoint
            const unread = data.filter((n: any) => !n.is_read).length;
            setUnreadCount(unread);
        } catch (err) {
            console.error('Failed to fetch notifications', err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        // Mark as read when opening? Maybe better to have a button.
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMarkAllRead = async () => {
        try {
            await client.post('/notifications/notifications/mark_all_read/');
            fetchNotifications();
        } catch (err) {
            console.error(err);
        }
    };

    const handleNotificationClick = async (notification: any) => {
        if (!notification.is_read) {
            try {
                await client.post(`/notifications/notifications/${notification.id}/mark_read/`);
                fetchNotifications();
            } catch (err) {
                console.error(err);
            }
        }

        if (notification.report) {
            navigate(`/report/${notification.report}`);
        }
        handleClose();
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'report_resolved': return <CheckCircleIcon color="success" />;
            case 'report_rejected': return <InfoIcon color="error" />;
            case 'report_in_progress': return <WarningIcon color="warning" />;
            case 'report_assigned': return <AssignmentIcon color="info" />;
            default: return <NotificationsIcon color="primary" />;
        }
    };

    return (
        <>
            <IconButton
                onClick={handleClick}
                sx={{
                    mr: 2,
                    bgcolor: unreadCount > 0 ? 'rgba(30, 64, 175, 0.1)' : 'transparent',
                    '&:hover': { bgcolor: 'rgba(30, 64, 175, 0.2)' }
                }}
            >
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon color="primary" />
                </Badge>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
                PaperProps={{
                    sx: {
                        width: 360,
                        maxHeight: 480,
                        borderRadius: 4,
                        mt: 1.5,
                        boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2)',
                        border: '1px solid #e2e8f0',
                        background: '#ffffff'
                    }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6" fontWeight="bold">Notifications</Typography>
                    {unreadCount > 0 && (
                        <Button size="small" onClick={handleMarkAllRead}>
                            Mark all read
                        </Button>
                    )}
                </Box>
                <Divider />

                <List sx={{ p: 0 }}>
                    {notifications.length === 0 ? (
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                No notifications yet
                            </Typography>
                        </Box>
                    ) : (
                        notifications.map((notification) => (
                            <ListItem
                                key={notification.id}
                                button
                                onClick={() => handleNotificationClick(notification)}
                                sx={{
                                    bgcolor: notification.is_read ? 'transparent' : 'rgba(30, 64, 175, 0.04)',
                                    borderLeft: notification.is_read ? '4px solid transparent' : '4px solid #1e40af',
                                    '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' }
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: 'white', border: '1px solid #e2e8f0' }}>
                                        {getIcon(notification.notification_type)}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Typography variant="subtitle2" fontWeight={notification.is_read ? 500 : 700}>
                                            {notification.title}
                                        </Typography>
                                    }
                                    secondary={
                                        <Box component="span">
                                            <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: '0.85rem' }}>
                                                {notification.message}
                                            </Typography>
                                            <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>
                                                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </ListItem>
                        ))
                    )}
                </List>
            </Menu>
        </>
    );
};

export default NotificationsMenu;
