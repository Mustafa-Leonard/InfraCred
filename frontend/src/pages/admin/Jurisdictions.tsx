import { useState, useEffect } from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Box, IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import client from '../../api/client';

const Jurisdictions = () => {
    const [items, setItems] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await client.get('/geo/jurisdictions/');
            const data = res.data.results ? res.data.results : res.data;
            setItems(data || []);
        } catch (err) { console.error(err); }
    };

    const handleSave = async () => {
        if (!name.trim()) return;
        try {
            await client.post('/geo/jurisdictions/', {
                name,
                boundary: JSON.stringify({
                    type: "Feature",
                    geometry: {
                        type: "Polygon",
                        coordinates: [[[36.8, -1.3], [36.9, -1.3], [36.9, -1.2], [36.8, -1.2], [36.8, -1.3]]]
                    },
                    properties: { name }
                })
            });
            setName('');
            setOpen(false);
            fetchData();
        } catch (err) {
            console.error(err);
            alert('Failed to save jurisdiction');
        }
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                <Typography variant="h4" fontWeight="bold">Jurisdictions</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>Add Jurisdiction</Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ bgcolor: 'grey.200' }}>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Area</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>Map Boundary Defined</TableCell>
                                <TableCell>
                                    <IconButton color="info"><EditIcon /></IconButton>
                                    <IconButton color="error" onClick={async () => {
                                        if (window.confirm('Delete jurisdiction?')) {
                                            await client.delete(`/geo/jurisdictions/${item.id}/`);
                                            fetchData();
                                        }
                                    }}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {items.length === 0 && (
                            <TableRow><TableCell colSpan={4} align="center">No jurisdictions defined.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Add Jurisdiction</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                        Jurisdictions require a GeoJSON boundary. For this demo, we'll generate a default region.
                    </Typography>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Jurisdiction Name"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave} disabled={!name.trim()}>Save Jurisdiction</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Jurisdictions;
