import React, { useState, useEffect } from 'react';
import {
    Container, Grid, Paper, Typography, Box, Button,
    Card, CardContent, CircularProgress, Avatar, Chip,
    List, ListItem, ListItemText, ListItemAvatar, Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import client from '../../api/client';
import { useAuthStore } from '../../store/useAuthStore';
import {
    Report as ReportIcon,
    CheckCircle as ResolvedIcon,
    Pending as PendingIcon,
    Timeline as ActivityIcon,
    Add as AddIcon,
    ArrowForward as ArrowForwardIcon,
    Verified as VerifiedIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

const CitizenDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [stats, setStats] = useState<any>(null);
    const [recentReports, setRecentReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, reportsRes] = await Promise.all([
                    client.get('/reports/reports/dashboard_stats/'),
                    client.get('/reports/reports/my_reports/')
                ]);
                setStats(statsRes.data);
                // Take only 3 most recent
                const reports = reportsRes.data.results ? reportsRes.data.results : reportsRes.data;
                setRecentReports((reports || []).slice(0, 3));
            } catch (err) {
                console.error('Failed to fetch dashboard data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const statCards = [
        { label: 'Total Logs', value: stats?.total_reports || 0, icon: <ReportIcon color="primary" />, bg: 'rgba(30, 64, 175, 0.05)', color: '#1e40af' },
        { label: 'In Review', value: stats?.pending_reports || 0, icon: <PendingIcon sx={{ color: '#fb923c' }} />, bg: 'rgba(251, 146, 60, 0.05)', color: '#fb923c' },
        { label: 'Successes', value: stats?.resolved_reports || 0, icon: <ResolvedIcon sx={{ color: '#10b981' }} />, bg: 'rgba(16, 185, 129, 0.05)', color: '#10b981' },
    ];

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <CircularProgress thickness={5} size={50} />
        </Box>
    );

    return (
        <Container maxWidth="xl" className="page-transition" sx={{ py: 4 }}>
            {/* Hero Welcome */}
            <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 3 }}>
                <Box>
                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.02em' }}>
                        Welcome back, {user?.username} 👋
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                        You've helped resolve <strong>{stats?.resolved_reports || 0}</strong> issues in your community. Keep it up!
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    size="large"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/report')}
                    sx={{
                        px: 6,
                        py: 2,
                        borderRadius: 4,
                        fontWeight: 700,
                        fontSize: '1rem',
                        boxShadow: '0 10px 20px rgba(30, 64, 175, 0.2)'
                    }}
                >
                    Report New Issue
                </Button>
            </Box>

            {/* Top Stats Ribbon */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
                {statCards.map((stat, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                borderRadius: 5,
                                border: '1px solid #e2e8f0',
                                bgcolor: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 3,
                                transition: 'all 0.3s ease',
                                '&:hover': { transform: 'translateY(-5px)', borderColor: stat.color }
                            }}
                        >
                            <Box sx={{
                                p: 2,
                                borderRadius: 4,
                                bgcolor: stat.bg,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {stat.icon}
                            </Box>
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 900, color: stat.color }}>{stat.value}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                                    {stat.label}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={4}>
                {/* Recent Reports List */}
                <Grid item xs={12} md={7}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" sx={{ fontWeight: 800 }}>Your Recent Reports</Typography>
                        <Button endIcon={<ArrowForwardIcon />} sx={{ fontWeight: 700 }} onClick={() => navigate('/my-reports')}>
                            View All
                        </Button>
                    </Box>
                    <Paper className="glass-panel" sx={{ borderRadius: 5, overflow: 'hidden' }}>
                        {recentReports.length === 0 ? (
                            <Box sx={{ p: 6, textAlign: 'center' }}>
                                <Typography color="text.secondary">No reports filed yet. Start by reporting something!</Typography>
                            </Box>
                        ) : (
                            <List sx={{ p: 0 }}>
                                {recentReports.map((report, index) => (
                                    <React.Fragment key={report.id}>
                                        <ListItem
                                            button
                                            onClick={() => navigate(`/report/${report.id}`)}
                                            sx={{ p: 3, '&:hover': { bgcolor: 'rgba(0,0,0,0.01)' } }}
                                        >
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: 'white', border: '1px solid #e2e8f0', p: 1 }}>
                                                    <ReportIcon color="primary" />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={<Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{report.category_name}</Typography>}
                                                secondary={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                                                        <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            📍 {report.address || 'Location Record'}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.disabled">•</Typography>
                                                        <Typography variant="caption">{format(new Date(report.created_at), 'MMM dd, yyyy')}</Typography>
                                                    </Box>
                                                }
                                            />
                                            <Chip
                                                label={report.status}
                                                size="small"
                                                variant="outlined"
                                                sx={{
                                                    fontWeight: 800,
                                                    fontSize: '0.65rem',
                                                    color: report.status === 'resolved' ? 'success.main' : 'warning.main',
                                                    borderColor: report.status === 'resolved' ? 'success.light' : 'warning.light'
                                                }}
                                            />
                                        </ListItem>
                                        {index < recentReports.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </List>
                        )}
                    </Paper>
                </Grid>

                {/* Impact Sidebar */}
                <Grid item xs={12} md={5}>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>Community Impact</Typography>
                    <Card sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        borderRadius: 6,
                        p: 4,
                        border: 'none',
                        position: 'relative',
                        overflow: 'hidden',
                        mb: 4
                    }}>
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                                    <VerifiedIcon />
                                </Avatar>
                                <Typography variant="h6" sx={{ fontWeight: 800 }}>InfraCred Verified</Typography>
                            </Box>
                            <Typography variant="h2" sx={{ fontWeight: 900, mb: 1 }}>{stats?.resolved_reports || 0}</Typography>
                            <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500 }}>
                                Issues resolved through your accurate community reporting.
                            </Typography>
                        </Box>
                        {/* Decorative circle */}
                        <Box sx={{
                            position: 'absolute',
                            top: -20,
                            right: -20,
                            width: 150,
                            height: 150,
                            borderRadius: '50%',
                            bgcolor: 'rgba(255,255,255,0.1)'
                        }} />
                    </Card>

                    <Paper className="glass-panel" sx={{ p: 4, borderRadius: 6 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2 }}>Why Report?</Typography>
                        <List dense>
                            {[
                                "Faster response times from local authorities",
                                "Transparent tracking of public fund use",
                                "Build a safer community for everyone",
                                "Increase your citizen trust score"
                            ].map((text, i) => (
                                <ListItem key={i} sx={{ px: 0 }}>
                                    <ListItemAvatar sx={{ minWidth: 32 }}>
                                        <ActivityIcon sx={{ fontSize: 16, color: 'secondary.main' }} />
                                    </ListItemAvatar>
                                    <ListItemText primary={text} primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }} />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default CitizenDashboard;
