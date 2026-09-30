import { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, CircularProgress, Grid, Card, CardContent, Chip } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import client from '../../api/client';
import { format } from 'date-fns';
import 'leaflet/dist/leaflet.css';

const NearbyReports = () => {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await client.get('/reports/reports/');
                const data = res.data.results ? res.data.results : res.data;
                setReports(data || []);
            } catch (err) {
                console.error('Error fetching reports', err);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    if (loading) return <CircularProgress sx={{ display: 'block', m: 'auto', mt: 4 }} />;

    return (
        <Container maxWidth="xl" className="page-transition" sx={{ py: 4 }}>
            <Box sx={{ mb: 6 }}>
                <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary', mb: 1 }}>
                    Citizen Intelligence Map
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Real-time visualization of infrastructure anomalies reported by your community.
                </Typography>
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12} lg={8}>
                    <Paper
                        className="glass-panel"
                        sx={{
                            height: '75vh',
                            overflow: 'hidden',
                            borderRadius: 6,
                            border: 'none',
                            boxShadow: '0 20px 50px -10px rgba(0,0,0,0.1)'
                        }}
                    >
                        <MapContainer
                            center={[-3.6, 39.8]}
                            zoom={9}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            {reports.map((report: any) => {
                                const coords = report.location ? report.location.split(',').map(Number) : [-1.286389, 36.817223];
                                if (coords.length !== 2 || isNaN(coords[0]) || isNaN(coords[1])) return null;
                                return (
                                    <Marker
                                        key={report.id}
                                        position={[coords[0], coords[1]]}
                                    >
                                        <Popup>
                                            <Box sx={{ p: 1 }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 0.5 }}>
                                                    {report.category_name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                                                    {report.address}
                                                </Typography>
                                                <Chip
                                                    label={report.status.toUpperCase()}
                                                    size="small"
                                                    color="primary"
                                                    sx={{ fontWeight: 700, borderRadius: 1.5 }}
                                                />
                                            </Box>
                                        </Popup>
                                    </Marker>
                                );
                            })}
                        </MapContainer>
                    </Paper>
                </Grid>
                <Grid item xs={12} lg={4}>
                    <Box sx={{ height: '75vh', overflowY: 'auto', pr: 1, '&::-webkit-scrollbar': { width: '4px' } }}>
                        {reports.map((report: any) => (
                            <Card
                                key={report.id}
                                className="premium-card"
                                sx={{
                                    mb: 2,
                                    borderRadius: 4,
                                    position: 'relative',
                                    border: 'none',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        left: 0,
                                        top: 0,
                                        bottom: 0,
                                        width: 5,
                                        bgcolor: report.status === 'resolved' ? 'success.main' : 'primary.main',
                                        borderRadius: '4px 0 0 4px'
                                    }
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                                        {report.category_name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        📍 {report.address || 'Location Hidden'}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Chip
                                            label={report.status}
                                            size="small"
                                            variant="outlined"
                                            sx={{ fontWeight: 700, borderRadius: 1.5 }}
                                        />
                                        <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.disabled' }}>
                                            {format(new Date(report.created_at), 'MMM dd, yyyy')}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                        {reports.length === 0 && (
                            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 4, bgcolor: 'rgba(0,0,0,0.02)', border: '1px dashed #e2e8f0' }}>
                                <Typography variant="body1" color="text.secondary">No anomalies detected in this sector.</Typography>
                            </Paper>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default NearbyReports;
