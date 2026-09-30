import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Box, Paper, List, ListItem, ListItemText,
    ListItemAvatar, Avatar, Chip, CircularProgress, Divider, Button,
    IconButton, Tooltip, Fade
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    CheckCircle as CheckCircleIcon,
    Info as InfoIcon,
    Warning as WarningIcon,
    Assignment as AssignmentIcon,
    DoneAll as MarkReadIcon,
    Refresh as RefreshIcon,
    DeleteSweep as ClearIcon
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import client from '../../api/client';
import { useNavigate } from 'react-router-dom';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            const res = await client.get('/notifications/notifications/');
            const data = res.data.results ? res.data.results : res.data;
            setNotifications(data || []);
        } catch (err) {
            console.error('Failed to fetch notifications', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkAllRead = async () => {
        try {
            await client.post('/notifications/notifications/mark_all_read/');
            fetchNotifications();
        } catch (err) {
            console.error(err);
        }
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
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <CircularProgress thickness={5} size={50} />
        </Box>
    );

    return (
        <Container maxWidth="md" className="page-transition" sx={{ py: 6 }}>
            <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.02em' }}>
                        Notifications Center
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Stay informed about your community impact and report updates.
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Mark all as read">
                        <IconButton onClick={handleMarkAllRead} sx={{ border: '1px solid #e2e8f0' }}>
                            <MarkReadIcon color="primary" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Refresh">
                        <IconButton onClick={fetchNotifications} sx={{ border: '1px solid #e2e8f0' }}>
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            <Paper className="glass-panel" sx={{ borderRadius: 6, overflow: 'hidden', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.06)' }}>
                <List sx={{ p: 0 }}>
                    {notifications.length === 0 ? (
                        <Box sx={{ p: 12, textAlign: 'center' }}>
                            <NotificationsIcon sx={{ fontSize: 80, opacity: 0.1, mb: 3 }} />
                            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>All clear!</Typography>
                            <Typography variant="body1" color="text.secondary">You don't have any notifications at the moment.</Typography>
                        </Box>
                    ) : (
                        notifications.map((n, index) => (
                            <Fade in={true} key={n.id} style={{ transitionDelay: `${index * 50}ms` }}>
                                <Box>
                                    <ListItem
                                        button
                                        onClick={() => handleNotificationClick(n)}
                                        sx={{
                                            p: 4,
                                            bgcolor: n.is_read ? 'transparent' : 'rgba(30, 64, 175, 0.04)',
                                            borderLeft: n.is_read ? '6px solid transparent' : '6px solid #1e40af',
                                            transition: 'all 0.2s',
                                            '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' }
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar sx={{ width: 60, height: 60, bgcolor: 'white', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                                                {getIcon(n.notification_type)}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            sx={{ ml: 3 }}
                                            primary={
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                                    <Typography variant="h6" sx={{ fontWeight: n.is_read ? 700 : 900, fontSize: '1.1rem' }}>
                                                        {n.title}
                                                    </Typography>
                                                    {!n.is_read && <Chip label="NEW" color="primary" size="small" sx={{ fontWeight: 900, px: 1, height: 22 }} />}
                                                </Box>
                                            }
                                            secondary={
                                                <Box>
                                                    <Typography variant="body1" sx={{ color: n.is_read ? 'text.secondary' : 'text.primary', mb: 1.5, lineHeight: 1.6 }}>
                                                        {n.message}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <TimeIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                                                        <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600 }}>
                                                            {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                    {index < notifications.length - 1 && <Divider />}
                                </Box>
                            </Fade>
                        ))
                    )}
                </List>
            </Paper>

            {notifications.length > 0 && (
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Button startIcon={<ClearIcon />} color="error" sx={{ fontWeight: 700 }}>
                        Delete All Notifications
                    </Button>
                </Box>
            )}
        </Container>
    );
};

// Mock TimeIcon if needed (AssignmentIcon used if not found, but it should be importable as AccessTime)
const TimeIcon = (props: any) => <AssignmentIcon {...props} sx={{ ...props.sx, fontSize: 14 }} />;

export default NotificationsPage;
