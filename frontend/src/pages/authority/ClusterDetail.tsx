import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container, Typography, Paper, Grid, Box, Chip, Button, Divider,
    Card, CardContent, CircularProgress, TextField, MenuItem,
    Table, TableBody, TableCell, TableHead, TableRow, IconButton,
    Alert, Tab, Tabs, TableContainer
} from '@mui/material';
import {
    ArrowBack, History, Security,
    Timeline, Gavel, Group, Info, Map as MapIcon,
    FileUpload as FileUploadIcon
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import client from '../../api/client';
import 'leaflet/dist/leaflet.css';

const ClusterDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cluster, setCluster] = useState<any>(null);
    const [caseData, setCaseData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState(0);
    const [error, setError] = useState('');

    // Form states
    const [assignedTeam, setAssignedTeam] = useState('');
    const [caseStatus, setCaseStatus] = useState('open');
    const [feedbackNotes, setFeedbackNotes] = useState('');
    const [internalNote, setInternalNote] = useState('');
    const [attachment, setAttachment] = useState<File | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await client.get(`/clustering/clusters/${id}/`);
            setCluster(res.data);
            if (res.data.case) {
                // Fetch full case data including updates and assignments
                const caseRes = await client.get(`/cases/cases/${res.data.case.id}/`);
                setCaseData(caseRes.data);
                setCaseStatus(caseRes.data.status);
            }
        } catch (err) {
            console.error('Error fetching cluster detail', err);
            setError('Failed to load cluster details.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleOpenCase = async () => {
        try {
            const res = await client.post('/cases/cases/', {
                cluster: cluster.id,
                status: 'open',
                routing_reason: `Auto-routed for ${cluster.category_name} in your jurisdiction.`
            });
            await client.post('/cases/updates/', {
                case: res.data.id,
                action: 'Case Opened',
                comments: 'Authority acknowledged receipt and opened the case.'
            });
            fetchData();
        } catch (err) {
            alert('Failed to open case');
        }
    };

    const handleUpdateCase = async () => {
        try {
            await client.patch(`/cases/cases/${caseData.id}/`, { status: caseStatus });

            if (feedbackNotes || attachment) {
                const formData = new FormData();
                formData.append('case', caseData.id.toString());
                formData.append('action', `Status Update: ${caseStatus}`);
                formData.append('comments', feedbackNotes);
                if (attachment) {
                    formData.append('attachment', attachment);
                }

                await client.post('/cases/updates/', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                setFeedbackNotes('');
                setAttachment(null);
            }

            alert('Case updated successfully');
            fetchData();
        } catch (err) {
            console.error(err);
            alert('Failed to update case');
        }
    };

    const handleDispatch = async () => {
        if (!caseData) return;
        try {
            await client.post('/assignments/assignments/', {
                case: caseData.id,
                assigned_to_name: assignedTeam,
                status: 'dispatched'
            });
            // Create audit update
            await client.post('/cases/updates/', {
                case: caseData.id,
                action: 'Team Dispatched',
                comments: `Dispatching "${assignedTeam}" to site for investigation.`
            });
            // Update case status to assigned
            await client.patch(`/cases/cases/${caseData.id}/`, { status: 'assigned' });
            alert(`Team "${assignedTeam}" has been dispatched!`);
            setAssignedTeam('');
            fetchData();
        } catch (err) {
            alert('Failed to dispatch team');
        }
    };

    const handleSendNote = async () => {
        if (!internalNote.trim() || !caseData) return;
        try {
            await client.post('/cases/updates/', {
                case: caseData.id,
                action: 'Internal Note',
                comments: internalNote
            });
            setInternalNote('');
            fetchData();
        } catch (err) {
            alert('Failed to send note');
        }
    };

    if (loading) return <CircularProgress sx={{ display: 'block', m: 'auto', mt: 4 }} />;
    if (error || !cluster) return <Alert severity="error">{error || 'Cluster not found'}</Alert>;

    const [lat, lng] = cluster.center.split(',').map(Number);

    return (
        <Container maxWidth="xl">
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton onClick={() => navigate(-1)}><ArrowBack /></IconButton>
                <Typography variant="h4" fontWeight="bold">Case #{cluster.id}: {cluster.category_name}</Typography>
                <Chip
                    label={cluster.is_active ? 'ACTIVE' : 'RESOLVED'}
                    color={cluster.is_active ? 'warning' : 'success'}
                />
            </Box>

            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
                <Tab label="Overview" icon={<Info />} iconPosition="start" />
                <Tab label="Lifecycle & Field Team" icon={<Timeline />} iconPosition="start" />
                <Tab label="SLA & Performance" icon={<History />} iconPosition="start" />
                <Tab label="Compliance & Audit" icon={<Gavel />} iconPosition="start" />
            </Tabs>

            <Grid container spacing={3}>
                {tab === 0 && (
                    <>
                        <Grid item xs={12} md={8}>
                            <Paper sx={{ p: 3, mb: 3 }}>
                                <Typography variant="h6" gutterBottom>Full Description & Evidence</Typography>
                                <Typography variant="body1" color="text.secondary" paragraph>
                                    This cluster contains {cluster.report_count} citizen reports regarding <strong>{cluster.category_name}</strong> issues.
                                </Typography>

                                <Divider sx={{ my: 2 }} />

                                {cluster.reports?.map((report: any) => (
                                    <Box key={report.id} sx={{ mb: 4, pb: 2, borderBottom: '1px solid #eee' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="subtitle2" color="primary">Report #{report.id}</Typography>
                                            <Typography variant="caption" color="textSecondary">{new Date(report.created_at).toLocaleString()}</Typography>
                                        </Box>
                                        <Typography variant="body1" sx={{ mb: 1 }}>{report.description}</Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                                            📍 {report.address || 'Address not provided'}
                                        </Typography>
                                        {report.image && (
                                            <Box
                                                component="img"
                                                src={report.image}
                                                alt="Evidence"
                                                sx={{ width: '100%', maxWidth: 400, borderRadius: 2, mt: 1, boxShadow: 1 }}
                                            />
                                        )}
                                    </Box>
                                ))}

                                <Alert severity="info" sx={{ mt: 2 }}>
                                    Reporter Anonymity: <strong>PROTECTED</strong> (No personal identifiers shown)
                                </Alert>
                            </Paper>

                            <Paper sx={{ height: 400, borderRadius: 2, overflow: 'hidden', mb: 3 }}>
                                <MapContainer center={[lat, lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <Circle center={[lat, lng]} radius={cluster.radius || 100} />
                                    <Marker position={[lat, lng]}>
                                        <Popup>Problem Center</Popup>
                                    </Marker>
                                </MapContainer>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Card sx={{ mb: 3 }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>Intelligence & Routing</Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="subtitle2">Classification Confidence</Typography>
                                        <Typography variant="h4" color="primary">92%</Typography>
                                    </Box>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="subtitle2">Routing Reason</Typography>
                                    <Typography variant="body2">
                                        Matched based on infrastructure type (Roads) and geographic jurisdiction (Nairobi County).
                                    </Typography>
                                </CardContent>
                            </Card>

                            <Card sx={{ mb: 3, borderLeft: '4px solid #3f51b5' }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <MapIcon color="primary" /> Jurisdiction Scope
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        You are viewing this because it falls under your assigned ward:
                                    </Typography>
                                    <Typography variant="h6" sx={{ mt: 1 }}>Central Ward, Nairobi</Typography>
                                </CardContent>
                            </Card>

                            <Paper sx={{ p: 2, mb: 3 }}>
                                <Typography variant="h6" gutterBottom>Digital Acknowledgement</Typography>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    startIcon={<Security />}
                                    disabled={!!caseData}
                                    onClick={handleOpenCase}
                                >
                                    {caseData ? 'Case Acknowledged' : 'Sign & Open Official Case'}
                                </Button>
                                <Typography variant="caption" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
                                    {caseData ? `Acknowledge record ID: ACK-${caseData.id}` : 'This record is immutable and stored in the audit trail.'}
                                </Typography>
                            </Paper>

                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom>Communication Thread</Typography>
                                <Box sx={{ height: 200, overflowY: 'auto', bgcolor: 'grey.50', p: 2, borderRadius: 1, mb: 2 }}>
                                    {caseData?.updates?.map((update: any) => (
                                        <Box key={update.id} sx={{ mb: 1.5, pb: 1, borderBottom: '1px solid #e0e0e0' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                                <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold' }}>
                                                    {update.username || 'System'}
                                                </Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    {new Date(update.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2">{update.comments}</Typography>
                                        </Box>
                                    ))}
                                    {!caseData?.updates?.length && (
                                        <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 2 }}>
                                            No activity logs yet.
                                        </Typography>
                                    )}
                                </Box>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Add internal note..."
                                    sx={{ mb: 1 }}
                                    value={internalNote}
                                    onChange={(e) => setInternalNote(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendNote()}
                                />
                                <Button
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    onClick={handleSendNote}
                                    disabled={!caseData || !internalNote.trim()}
                                >
                                    Send Note
                                </Button>
                            </Paper>
                        </Grid>
                    </>
                )}

                {tab === 1 && (
                    <Grid item xs={12}>
                        {!caseData ? (
                            <Alert severity="warning">
                                You must <strong>Acknowledge & Open Case</strong> in the Overview tab before dispatching teams.
                            </Alert>
                        ) : (
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>Case Lifecycle & Assignment</Typography>
                                <Grid container spacing={4}>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle1" gutterBottom>Current Status & Resolution</Typography>
                                        <TextField
                                            select
                                            fullWidth
                                            label="Update Status"
                                            value={caseStatus}
                                            onChange={(e) => setCaseStatus(e.target.value)}
                                            sx={{ mb: 2 }}
                                        >
                                            <MenuItem value="open">Open</MenuItem>
                                            <MenuItem value="assigned">Assigned</MenuItem>
                                            <MenuItem value="in_progress">In Progress</MenuItem>
                                            <MenuItem value="resolved">Resolved</MenuItem>
                                        </TextField>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={4}
                                            label="Authority Feedback"
                                            placeholder="Upload resolution report or add notes..."
                                            value={feedbackNotes}
                                            onChange={(e) => setFeedbackNotes(e.target.value)}
                                            sx={{ mb: 2 }}
                                        />
                                        <Button
                                            variant="outlined"
                                            component="label"
                                            fullWidth
                                            startIcon={<FileUploadIcon />}
                                            sx={{ mb: 2 }}
                                        >
                                            Upload Resolution/Evidence
                                            <input
                                                type="file"
                                                hidden
                                                onChange={(e) => setAttachment(e.target.files ? e.target.files[0] : null)}
                                            />
                                        </Button>
                                        {attachment && (
                                            <Typography variant="caption" display="block" sx={{ mb: 2 }}>
                                                Selected: {attachment.name}
                                            </Typography>
                                        )}
                                        <Button variant="contained" fullWidth onClick={handleUpdateCase}>Update Case & Audit Trail</Button>

                                        <Box sx={{ mt: 4 }}>
                                            <Typography variant="subtitle2" gutterBottom>Previous Updates</Typography>
                                            {caseData.updates?.map((update: any) => (
                                                <Paper key={update.id} variant="outlined" sx={{ p: 1.5, mb: 1, bgcolor: 'grey.50' }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <Typography variant="caption" fontWeight="bold">{update.action}</Typography>
                                                        <Typography variant="caption" color="textSecondary">{new Date(update.created_at).toLocaleDateString()}</Typography>
                                                    </Box>
                                                    <Typography variant="body2">{update.comments}</Typography>
                                                </Paper>
                                            ))}
                                        </Box>
                                    </Grid>
                                    <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                                    <Grid item xs={12} md={5}>
                                        <Typography variant="subtitle1" gutterBottom>Field Team Assignment</Typography>
                                        <TextField
                                            fullWidth
                                            label="Assigned Team/Individual"
                                            placeholder="e.g. Rapid Response Team A"
                                            sx={{ mb: 2 }}
                                            value={assignedTeam}
                                            onChange={(e) => setAssignedTeam(e.target.value)}
                                        />
                                        <Button
                                            variant="outlined"
                                            startIcon={<Group />}
                                            fullWidth
                                            onClick={handleDispatch}
                                            disabled={!assignedTeam}
                                        >
                                            Dispatch Team
                                        </Button>

                                        <Box sx={{ mt: 4 }}>
                                            <Typography variant="subtitle2" gutterBottom>Active Assignments</Typography>
                                            {caseData.assignments?.map((asmt: any) => (
                                                <Paper key={asmt.id} variant="outlined" sx={{ p: 1, mb: 1 }}>
                                                    <Typography variant="body2"><strong>{asmt.assigned_to_name}</strong></Typography>
                                                    <Typography variant="caption" display="block">Status: {asmt.status}</Typography>
                                                </Paper>
                                            ))}
                                        </Box>

                                        <Box sx={{ mt: 4 }}>
                                            <Typography variant="subtitle2" color="error">Escalation / Re-routing</Typography>
                                            <Button color="error" fullWidth sx={{ mt: 1 }}>Request Re-routing</Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Paper>
                        )}
                    </Grid>
                )}

                {tab === 2 && (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>SLA & Performance Tracking</Typography>
                            {caseData ? (
                                <Alert severity="success" sx={{ mb: 3 }}>
                                    Target Resolution Time: 48 Hours | Current Status: <strong>Within SLA</strong>
                                </Alert>
                            ) : (
                                <Alert severity="info">Acknowledge the case to start SLA tracking.</Alert>
                            )}
                        </Paper>
                    </Grid>
                )}

                {tab === 3 && (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 0, overflow: 'hidden' }}>
                            <TableContainer>
                                <Table>
                                    <TableHead sx={{ bgcolor: 'grey.100' }}>
                                        <TableRow>
                                            <TableCell>Timestamp</TableCell>
                                            <TableCell>Action</TableCell>
                                            <TableCell>User</TableCell>
                                            <TableCell>Details</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {caseData?.updates?.map((update: any) => (
                                            <TableRow key={update.id}>
                                                <TableCell>{new Date(update.created_at).toLocaleString()}</TableCell>
                                                <TableCell><Chip label={update.action} size="small" /></TableCell>
                                                <TableCell>{update.user || 'System'}</TableCell>
                                                <TableCell>{update.comments}</TableCell>
                                            </TableRow>
                                        ))}
                                        {!caseData?.updates?.length && (
                                            <TableRow>
                                                <TableCell colSpan={4} align="center">No audit records found.</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>
                )}
            </Grid>
        </Container>
    );
};

export default ClusterDetail;
