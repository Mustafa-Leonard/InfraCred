import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface LocationPickerProps {
    onLocationSelect: (lat: number, lng: number) => void;
    initialPosition?: [number, number];
}

const LocationPicker = ({ onLocationSelect, initialPosition }: LocationPickerProps) => {
    const [position, setPosition] = useState<[number, number] | null>(initialPosition || null);

    const MapEvents = () => {
        useMapEvents({
            click(e) {
                setPosition([e.latlng.lat, e.latlng.lng]);
                onLocationSelect(e.latlng.lat, e.latlng.lng);
            },
        });
        return null;
    };

    return (
        <MapContainer
            center={initialPosition || [-1.286389, 36.817223]}
            zoom={13}
            style={{ height: '300px', width: '100%', borderRadius: '8px' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapEvents />
            {position && <Marker position={position} />}
        </MapContainer>
    );
};

export default LocationPicker;
