import { useState, useEffect } from 'react';
import {
    Container, Typography, Box, Paper, Button, Grid, Card, CardContent,
    Chip, CircularProgress, TextField, InputAdornment, IconButton, Tooltip,
    Fade, Zoom
} from '@mui/material';
import {
    Visibility as ViewIcon,
    Search as SearchIcon,
    FilterList as FilterIcon,
    Refresh as RefreshIcon,
    Add as AddIcon,
    LocationOn as LocationIcon,
    AccessTime as TimeIcon
} from '@mui/icons-material';
import client from '../../api/client';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const MyReports = () => {
    const [reports, setReports] = useState<any[]>([]);
    const [filteredReports, setFilteredReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const [reputation, setReputation] = useState<any>(null);

    const fetchData = async () => {
        try {
            const [reportsRes, reputationRes] = await Promise.all([
                client.get('/reports/reports/my_reports/'),
                client.get('/trust/me/')
            ]);

            const reportsData = reportsRes.data.results ? reportsRes.data.results : reportsRes.data;
            setReports(reportsData || []);
            setFilteredReports(reportsData || []);
            setReputation(reputationRes.data);
        } catch (err) {
            console.error('Error fetching data', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000); // Polling every minute
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const filtered = reports.filter(report =>
            report.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.category_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredReports(filtered);
    }, [searchTerm, reports]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'warning';
            case 'in_progress': return 'info';
            case 'resolved': return 'success';
            case 'rejected': return 'error';
            default: return 'default';
        }
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <CircularProgress thickness={5} size={60} />
        </Box>
    );

    return (
        <Container maxWidth="lg" className="page-transition" sx={{ py: 6 }}>
            {/* Header Section */}
            <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 3 }}>
                <Box>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary', mb: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                        My Activity Hub
                        {reports.length > 0 && (
                            <Chip
                                label={`${reports.length} Reports`}
                                color="primary"
                                sx={{ fontWeight: 800, fontSize: '0.9rem', height: 28 }}
                            />
                        )}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Comprehensive tracking of your community contributions and issue resolutions.
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Tooltip title="Refresh Data">
                        <IconButton onClick={fetchData} sx={{ border: '1px solid #e2e8f0' }}>
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/report')}
                        sx={{ px: 4, borderRadius: 3, fontWeight: 700 }}
                    >
                        New Report
                    </Button>
                </Box>
            </Box>

            {/* Stats & Search Ribbon */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
                <Grid item xs={12} md={8}>
                    <TextField
                        fullWidth
                        placeholder="Search your reports by location, category, or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                            sx: {
                                borderRadius: 4,
                                bgcolor: 'white',
                                '& fieldset': { border: 'none' },
                                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                                border: '1px solid #e2e8f0'
                            }
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    {reputation && (
                        <Paper sx={{
                            p: '14px 24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderRadius: 4,
                            bgcolor: 'primary.main',
                            color: 'white',
                            border: 'none'
                        }}>
                            <Box>
                                <Typography variant="caption" sx={{ fontWeight: 700, opacity: 0.8 }}>TRUST RATING</Typography>
                                <Typography variant="h5" sx={{ fontWeight: 900 }}>Tier {reputation.score > 80 ? 'Elite' : 'Active'}</Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="h4" sx={{ fontWeight: 900 }}>{Math.round(reputation.score)}</Typography>
                            </Box>
                        </Paper>
                    )}
                </Grid>
            </Grid>

            {/* Content Section */}
            {filteredReports.length === 0 ? (
                <Fade in={true}>
                    <Paper
                        sx={{
                            p: 10,
                            textAlign: 'center',
                            borderRadius: 8,
                            bgcolor: 'rgba(255,255,255,0.5)',
                            border: '2px dashed #e2e8f0'
                        }}
                    >
                        <Box sx={{ mb: 3, opacity: 0.2 }}>
                            <SearchIcon sx={{ fontSize: 80 }} />
                        </Box>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                            {searchTerm ? 'No matches found' : 'Your queue is empty'}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
                            {searchTerm
                                ? "We couldn't find any reports matching your current search criteria."
                                : "Start contributing to your community by reporting infrastructure issues in your neighborhood."}
                        </Typography>
                        {!searchTerm && (
                            <Button variant="outlined" size="large" onClick={() => navigate('/report')} sx={{ borderRadius: 3 }}>
                                File First Report
                            </Button>
                        )}
                    </Paper>
                </Fade>
            ) : (
                <Grid container spacing={4}>
                    {filteredReports.map((report: any, index: number) => (
                        <Grid item xs={12} sm={6} md={4} key={report.id}>
                            <Zoom in={true} style={{ transitionDelay: `${index * 50}ms` }}>
                                <Card
                                    className="premium-card"
                                    onClick={() => navigate(`/report/${report.id}`)}
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        p: 0,
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 20px 40px rgba(0,0,0,0.12)'
                                        }
                                    }}
                                >
                                    <Box sx={{ position: 'relative' }}>
                                        {report.image ? (
                                            <Box
                                                sx={{
                                                    height: 200,
                                                    width: '100%',
                                                    backgroundImage: `url(${report.image})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                    borderRadius: '20px 20px 0 0'
                                                }}
                                            />
                                        ) : (
                                            <Box
                                                sx={{
                                                    height: 200,
                                                    width: '100%',
                                                    bgcolor: 'rgba(30, 64, 175, 0.03)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: '20px 20px 0 0'
                                                }}
                                            >
                                                <ViewIcon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.2 }} />
                                            </Box>
                                        )}
                                        <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                                            <Chip
                                                label={report.status.toUpperCase()}
                                                color={getStatusColor(report.status) as any}
                                                sx={{ fontWeight: 800, fontSize: '0.65rem', height: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                            />
                                        </Box>
                                    </Box>

                                    <CardContent sx={{ p: 4, flexGrow: 1 }}>
                                        <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: 1, textTransform: 'uppercase', display: 'block', mb: 1 }}>
                                            {report.infra_type_name || 'Infrastructure'}
                                        </Typography>
                                        <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, lineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {report.category_name}
                                        </Typography>

                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
                                            <LocationIcon sx={{ fontSize: 18, color: 'text.disabled', mt: 0.3 }} />
                                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                                {report.address || 'Location Coordinates Record'}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <TimeIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                                            <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 600 }}>
                                                {format(new Date(report.created_at), 'MMMM dd, yyyy')}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                    <Box sx={{ p: 4, pt: 0, borderTop: '1px solid #f8fafc', mt: 'auto' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.disabled' }}>
                                                VERIFICATIONS: {report.confirmation_count || 0}
                                            </Typography>
                                            <Button size="small" sx={{ fontWeight: 800 }}>Manage Details</Button>
                                        </Box>
                                    </Box>
                                </Card>
                            </Zoom>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default MyReports;
