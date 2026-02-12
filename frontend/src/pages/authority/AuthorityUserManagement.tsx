import { useState, useEffect } from 'react';
import {
    Container, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Button, Box, IconButton,
    TextField, Dialog, DialogTitle, DialogContent, DialogActions,
    MenuItem, Chip, Autocomplete, CircularProgress
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Group as GroupIcon } from '@mui/icons-material';
import client from '../../api/client';

const AuthorityUserManagement = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [agencies, setAgencies] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        permission_level: 'standard',
        agency: ''
    });

    const handleOpen = (user: any = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                username: user.display_username,
                password: '', // Leave blank unless changing
                permission_level: user.permission_level,
                agency: user.agency || ''
            });
        } else {
            setEditingUser(null);
            setFormData({ username: '', password: '', permission_level: 'standard', agency: '' });
        }
        setOpen(true);
    };

    const handleInviteOrUpdate = async () => {
        try {
            const { username, password, permission_level, agency } = formData;
            const payload: any = { username, permission_level, agency };
            if (password) payload.password = password;

            if (editingUser) {
                // For updates, username is usually disabled/ignored by backend set
                await client.patch(`/authority_users/profiles/${editingUser.id}/`, payload);
                alert('User updated successfully');
            } else {
                await client.post('/authority_users/profiles/', payload);
                alert('User added successfully');
            }
            setOpen(false);
            fetchUsers();
        } catch (err: any) {
            console.error(err);
            const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : (err.response?.data?.detail || 'Unknown error');
            alert('Operation failed: ' + errorMsg);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this team member? This will also disable their login account.')) return;
        try {
            await client.delete(`/authority_users/profiles/${id}/`);
            fetchUsers();
        } catch (err) {
            alert('Failed to delete user');
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchAgencies();
    }, [page, searchQuery]);

    const fetchUsers = async () => {
        try {
            const res = await client.get(`/authority_users/profiles/?page=${page}&search=${searchQuery}`);
            if (res.data && res.data.results) {
                // Paginated response
                setUsers(res.data.results);
                setTotalPages(Math.ceil((res.data.count || 0) / 10)); // Backend default checks
            } else {
                // Non-paginated (fallback)
                setUsers(Array.isArray(res.data) ? res.data : []);
                setTotalPages(1);
            }
        } catch (err) { console.error(err); }
    };

    const fetchAgencies = async () => {
        try {
            const res = await client.get('/authorities/agencies/');
            setAgencies(res.data.results || res.data || []);
        } catch (err) { console.error(err); }
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <GroupIcon color="primary" sx={{ fontSize: 40 }} />
                    <Typography variant="h4" fontWeight="bold">Internal Access & Role Management</Typography>
                </Box>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>Add User</Button>
            </Box>

            <Box sx={{ display: 'flex', mb: 2 }}>
                <Autocomplete
                    freeSolo
                    options={users.map((u) => u.first_name ? `${u.first_name} ${u.last_name}` : u.display_username)}
                    onInputChange={(event, newInputValue) => {
                        setSearchQuery(newInputValue);
                        setPage(1);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Search Users"
                            placeholder="Type username or agency..."
                            size="small"
                            InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                    <>
                                        {/* Icon can go here */}
                                        {params.InputProps.startAdornment}
                                    </>
                                )
                            }}
                        />
                    )}
                    sx={{ width: 400, bgcolor: 'white' }}
                />
            </Box>

            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead sx={{ bgcolor: 'primary.main' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white' }}>Staff Name / Title</TableCell>
                            <TableCell sx={{ color: 'white' }}>Agency</TableCell>
                            <TableCell sx={{ color: 'white' }}>Role Level</TableCell>
                            <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((u) => (
                            <TableRow key={u.id} hover>
                                <TableCell sx={{ fontWeight: 'bold' }}>
                                    {u.first_name ? `${u.first_name} ${u.last_name}` : u.display_username}
                                </TableCell>
                                <TableCell>{u.agency_name || 'No Agency'}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={u.permission_level.toUpperCase()}
                                        color={u.permission_level === 'admin' ? 'error' : u.permission_level === 'manager' ? 'warning' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton color="info" onClick={() => handleOpen(u)}><EditIcon /></IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(u.id)}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {users.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                                    No internal users listed. Add your first team member!
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                    <Button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Previous</Button>
                    <Typography>Page {page} of {totalPages || 1}</Typography>
                    <Button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
                </Box>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{editingUser ? 'Edit Team Member' : 'Add Authority User'}</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                        {editingUser ? 'Edit the details for this team member.' : 'Invite a new team member to your authority account.'}
                    </Typography>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Username"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        disabled={!!editingUser} // Disable username editing for existing users
                    />
                    <TextField
                        margin="dense"
                        label={editingUser ? "New Password (optional)" : "Password"}
                        type="password"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder={editingUser ? "Leave blank to keep current" : ""}
                    />
                    <TextField
                        select
                        margin="dense"
                        label="Permission Level"
                        fullWidth
                        value={formData.permission_level}
                        onChange={(e) => setFormData({ ...formData, permission_level: e.target.value })}
                        sx={{ mb: 2 }}
                    >
                        <MenuItem value="standard">Standard User (Read-only)</MenuItem>
                        <MenuItem value="manager">Manager (Assignment rights)</MenuItem>
                        <MenuItem value="admin">Authority Admin (Full control)</MenuItem>
                    </TextField>
                    <TextField
                        select
                        margin="dense"
                        label="Agency"
                        fullWidth
                        value={formData.agency}
                        onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
                        sx={{ mt: 2 }}
                    >
                        {agencies.map((a) => (
                            <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleInviteOrUpdate}>
                        {editingUser ? 'Save Changes' : 'Add User'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AuthorityUserManagement;
