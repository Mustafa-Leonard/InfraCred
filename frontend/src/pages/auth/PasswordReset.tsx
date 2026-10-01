import { FormEvent, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Alert, Box, Button, CircularProgress, Container, Link, Paper, TextField, Typography } from '@mui/material';
import client from '../../api/client';

const PasswordReset = () => {
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const uid = searchParams.get('uid');
    const token = searchParams.get('token');
    const isConfirming = Boolean(uid && token);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setError('');
        setMessage('');

        if (isConfirming && password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const response = isConfirming
                ? await client.post('/accounts/password-reset/confirm/', { uid, token, password })
                : await client.post('/accounts/password-reset/', { email });
            setMessage(response.data.detail);
        } catch (requestError: any) {
            const data = requestError.response?.data;
            setError(data?.detail || data?.email?.[0] || data?.password?.[0] || 'Unable to process your request.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', bgcolor: '#F8FAFC', p: 2 }}>
            <Container maxWidth="xs" sx={{ p: 0 }}>
                <Paper elevation={0} sx={{ p: 4, border: '1px solid #E5E7EB', borderRadius: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#111827' }}>
                        {isConfirming ? 'Choose a new password' : 'Reset your password'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        {isConfirming
                            ? 'Enter a new password for your InfraCred account.'
                            : 'Enter the email address linked to your account. If it exists, we will send a reset link.'}
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

                    <form onSubmit={handleSubmit}>
                        {isConfirming ? (
                            <>
                                <TextField
                                    fullWidth
                                    required
                                    type="password"
                                    label="New password"
                                    autoComplete="new-password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    fullWidth
                                    required
                                    type="password"
                                    label="Confirm new password"
                                    autoComplete="new-password"
                                    value={confirmPassword}
                                    onChange={(event) => setConfirmPassword(event.target.value)}
                                    sx={{ mb: 3 }}
                                />
                            </>
                        ) : (
                            <TextField
                                fullWidth
                                required
                                type="email"
                                label="Email address"
                                autoComplete="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                sx={{ mb: 3 }}
                            />
                        )}
                        <Button fullWidth type="submit" variant="contained" disabled={loading} sx={{ minHeight: 48, borderRadius: 2 }}>
                            {loading ? <CircularProgress size={22} color="inherit" /> : isConfirming ? 'Update password' : 'Send reset link'}
                        </Button>
                    </form>

                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Link component="button" type="button" onClick={() => navigate('/login')} sx={{ fontWeight: 700 }}>
                            Back to sign in
                        </Link>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default PasswordReset;