import { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Button, Grid, Card, CardContent, Chip, CircularProgress, Tabs, Tab } from '@mui/material';
import { CheckCircle as ResolveIcon, GetApp as ExportIcon, Assignment as TriageIcon, History as HistoryIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import client from '../../api/client';

const ClusterList = () => {
    const [clusters, setClusters] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const filter = query.get('is_active');
    const [tab, setTab] = useState(filter === 'false' ? 1 : 0);

    const fetchClusters = async () => {
        setLoading(true);
        try {
            const activeParam = tab === 0 ? 'true' : 'false';
            const res = await client.get(`/clustering/clusters/?is_active=${activeParam}`);
            const data = res.data.results ? res.data.results : res.data;
            setClusters(data || []);
        } catch (err) {
            console.error('Error fetching clusters', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const filter = query.get('is_active');
        if (filter === 'false') setTab(1);
        else if (filter === 'true') setTab(0);
    }, [location.search]);

    useEffect(() => {
        fetchClusters();
    }, [tab]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    const handleResolve = async (id: number) => {
        if (!window.confirm("Are you sure you want to resolve this cluster? All associated reports will be marked as resolved.")) return;
        try {
            await client.post(`/clustering/clusters/${id}/resolve/`);
            fetchClusters();
            alert('Cluster resolved successfully');
        } catch (err) {
            console.error('Failed to resolve cluster', err);
            alert('Failed to resolve cluster');
        }
    };

    return (
        <Container maxWidth="xl" className="page-transition" sx={{ py: 4 }}>
            <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary', mb: 1 }}>
                        {tab === 0 ? 'Investigation Queue' : 'Resolved Archives'}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {tab === 0
                            ? 'Managed clusters of reported infrastructure anomalies needing attention.'
                            : 'Historical record of resolved infrastructure issues.'}
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    startIcon={<ExportIcon />}
                    sx={{ px: 3, py: 1, borderRadius: 2 }}
                >
                    Export Intel
                </Button>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
                <Tabs value={tab} onChange={handleTabChange} sx={{ '& .MuiTab-root': { fontWeight: 700, px: 4 } }}>
                    <Tab icon={<TriageIcon />} iconPosition="start" label="Active Triage" />
                    <Tab icon={<HistoryIcon />} iconPosition="start" label="Resolved History" />
                </Tabs>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>
            ) : clusters.length === 0 ? (
                <Paper className="glass-panel" sx={{ p: 8, textAlign: 'center', borderRadius: 6 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>No items found</Typography>
                    <Typography variant="body1" color="text.secondary">
                        {tab === 0 ? 'No active clusters for triage.' : 'No resolved clusters in history.'}
                    </Typography>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {clusters.map((cluster: any) => (
                        <Grid item xs={12} sm={6} md={4} key={cluster.id}>
                            <Card
                                className="premium-card"
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    position: 'relative',
                                    p: 0,
                                    border: 'none',
                                    '&:before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: 5,
                                        height: '100%',
                                        bgcolor: cluster.is_active ? 'warning.main' : 'success.main'
                                    }
                                }}
                            >
                                <CardContent sx={{ p: 3, flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Box>
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                                                ID: CLS-{cluster.id}
                                            </Typography>
                                            <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
                                                {cluster.category_name || 'Uncategorized'}
                                            </Typography>
                                        </Box>
                                        <Chip
                                            label={cluster.is_active ? 'ACTIVE' : 'RESOLVED'}
                                            color={cluster.is_active ? 'warning' : 'success'}
                                            size="small"
                                            sx={{ fontWeight: 800 }}
                                        />
                                    </Box>

                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                        📍 {cluster.center_address || 'Multiple Locations'}
                                    </Typography>

                                    <Box sx={{ display: 'flex', gap: 3 }}>
                                        <Box>
                                            <Typography variant="h5" sx={{ fontWeight: 700 }}>{cluster.report_count}</Typography>
                                            <Typography variant="caption" color="text.secondary">Citizen Reports</Typography>
                                        </Box>
                                        <Box sx={{ borderLeft: '1px solid #f1f5f9', pl: 3 }}>
                                            <Typography variant="h5" sx={{ fontWeight: 700 }}>High</Typography>
                                            <Typography variant="caption" color="text.secondary">Priority</Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                                <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={() => navigate(`/authority/clusters/${cluster.id}`)}
                                        sx={{ borderRadius: 2 }}
                                    >
                                        View Case
                                    </Button>
                                    {cluster.is_active && (
                                        <Button
                                            variant="outlined"
                                            color="success"
                                            onClick={() => handleResolve(cluster.id)}
                                            sx={{ borderRadius: 2 }}
                                        >
                                            <ResolveIcon />
                                        </Button>
                                    )}
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default ClusterList;
