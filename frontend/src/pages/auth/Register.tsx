import React, { useState } from 'react';
import {
    Box, Paper, Typography, TextField, Button,
    Alert, CircularProgress, Link, InputAdornment, IconButton,
    Container, Grid, ToggleButtonGroup, ToggleButton,
    Avatar, List
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
    Visibility, VisibilityOff,
    Person as CitizenIcon,
    Business as AuthorityIcon,
    VolunteerActivism as ImpactIcon
} from '@mui/icons-material';
import client from '../../api/client';
import { useAuthStore } from '../../store/useAuthStore';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        role: 'citizen'
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await client.post('/accounts/register/', formData);
            // Auto login after registration
            const loginRes = await client.post('/accounts/login/', {
                username: formData.username,
                password: formData.password
            });
            login(loginRes.data.user, loginRes.data.access);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.username?.[0] || err.response?.data?.detail || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#F8FAFC', overflowY: 'auto' }}>
            <Grid container>
                {/* Brand Panel (55%) */}
                <Grid item xs={false} md={6.6} sx={{
                    background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                    color: 'white',
                    display: { xs: 'none', md: 'flex' },
                    flexDirection: 'column',
                    justifyContent: 'center',
                    px: 12,
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Floating Aesthetic Elements */}
                    <Box sx={{
                        position: 'absolute',
                        top: '15%',
                        left: '10%',
                        width: '300px',
                        height: '300px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
                        filter: 'blur(40px)',
                    }} />

                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Box sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 1.5,
                            mb: 6,
                            px: 2,
                            py: 1,
                            borderRadius: '12px',
                            bgcolor: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <Box sx={{
                                width: 32,
                                height: 32,
                                borderRadius: '8px',
                                bgcolor: '#10B981',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
                            }}>
                                <ImpactIcon sx={{ fontSize: 20, color: 'white' }} />
                            </Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, letterSpacing: '0.05em', color: 'rgba(255,255,255,0.8)' }}>
                                JOIN THE MISSION
                            </Typography>
                        </Box>

                        <Typography variant="h2" sx={{
                            fontWeight: 900,
                            mb: 3,
                            letterSpacing: '-0.04em',
                            background: 'linear-gradient(to bottom right, #FFFFFF, #94A3B8)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            Shape Your City
                        </Typography>

                        <Typography variant="h5" sx={{
                            fontWeight: 400,
                            color: 'rgba(255,255,255,0.7)',
                            lineHeight: 1.8,
                            maxWidth: '480px',
                            mb: 8
                        }}>
                            Become a verified member of InfraCred. Direct reporting, real-time tracking, and collaborative community development.
                        </Typography>

                        <Grid container spacing={3}>
                            {[
                                "Verified Transparency",
                                "Direct Response Channels",
                                "Community Oversight"
                            ].map((text, i) => (
                                <Grid item xs={12} key={i}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10B981' }} />
                                        <Typography variant="body1" sx={{ fontWeight: 500, color: 'rgba(255,255,255,0.9)' }}>
                                            {text}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    {/* Subtle aesthetic pattern */}
                    <Box sx={{
                        position: 'absolute',
                        bottom: '-10%',
                        left: '-10%',
                        width: '500px',
                        height: '500px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.03) 0%, transparent 70%)',
                    }} />
                </Grid>

                {/* Registration Panel (45%) */}
                <Grid item xs={12} md={5.4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 2, md: 4 } }}>
                    <Container maxWidth="xs" sx={{ p: 0 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: '32px',
                                borderRadius: '16px',
                                bgcolor: 'white',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                                border: '1px solid #E5E7EB'
                            }}
                        >
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#111827' }}>
                                    Create Account
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Join the network of active citizens and authorities.
                                </Typography>
                            </Box>

                            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

                            <form onSubmit={handleSubmit}>
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#374151', mb: 1.5, display: 'block' }}>
                                        REGISTERING AS
                                    </Typography>
                                    <ToggleButtonGroup
                                        color="primary"
                                        value={formData.role}
                                        exclusive
                                        onChange={(_, val) => val && setFormData({ ...formData, role: val })}
                                        fullWidth
                                        sx={{
                                            '& .MuiToggleButton-root': {
                                                py: 1.2,
                                                borderRadius: '8px !important',
                                                border: '1px solid #e2e8f0 !important',
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                mr: 1,
                                                '&.Mui-selected': {
                                                    borderColor: '#1E3A8A !important',
                                                    bgcolor: 'rgba(30, 64, 175, 0.05)',
                                                    color: '#1E3A8A'
                                                }
                                            }
                                        }}
                                    >
                                        <ToggleButton value="citizen">
                                            <CitizenIcon sx={{ mr: 1 }} /> Citizen
                                        </ToggleButton>
                                        <ToggleButton value="authority">
                                            <AuthorityIcon sx={{ mr: 1 }} /> Authority
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                </Box>

                                <Typography variant="caption" sx={{ fontWeight: 600, color: '#374151', mb: 0.5, display: 'block' }}>
                                    Username
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder="Choose a username"
                                    variant="outlined"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                    sx={{
                                        mb: 2,
                                        '& .MuiOutlinedInput-root': {
                                            height: '44px',
                                            '& fieldset': { borderColor: '#E5E7EB' },
                                            '&.Mui-focused fieldset': { borderColor: '#1E3A8A' },
                                        }
                                    }}
                                />

                                <Typography variant="caption" sx={{ fontWeight: 600, color: '#374151', mb: 0.5, display: 'block' }}>
                                    Email Address
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder="your@email.com"
                                    type="email"
                                    variant="outlined"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    sx={{
                                        mb: 2,
                                        '& .MuiOutlinedInput-root': {
                                            height: '44px',
                                            '& fieldset': { borderColor: '#E5E7EB' },
                                            '&.Mui-focused fieldset': { borderColor: '#1E3A8A' },
                                        }
                                    }}
                                />

                                <Typography variant="caption" sx={{ fontWeight: 600, color: '#374151', mb: 0.5, display: 'block' }}>
                                    Password
                                </Typography>
                                <TextField
                                    fullWidth
                                    type={showPassword ? 'text' : 'password'}
                                    variant="outlined"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    sx={{
                                        mb: 4,
                                        '& .MuiOutlinedInput-root': {
                                            height: '44px',
                                            '& fieldset': { borderColor: '#E5E7EB' },
                                            '&.Mui-focused fieldset': { borderColor: '#1E3A8A' },
                                        }
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                                                    {showPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <Button
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                    sx={{
                                        height: '48px',
                                        borderRadius: '8px',
                                        bgcolor: '#1E3A8A',
                                        color: 'white',
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        fontSize: '0.95rem',
                                        '&:hover': {
                                            bgcolor: '#1d4ed8',
                                        }
                                    }}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
                                </Button>
                            </form>

                            <Box sx={{ mt: 4, textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary">
                                    Already have an account?{' '}
                                    <Link
                                        component="button"
                                        onClick={() => navigate('/login')}
                                        sx={{ fontWeight: 700, color: '#1E3A8A', textDecoration: 'none' }}
                                    >
                                        Sign in
                                    </Link>
                                </Typography>
                            </Box>
                        </Paper>
                    </Container>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Register;
