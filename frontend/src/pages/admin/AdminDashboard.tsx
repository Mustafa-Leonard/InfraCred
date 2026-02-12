import { Container, Grid, Paper, Typography, Box, Card, CardContent, Button } from '@mui/material';
import {
    Report as ReportIcon,
    Business as AuthorityIcon,
    LocationOn as GeoIcon,
    GroupWork as ClusterIcon
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import client from '../../api/client';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalReports: 0,
        totalClusters: 0,
        totalAuthorities: 0,
        totalJurisdictions: 0,
        resolvedIssues: 0
    });
    const [recentReports, setRecentReports] = useState<any[]>([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [reports, clusters, agencies, jurisdictions] = await Promise.all([
                    client.get('/reports/reports/'),
                    client.get('/clustering/clusters/'),
                    client.get('/authorities/agencies/'),
                    client.get('/geo/jurisdictions/')
                ]);

                const getCount = (res: any) => res.data.count ?? (res.data.results?.length) ?? res.data.length ?? 0;

                const reportList = reports.data.results ? reports.data.results : (Array.isArray(reports.data) ? reports.data : []);
                const resolvedCount = reportList.filter((r: any) => r.status === 'resolved').length;

                setStats({
                    totalReports: getCount(reports),
                    totalClusters: getCount(clusters),
                    totalAuthorities: getCount(agencies),
                    totalJurisdictions: getCount(jurisdictions),
                    resolvedIssues: resolvedCount
                });

                setRecentReports(reportList.slice(0, 5));
            } catch (err) {
                console.error("Error fetching stats", err);
            }
        };
        fetchStats();
    }, []);

    const StatCard = ({ title, value, icon, color }: any) => (
        <Card className="premium-card" sx={{ height: '100%', border: 'none', position: 'relative', overflow: 'hidden' }}>
            <Box sx={{
                position: 'absolute',
                top: -10,
                right: -10,
                opacity: 0.05,
                transform: 'scale(3)'
            }}>
                {icon}
            </Box>
            <CardContent sx={{ position: 'relative' }}>
                <Box sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    bgcolor: `${color}.light`,
                    color: `${color}.main`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                    boxShadow: `0 8px 16px -4px ${color === 'primary' ? 'rgba(99, 102, 241, 0.4)' : 'rgba(0,0,0,0.1)'}`
                }}>
                    {icon}
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary' }}>
                        {value}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <Container maxWidth="xl" className="page-transition" sx={{ py: 4 }}>
            <Box sx={{ mb: 6 }}>
                <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary', mb: 1 }}>
                    System Overview
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Real-time monitoring and administrative control of the InfraCred ecosystem.
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={2.4}>
                    <StatCard title="Total Reports" value={stats.totalReports} icon={<ReportIcon sx={{ fontSize: 28 }} />} color="primary" />
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <StatCard title="Resolved Issues" value={stats.resolvedIssues} icon={<ReportIcon sx={{ fontSize: 28 }} />} color="success" />
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <StatCard title="Live Clusters" value={stats.totalClusters} icon={<ClusterIcon sx={{ fontSize: 28 }} />} color="secondary" />
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <StatCard title="Active Agencies" value={stats.totalAuthorities} icon={<AuthorityIcon sx={{ fontSize: 28 }} />} color="info" />
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <StatCard title="Managed Wards" value={stats.totalJurisdictions} icon={<GeoIcon sx={{ fontSize: 28 }} />} color="warning" />
                </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mt: 3 }}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 4, borderRadius: 4, bgcolor: 'primary.dark', color: 'white', position: 'relative', overflow: 'hidden' }}>
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                            <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
                                Command Center Active
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 4, opacity: 0.8, maxWidth: 600 }}>
                                You are currently viewing the central orchestration dashboard. Use the navigation panel to configure neural clustering parameters, manage authority service-level agreements (SLAs), and define geographic jurisdiction boundaries.
                            </Typography>
                            <Button variant="contained" color="secondary" size="large" sx={{ py: 1.5, px: 4 }}>
                                System Health Check
                            </Button>
                        </Box>
                        {/* Decorative background element */}
                        <Box sx={{
                            position: 'absolute',
                            top: -100,
                            right: -100,
                            width: 400,
                            height: 400,
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)'
                        }} />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 4, borderRadius: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                            Recent Activity
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {recentReports.length > 0 ? recentReports.map((report) => (
                                <Box key={report.id} sx={{ display: 'flex', gap: 2, pb: 2, borderBottom: '1px solid #f1f5f9' }}>
                                    <Box sx={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: '50%',
                                        mt: 1,
                                        bgcolor: report.status === 'resolved' ? 'success.main' :
                                            report.status === 'in_progress' ? 'warning.main' :
                                                report.status === 'rejected' ? 'error.main' : 'info.main'
                                    }} />
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {report.category_name || 'Report #' + report.id}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {new Date(report.created_at).toLocaleString()} • {report.status}
                                        </Typography>
                                    </Box>
                                </Box>
                            )) : (
                                <Typography variant="body2" color="text.secondary">No recent activity.</Typography>
                            )}
                        </Box>
                        <Button variant="text" fullWidth sx={{ mt: 2 }} href="/admin/reports">View All Reports</Button>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default AdminDashboard;
