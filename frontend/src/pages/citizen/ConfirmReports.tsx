import { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, Button, Box, CircularProgress, Chip, Alert, Paper } from '@mui/material';
import { ThumbUpAlt as ConfirmIcon } from '@mui/icons-material';
import client from '../../api/client';

const ConfirmReports = () => {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const res = await client.get('/reports/reports/');
            // Handle pagination: results or the list direct
            const data = res.data.results ? res.data.results : res.data;
            // Filter out user's own reports maybe? Or just show all.
            setReports(data || []);
        } catch (err) {
            console.error('Error fetching reports', err);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async (reportId: number) => {
        try {
            await client.post(`/trust/confirm/${reportId}/`);
            setMessage({ type: 'success', text: 'Thank you for confirming this report!' });
            fetchReports(); // Refresh to update count
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.detail || 'Failed to confirm report.' });
        }
        setTimeout(() => setMessage(null), 5000);
    };

    if (loading) return <CircularProgress sx={{ display: 'block', m: 'auto', mt: 4 }} />;

    return (
        <Container maxWidth="xl" className="page-transition" sx={{ py: 4 }}>
            <Box sx={{ mb: 6 }}>
                <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary', mb: 1 }}>
                    Community Validation
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Review and confirm infrastructure anomalies reported by fellow citizens to accelerate authority response.
                </Typography>
            </Box>

            {message && (
                <Alert
                    severity={message.type}
                    sx={{ mb: 4, borderRadius: 3, fontWeight: 700 }}
                    onClose={() => setMessage(null)}
                >
                    {message.text}
                </Alert>
            )}

            <Grid container spacing={3}>
                {reports.map((report: any) => (
                    <Grid item xs={12} sm={6} md={4} key={report.id}>
                        <Card
                            className="premium-card"
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: 5,
                                border: 'none',
                                position: 'relative',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    bottom: 0,
                                    width: 5,
                                    bgcolor: 'primary.main',
                                    borderRadius: '5px 0 0 5px'
                                }
                            }}
                        >
                            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
                                    <Chip
                                        label={report.infra_type_name}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                        sx={{ fontWeight: 800, borderRadius: 1.5 }}
                                    />
                                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        🔥 {report.confirmation_count} Votes
                                    </Typography>
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                                    {report.category_name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    📍 {report.address || 'Location Hidden'}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                                    {report.description.length > 120
                                        ? `${report.description.substring(0, 120)}...`
                                        : report.description}
                                </Typography>
                            </CardContent>
                            <Box sx={{ p: 3, pt: 0 }}>
                                <Button
                                    fullWidth
                                    variant={report.is_confirmed_by_user ? "outlined" : "contained"}
                                    color={report.is_confirmed_by_user ? "success" : "primary"}
                                    startIcon={<ConfirmIcon />}
                                    onClick={() => handleConfirm(report.id)}
                                    disabled={report.is_confirmed_by_user}
                                    sx={{
                                        py: 1.5,
                                        borderRadius: 3,
                                        boxShadow: report.is_confirmed_by_user ? 'none' : '0 8px 24px rgba(99, 102, 241, 0.2)'
                                    }}
                                >
                                    {report.is_confirmed_by_user ? "Confirmed" : "Confirm Sighting"}
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                ))}
                {reports.length === 0 && (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 8, bgcolor: 'rgba(0,0,0,0.01)', border: '2px dashed #e2e8f0' }}>
                            <Typography variant="h5" color="text.secondary">All reports are currently validated.</Typography>
                        </Paper>
                    </Grid>
                )}
            </Grid>
        </Container>
    );
};

export default ConfirmReports;
