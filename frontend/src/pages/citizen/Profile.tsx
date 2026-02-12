import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, Box, Grid, Avatar, TextField, Button, Alert, Divider, CircularProgress } from '@mui/material';
import { useAuthStore } from '../../store/useAuthStore';
import client from '../../api/client';
import { Person as PersonIcon, Email as EmailIcon, Phone as PhoneIcon, Security as SecurityIcon } from '@mui/icons-material';

const Profile = () => {
    const { user, updateUser } = useAuthStore();
    const [formData, setFormData] = useState({
        email: '',
        phone_number: '',
        bio: ''
    });
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await client.get('/accounts/me/');
                setFormData({
                    email: res.data.email || '',
                    phone_number: res.data.phone_number || '',
                    bio: res.data.bio || ''
                });
                updateUser(res.data);
            } catch (err) {
                console.error('Failed to fetch profile', err);
            }
        };
        fetchProfile();
    }, [updateUser]);

    const handleSave = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await client.patch('/accounts/me/', formData);
            updateUser(res.data);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" className="page-transition" sx={{ py: 6 }}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Avatar
                    sx={{
                        width: 100,
                        height: 100,
                        bgcolor: 'primary.main',
                        fontSize: '3rem',
                        fontWeight: 800,
                        m: 'auto',
                        mb: 2,
                        boxShadow: '0 8px 16px rgba(30, 64, 175, 0.2)'
                    }}
                >
                    {user?.username?.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>{user?.username}</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                    {user?.role} Account
                </Typography>
            </Box>

            {saved && <Alert severity="success" sx={{ mb: 4, borderRadius: 3 }}>Profile updated successfully!</Alert>}
            {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>{error}</Alert>}

            <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                    <Paper className="glass-panel" sx={{ p: 4, borderRadius: 5 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SecurityIcon color="primary" /> Security
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                            Your account is secured with standard JWT authentication.
                        </Typography>
                        <Button variant="outlined" fullWidth color="primary" sx={{ borderRadius: 3 }}>
                            Change Password
                        </Button>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Paper className="glass-panel" sx={{ p: 4, borderRadius: 5 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 4 }}>Account Information</Typography>

                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Username"
                                    value={user?.username || ''}
                                    InputProps={{ readOnly: true }}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    placeholder="+254 7XX XXX XXX"
                                    value={formData.phone_number}
                                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Bio"
                                    placeholder="Tell the community about yourself..."
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Divider sx={{ my: 2 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={handleSave}
                                        disabled={loading}
                                        sx={{ px: 6, borderRadius: 3 }}
                                    >
                                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Profile;
