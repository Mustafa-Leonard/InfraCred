import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container, Typography, Paper, Grid, Box, Chip, Button,
    Divider, CircularProgress, Alert
} from '@mui/material';
import {
    ArrowBack,
    LocationOn as LocationIcon,
    History as HistoryIcon,
    CalendarToday as DateIcon,
    Description as DescIcon
} from '@mui/icons-material';
import client from '../../api/client';
import { format } from 'date-fns';

const ReportDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState<any>(null);
    const [caseData, setCaseData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchDetail = async () => {
        try {
            const res = await client.get(`/reports/reports/${id}/`);
            setReport(res.data);

            // If there's a cluster/case, get information about the investigation
            if (res.data.cluster) {
                try {
                    const clusterRes = await client.get(`/clustering/clusters/${res.data.cluster}/`);
                    if (clusterRes.data.case) {
                        const caseRes = await client.get(`/cases/cases/${clusterRes.data.case.id}/`);
                        setCaseData(caseRes.data);
                    }
                } catch (e) {
                    console.log("No active investigation case found for this cluster yet.");
                }
            }
        } catch (err) {
            console.error('Error fetching report detail', err);
            setError('Failed to load report details.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetail();
        const interval = setInterval(fetchDetail, 20000); // Poll every 20 seconds
        return () => clearInterval(interval);
    }, [id]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'warning';
            case 'investigating': return 'info';
            case 'in_progress': return 'info';
            case 'resolved': return 'success';
            case 'rejected': return 'error';
            default: return 'default';
        }
    };

    if (loading) return <CircularProgress sx={{ display: 'block', m: 'auto', mt: 4 }} />;
    if (error || !report) return <Alert severity="error">{error || 'Report not found'}</Alert>;

    return (
        <Container maxWidth="lg" className="page-transition" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/my-reports')}
                    variant="text"
                    sx={{ color: 'text.secondary', fontWeight: 700 }}
                >
                    Back to Workspace
                </Button>
            </Box>

            <Grid container spacing={4}>
                {/* Left Side: Report Info */}
                <Grid item xs={12} lg={7}>
                    <Paper className="glass-panel" sx={{ p: { xs: 3, md: 5 }, borderRadius: 6, border: 'none' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                            <Box>
                                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    Case File ID: {report.id}
                                </Typography>
                                <Typography variant="h3" sx={{ fontWeight: 800, mt: 1, mb: 0.5 }}>
                                    {report.category_name}
                                </Typography>
                                <Typography variant="h6" color="primary" sx={{ fontWeight: 600, opacity: 0.8 }}>
                                    {report.infra_type_name}
                                </Typography>
                            </Box>
                            <Chip
                                label={report.status.toUpperCase()}
                                color={getStatusColor(report.status) as any}
                                sx={{ fontWeight: 800, px: 1, height: 32, borderRadius: 2 }}
                            />
                        </Box>

                        <Divider sx={{ mb: 4, opacity: 0.5 }} />

                        <Grid container spacing={3} sx={{ mb: 5 }}>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Box sx={{ width: 44, height: 44, bgcolor: 'rgba(99, 102, 241, 0.1)', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'primary.main' }}>
                                        <DateIcon />
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Submission Date</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{format(new Date(report.created_at), 'MMM dd, yyyy')}</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Box sx={{ width: 44, height: 44, bgcolor: 'rgba(99, 102, 241, 0.1)', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'primary.main' }}>
                                        <LocationIcon />
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Target Location</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{report.address}</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>

                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <DescIcon color="primary" /> Observation Notes
                        </Typography>
                        <Box sx={{ p: 3, bgcolor: 'rgba(248, 250, 252, 0.8)', borderRadius: 3, border: '1px solid #e2e8f0' }}>
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', color: 'text.primary', lineHeight: 1.7 }}>
                                {report.description}
                            </Typography>
                        </Box>

                        {report.image && (
                            <Box sx={{ mt: 5 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Visual Evidence</Typography>
                                <Box
                                    component="img"
                                    src={report.image}
                                    sx={{
                                        width: '100%',
                                        maxWidth: 600,
                                        borderRadius: 4,
                                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                                    }}
                                />
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* Right Side: Authority Progress & Timeline */}
                <Grid item xs={12} lg={5}>
                    <Paper
                        className="glass-panel"
                        sx={{
                            p: 4,
                            mb: 4,
                            bgcolor: 'primary.main',
                            color: 'white',
                            borderRadius: 6,
                            position: 'relative',
                            overflow: 'hidden',
                            border: 'none',
                            boxShadow: '0 10px 30px -5px rgba(99, 102, 241, 0.4)'
                        }}
                    >
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h5" sx={{ fontWeight: 800 }}>Authority Action</Typography>
                                {caseData && (
                                    <Chip
                                        label={caseData.status.replace('_', ' ').toUpperCase()}
                                        sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 800, border: '1px solid rgba(255,255,255,0.3)' }}
                                    />
                                )}
                            </Box>
                            <Typography variant="body1" sx={{ opacity: 0.9, lineHeight: 1.8, fontSize: '1.1rem', mb: 0 }}>
                                {caseData ? (
                                    <>
                                        Case <strong>#{caseData.id}</strong> is under investigation by <strong>{caseData.authority_name || 'Assigned Authority'}</strong>.
                                        Official status: <i>{caseData.status.replace('_', ' ')}</i>.
                                    </>
                                ) : (
                                    "Your report is in the validation queue. Our system is currently aggregating similar citizen insights to trigger an official authority investigation."
                                )}
                            </Typography>
                        </Box>
                        {/* Decorative Circle */}
                        <Box sx={{ position: 'absolute', bottom: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                    </Paper>

                    <Paper className="glass-panel" sx={{ p: 4, borderRadius: 6, border: 'none' }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <HistoryIcon color="primary" /> Case Timeline
                        </Typography>

                        {caseData?.updates?.length > 0 ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                {caseData.updates.map((update: any, idx: number) => (
                                    <Box key={update.id} sx={{ position: 'relative', pl: 4 }}>
                                        {/* Connector Line */}
                                        {idx !== caseData.updates.length - 1 && (
                                            <Box sx={{ position: 'absolute', left: 7, top: 24, bottom: -24, width: 2, bgcolor: '#e2e8f0' }} />
                                        )}
                                        {/* Point */}
                                        <Box sx={{ position: 'absolute', left: 0, top: 6, width: 16, height: 16, borderRadius: '50%', border: '3px solid #6366f1', bgcolor: 'white' }} />

                                        <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                                            {format(new Date(update.created_at), 'MMMM dd, HH:mm')}
                                        </Typography>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
                                            {update.action}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: update.comments ? 'normal' : 'italic' }}>
                                            {update.comments || 'No comment provided by investigator.'}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        ) : (
                            <Box sx={{ py: 6, textAlign: 'center' }}>
                                <HistoryIcon sx={{ fontSize: 48, color: 'text.disabled', opacity: 0.3, mb: 2 }} />
                                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 250, m: 'auto' }}>
                                    Official investigation timeline will appear here once field teams are dispatched.
                                </Typography>
                            </Box>
                        )}
                    </Paper>

                    {/* QUICK ACTION FOOTER FOR FINDABILITY */}
                    <Box sx={{ mt: 4, p: 4, borderRadius: 6, border: '2px dashed #e2e8f0', textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Have another concern?</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Your reports help us map urban infrastructure needs more accurately.
                        </Typography>
                        <Button
                            variant="outlined"
                            color="primary"
                            size="large"
                            onClick={() => navigate('/report')}
                            fullWidth
                            sx={{ py: 1.5, borderRadius: 3, fontWeight: 800, borderWidth: 2, '&:hover': { borderWidth: 2 } }}
                        >
                            File Another Report
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ReportDetail;
