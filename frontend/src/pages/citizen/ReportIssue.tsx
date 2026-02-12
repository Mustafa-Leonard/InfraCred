import { useState, useEffect } from 'react';
import { Container, Typography, TextField, MenuItem, Button, Box, Paper, Grid, CircularProgress, Alert } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import * as z from 'zod';
import client from '../../api/client';
import LocationPicker from '../../components/maps/LocationPicker';

const reportSchema = z.object({
    infra_type: z.number().min(1, 'Infrastructure type is required'),
    category: z.number().min(1, 'Category is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    address: z.string().min(5, 'Address is required'),
});

type ReportFormValues = z.infer<typeof reportSchema>;

const ReportIssue = () => {
    const navigate = useNavigate();
    const [infraTypes, setInfraTypes] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [fetchingCategories, setFetchingCategories] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const { control, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm<ReportFormValues>({
        resolver: zodResolver(reportSchema),
        defaultValues: {
            infra_type: 0,
            category: 0,
            description: '',
            address: '',
        },
    });

    const selectedInfraType = watch('infra_type');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const typesRes = await client.get('/reports/types/');
                setInfraTypes(typesRes.data);

                // Load ALL categories on mount
                const allCategoriesRes = await client.get('/reports/categories/');
                setCategories(allCategoriesRes.data);
            } catch (err) {
                console.error('Error fetching types or categories', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Optional: Filter categories when infrastructure type is selected
    useEffect(() => {
        const filterCategories = async () => {
            if (selectedInfraType && selectedInfraType !== 0) {
                setFetchingCategories(true);
                try {
                    const typeId = Number(selectedInfraType);
                    const catRes = await client.get(`/reports/categories/?infra_type=${typeId}`);
                    setCategories(catRes.data);
                } catch (err) {
                    console.error('Error filtering categories:', err);
                } finally {
                    setFetchingCategories(false);
                }
            } else {
                // If no infrastructure type selected, show all categories
                setFetchingCategories(true);
                try {
                    const allCategoriesRes = await client.get('/reports/categories/');
                    setCategories(allCategoriesRes.data);
                } catch (err) {
                    console.error('Error fetching all categories:', err);
                } finally {
                    setFetchingCategories(false);
                }
            }
        };
        filterCategories();
    }, [selectedInfraType]);

    const onSubmit = async (data: ReportFormValues) => {
        if (!location) {
            alert('Please select a location on the map');
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                ...data,
                location: `${location.lat},${location.lng}`,
            };
            await client.post('/reports/reports/', payload);
            setShowSuccess(true);
            reset();
            setLocation(null);
        } catch (err) {
            console.error('Submission failed', err);
            alert('Failed to submit report. Please check your connection.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <CircularProgress sx={{ display: 'block', m: 'auto', mt: 4 }} />;

    if (showSuccess) {
        return (
            <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
                <Paper className="glass-panel" sx={{ p: 6, borderRadius: 8 }}>
                    <Box sx={{
                        width: 80,
                        height: 80,
                        bgcolor: 'success.main',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: 40,
                        m: 'auto',
                        mb: 4,
                        boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4)'
                    }}>
                        ✓
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>Case Lodged Successfully</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        Your report has been transmitted to the central processing unit. You can track its progress in your dashboard.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                        <Button variant="contained" onClick={() => setShowSuccess(false)}>File Another</Button>
                        <Button variant="outlined" onClick={() => navigate('/my-reports')}>View Workspace</Button>
                    </Box>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" className="page-transition" sx={{ py: { xs: 2, md: 4 } }}>
            <Box sx={{ mb: { xs: 4, md: 6 }, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Box>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary', mb: 1, fontSize: { xs: '2rem', md: '3rem' } }}>
                        Submit Evidence
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Document infrastructure anomalies with precision location and detailed context.
                    </Typography>
                </Box>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className="glass-panel" sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 5 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{ width: 32, height: 32, bgcolor: 'primary.main', borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1rem', fontWeight: 800 }}>1</Box>
                            Classification
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="infra_type"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            select
                                            fullWidth
                                            label="Infrastructure Type"
                                            error={!!errors.infra_type}
                                            helperText={errors.infra_type?.message}
                                        >
                                            <MenuItem value={0} disabled>Select Infrastructure Type</MenuItem>
                                            {Array.isArray(infraTypes) && infraTypes.map((type) => (
                                                <MenuItem key={type.id} value={type.id}>
                                                    {type.name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="category"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            select
                                            fullWidth
                                            label={fetchingCategories ? "Loading categories..." : "Problem Category"}
                                            error={!!errors.category}
                                            helperText={errors.category?.message || (selectedInfraType && selectedInfraType !== 0 ? 'Filtered by infrastructure type' : 'Showing all categories')}
                                        >
                                            <MenuItem value={0} disabled>Select Problem Category</MenuItem>
                                            {Array.isArray(categories) && categories.map((cat) => (
                                                <MenuItem key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                <Grid item xs={12} lg={6}>
                    <Paper
                        className="glass-panel"
                        sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 5, height: '100%' }}
                    >
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{ width: 32, height: 32, bgcolor: 'primary.main', borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1rem', fontWeight: 800 }}>2</Box>
                            Pin Location
                        </Typography>
                        <Box sx={{ height: { xs: 300, md: 400 }, borderRadius: 4, overflow: 'hidden', border: '1px solid #e2e8f0', mb: 2 }}>
                            <LocationPicker onLocationSelect={(lat, lng) => setLocation({ lat, lng })} />
                        </Box>
                        {location && (
                            <Alert severity="success" sx={{ borderRadius: 2 }}>
                                Coordinates Verified: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                            </Alert>
                        )}
                    </Paper>
                </Grid>

                <Grid item xs={12} lg={6}>
                    <Paper className="glass-panel" sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 5, height: '100%' }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{ width: 32, height: 32, bgcolor: 'primary.main', borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1rem', fontWeight: 800 }}>3</Box>
                            Final Details
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                            <Controller
                                name="address"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Human-readable Address"
                                        placeholder="e.g. Near the main gate of Central Park"
                                        error={!!errors.address}
                                        helperText={errors.address?.message}
                                        sx={{ mb: 3 }}
                                    />
                                )}
                            />
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        multiline
                                        rows={8}
                                        label="Observations"
                                        placeholder="Specific details about the severity, longevity, or cause of the issue..."
                                        error={!!errors.description}
                                        helperText={errors.description?.message}
                                    />
                                )}
                            />
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Box sx={{ mt: { xs: 2, md: 4 }, pb: 4, textAlign: 'center' }}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleSubmit(onSubmit)}
                            disabled={submitting}
                            sx={{
                                px: { xs: 6, md: 10 },
                                py: 2.5,
                                fontSize: { xs: '1.1rem', md: '1.4rem' },
                                borderRadius: 4,
                                boxShadow: '0 12px 40px rgba(99, 102, 241, 0.4)',
                                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 15px 45px rgba(99, 102, 241, 0.5)'
                                }
                            }}
                        >
                            {submitting ? 'Transmitting...' : 'Lodge Official Report'}
                        </Button>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                            This will create a permanent record in the jurisdiction's investigation queue.
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ReportIssue;
