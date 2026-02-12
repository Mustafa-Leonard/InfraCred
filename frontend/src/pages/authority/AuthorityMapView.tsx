import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, CircularProgress, Box } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import client from '../../api/client';
import 'leaflet/dist/leaflet.css';

const AuthorityMapView = () => {
    const [clusters, setClusters] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await client.get('/clustering/clusters/');
                const data = res.data.results ? res.data.results : res.data;
                setClusters(data || []);
            } catch (err) {
                console.error('Error fetching data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <CircularProgress sx={{ display: 'block', m: 'auto', mt: 4 }} />;

    return (
        <Container maxWidth="xl">
            <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
                Infrastructure Map View
            </Typography>
            <Paper elevation={3} sx={{ height: '75vh', mt: 3, borderRadius: 2, overflow: 'hidden' }}>
                <MapContainer
                    center={[-3.6, 39.8]}
                    zoom={9}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {clusters.map((cluster: any) => {
                        const [lat, lng] = cluster.center.split(',').map(Number);
                        return (
                            <React.Fragment key={cluster.id}>
                                <Circle
                                    center={[lat, lng]}
                                    radius={cluster.radius || 100}
                                    pathOptions={{ color: cluster.is_active ? 'red' : 'green' }}
                                />
                                <Marker position={[lat, lng]}>
                                    <Popup>
                                        <Typography variant="subtitle2">Cluster #{cluster.id}</Typography>
                                        <Typography variant="body2">{cluster.report_count} Reports</Typography>
                                        <Typography variant="body2">{cluster.category_name}</Typography>
                                    </Popup>
                                </Marker>
                            </React.Fragment>
                        );
                    })}
                </MapContainer>
            </Paper>
        </Container>
    );
};

export default AuthorityMapView;
