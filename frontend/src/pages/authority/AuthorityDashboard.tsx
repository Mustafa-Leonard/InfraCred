import React, { useState, useEffect } from 'react';
import {
    Container, Grid, Paper, Typography, Box, Button, CircularProgress,
    List, ListItem, ListItemText, ListItemAvatar, Avatar, Chip, Divider,
    Card, CardContent
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import client from '../../api/client';
import {
    Dashboard as DashboardIcon,
    Assignment as AssignmentIcon,
    CheckCircle as ResolvedIcon,
    TrendingUp as AnalyticsIcon,
    Layers as ClusterIcon,
    Notifications as AlertIcon,
    Map as MapIcon,
    ArrowForward as ViewMoreIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

const AuthorityDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<any>(null);
    const [recentClusters, setRecentClusters] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [statsRes, clustersRes] = await Promise.all([
                    client.get('/reports/reports/authority_stats/'),
                    client.get('/clustering/clusters/?is_active=true')
                ]);
                setStats(statsRes.data);
                const clusters = clustersRes.data.results ? clustersRes.data.results : clustersRes.data;
                setRecentClusters((clusters || []).slice(0, 5));
            } catch (err) {
                console.error('Failed to fetch authority stats', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <CircularProgress thickness={5} size={50} />
        </Box>
    );

    const kpiCards = [
        { label: 'Active Clusters', value: stats?.total_active_clusters || 0, icon: <ClusterIcon />, color: '#1e40af', bg: 'rgba(30, 64, 175, 0.05)' },
        { label: 'Unclustered Reports', value: stats?.pending_unclustered || 0, icon: <AssignmentIcon />, color: '#fb923c', bg: 'rgba(251, 146, 60, 0.05)' },
        { label: 'Resolved (Month)', value: stats?.resolved_this_month || 0, icon: <ResolvedIcon />, color: '#10b981', bg: 'rgba(16, 185, 129, 0.05)' },
        { label: 'System Health', value: '100%', icon: <AlertIcon />, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.05)' },
    ];

    return (
        <Container maxWidth="xl" className="page-transition" sx={{ py: 4 }}>
            <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.02em' }}>
                        Command Center
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                        Operational oversight for infrastructure maintenance and jurisdictional intelligence.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<MapIcon />}
                    onClick={() => navigate('/authority/map')}
                    sx={{ px: 4, py: 1.5, borderRadius: 3, fontWeight: 700 }}
                >
                    Live Intel Map
                </Button>
            </Box>

            {/* KPI Section */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
                {kpiCards.map((kpi, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card sx={{
                            borderRadius: 5,
                            border: '1px solid #e2e8f0',
                            boxShadow: 'none',
                            transition: 'transform 0.2s',
                            '&:hover': { transform: 'translateY(-4px)' }
                        }}>
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: kpi.bg, color: kpi.color, display: 'flex' }}>
                                        {kpi.icon}
                                    </Box>
                                    <Typography variant="h4" sx={{ fontWeight: 900 }}>{kpi.value}</Typography>
                                </Box>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>
                                    {kpi.label}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={4}>
                {/* Active Triage Queue */}
                <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" sx={{ fontWeight: 800 }}>Triage Queue (Active Clusters)</Typography>
                        <Button endIcon={<ViewMoreIcon />} onClick={() => navigate('/authority/clusters')}>Full Queue</Button>
                    </Box>
                    <Paper className="glass-panel" sx={{ borderRadius: 6, overflow: 'hidden' }}>
                        {recentClusters.length === 0 ? (
                            <Box sx={{ p: 10, textAlign: 'center' }}>
                                <ClusterIcon sx={{ fontSize: 60, opacity: 0.1, mb: 2 }} />
                                <Typography color="text.secondary">No active clusters found. All reports are triaged.</Typography>
                            </Box>
                        ) : (
                            <List sx={{ p: 0 }}>
                                {recentClusters.map((cluster, index) => (
                                    <React.Fragment key={cluster.id}>
                                        <ListItem
                                            button
                                            onClick={() => navigate(`/authority/clusters/${cluster.id}`)}
                                            sx={{ p: 3, '&:hover': { bgcolor: 'rgba(0,0,0,0.01)' } }}
                                        >
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: 'white', border: '1px solid #e2e8f0', p: 1 }}>
                                                    <ClusterIcon color="warning" />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={<Typography variant="subtitle1" sx={{ fontWeight: 800 }}>{cluster.category_name}</Typography>}
                                                secondary={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                                                        <Typography variant="caption" sx={{ fontWeight: 600 }}>ID: CLS-{cluster.id}</Typography>
                                                        <Typography variant="caption" color="text.disabled">•</Typography>
                                                        <Typography variant="caption"><strong>{cluster.report_count}</strong> Reports Linked</Typography>
                                                    </Box>
                                                }
                                            />
                                            <Box sx={{ textAlign: 'right' }}>
                                                <Chip label="PRIORITY" size="small" color="warning" sx={{ fontWeight: 900, mb: 1, height: 20 }} />
                                                <Typography variant="caption" display="block" color="text.disabled">
                                                    Formed {format(new Date(cluster.created_at), 'MMM dd')}
                                                </Typography>
                                            </Box>
                                        </ListItem>
                                        {index < recentClusters.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </List>
                        )}
                    </Paper>
                </Grid>

                {/* Efficiency Stats */}
                <Grid item xs={12} md={4}>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>Efficiency Metrics</Typography>
                    <Paper className="glass-panel" sx={{ p: 4, borderRadius: 6, bgcolor: '#0f172a', color: 'white', mb: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                            <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 4 }}>
                                <AnalyticsIcon />
                            </Box>
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 900 }}>{stats?.resolution_rate || 85}%</Typography>
                                <Typography variant="caption" sx={{ fontWeight: 700, opacity: 0.7 }}>RESOLUTION RATE</Typography>
                            </Box>
                        </Box>
                        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 4 }} />
                        <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>
                            Projected target for Q1 2026 is 92%. Performance is consistent with baseline.
                        </Typography>
                        <Button variant="contained" color="primary" fullWidth sx={{ py: 1.5, borderRadius: 3, fontWeight: 800 }}>
                            Generate Audit Report
                        </Button>
                    </Paper>

                    <Paper className="glass-panel" sx={{ p: 4, borderRadius: 6 }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Quick Access</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Box
                                    sx={{ p: 2, borderRadius: 4, bgcolor: '#f8fafc', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', '&:hover': { bgcolor: '#f1f5f9' } }}
                                    onClick={() => navigate('/authority/users')}
                                >
                                    <AssignmentIcon color="primary" sx={{ mb: 1 }} />
                                    <Typography variant="caption" display="block" sx={{ fontWeight: 700 }}>Team</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box
                                    sx={{ p: 2, borderRadius: 4, bgcolor: '#f8fafc', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', '&:hover': { bgcolor: '#f1f5f9' } }}
                                    onClick={() => navigate('/authority/clusters?is_active=false')}
                                >
                                    <ResolvedIcon color="secondary" sx={{ mb: 1 }} />
                                    <Typography variant="caption" display="block" sx={{ fontWeight: 700 }}>Archives</Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default AuthorityDashboard;
