import React, { useState } from 'react';
import {
    Box, Paper, Typography, TextField, Button,
    Alert, CircularProgress, Link, InputAdornment, IconButton,
    Container, Grid, Avatar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
    Visibility, VisibilityOff,
    Login as LoginIcon,
    AppRegistration as RegisterIcon,
    LocationCity as CityIcon,
    VolunteerActivism as ImpactIcon
} from '@mui/icons-material';
import client from '../../api/client';
import { useAuthStore } from '../../store/useAuthStore';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
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
            const res = await client.post('/accounts/login/', credentials);
            login(res.data.user, res.data.access, res.data.refresh);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#F8FAFC', overflowY: 'auto' }}>
            <Grid container>
                {/* Left Side: Brand Panel (55%) */}
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
                    <Box sx={{
                        position: 'absolute',
                        bottom: '10%',
                        right: '15%',
                        width: '400px',
                        height: '400px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%)',
                        filter: 'blur(50px)',
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
                                bgcolor: '#6366F1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
                            }}>
                                <CityIcon sx={{ fontSize: 20 }} />
                            </Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, letterSpacing: '0.05em', color: 'rgba(255,255,255,0.8)' }}>
                                SMART CITY INITIATIVE
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
                            InfraCred
                        </Typography>

                        <Typography variant="h5" sx={{
                            fontWeight: 400,
                            color: 'rgba(255,255,255,0.7)',
                            lineHeight: 1.8,
                            maxWidth: '480px',
                            mb: 8
                        }}>
                            Report issues, track repairs, and build a better community together through data-driven infrastructure monitoring.
                        </Typography>

                        <Grid container spacing={4}>
                            {[
                                { label: 'Active Reports', value: '2.4k+' },
                                { label: 'Issues Resolved', value: '1.8k+' },
                                { label: 'Communities', value: '120+' }
                            ].map((stat, i) => (
                                <Grid item key={i}>
                                    <Typography variant="h5" sx={{ fontWeight: 800, color: 'white' }}>{stat.value}</Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                        {stat.label}
                                    </Typography>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    {/* Subtle aesthetic pattern replacement */}
                    <Box sx={{
                        position: 'absolute',
                        top: '-20%',
                        right: '-10%',
                        width: '600px',
                        height: '600px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.03) 0%, transparent 70%)',
                    }} />
                </Grid>

                {/* Right Side: Login Panel (45%) */}
                <Grid item xs={12} md={5.4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 2, md: 4 } }}>
                    <Container maxWidth="xs">
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
                                    Sign in to InfraCred
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Access is provided by your organization or administrator.
                                </Typography>
                            </Box>

                            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

                            <form onSubmit={handleSubmit}>
                                <Typography variant="caption" sx={{ fontWeight: 600, color: '#374151', mb: 1, display: 'block' }}>
                                    Username or Email
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder="Enter your username"
                                    variant="outlined"
                                    value={credentials.username}
                                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                                    required
                                    sx={{
                                        mb: 3,
                                        '& .MuiOutlinedInput-root': {
                                            height: '48px',
                                            bgcolor: 'white',
                                            '& fieldset': { borderColor: '#E5E7EB' },
                                            '&:hover fieldset': { borderColor: '#D1D5DB' },
                                            '&.Mui-focused fieldset': { borderColor: '#1E3A8A' },
                                        }
                                    }}
                                />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#374151' }}>
                                        Password
                                    </Typography>
                                    <Link
                                        component="button"
                                        type="button"
                                        onClick={() => navigate('/password-reset')}
                                        sx={{
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            color: '#1E3A8A',
                                            textDecoration: 'none',
                                            '&:hover': { textDecoration: 'underline' }
                                        }}
                                    >
                                        Forgot password?
                                    </Link>
                                </Box>
                                <TextField
                                    fullWidth
                                    type={showPassword ? 'text' : 'password'}
                                    variant="outlined"
                                    placeholder="••••••••"
                                    value={credentials.password}
                                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                    required
                                    sx={{
                                        mb: 4,
                                        '& .MuiOutlinedInput-root': {
                                            height: '48px',
                                            bgcolor: 'white',
                                            '& fieldset': { borderColor: '#E5E7EB' },
                                            '&:hover fieldset': { borderColor: '#D1D5DB' },
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
                                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign in'}
                                </Button>
                            </form>

                            <Box sx={{ mt: 4, textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary">
                                    Don&apos;t have an account?{' '}
                                    <Link
                                        component="button"
                                        onClick={() => navigate('/register')}
                                        sx={{ fontWeight: 700, color: '#1E3A8A', textDecoration: 'none' }}
                                    >
                                        Join the platform
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

export default Login;
