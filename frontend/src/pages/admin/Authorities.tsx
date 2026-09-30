import { useState, useEffect } from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Box, IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import client from '../../api/client';

const Authorities = () => {
    const [items, setItems] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await client.get('/authorities/authorities/');
            setItems(res.data);
        } catch (err) { console.error(err); }
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                <Typography variant="h4" fontWeight="bold">Authorities</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>Add Authority</Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ bgcolor: 'grey.200' }}>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Contact</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.contact_email}</TableCell>
                                <TableCell>
                                    <IconButton color="info"><EditIcon /></IconButton>
                                    <IconButton color="error"><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {items.length === 0 && (
                            <TableRow><TableCell colSpan={4} align="center">No authorities defined.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Add Authority</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Authority Name"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Authorities;
