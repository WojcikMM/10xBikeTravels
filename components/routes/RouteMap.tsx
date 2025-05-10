'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styled from 'styled-components';
import { RoutePoint } from '@/lib/ai/openrouter-service';

const MapWrapper = styled.div`
  width: 100%;
  height: 400px;
  margin-bottom: 1.5rem;
  border-radius: 4px;
  overflow: hidden;

  .leaflet-container {
    width: 100%;
    height: 100%;
  }
`;

interface RouteMapProps {
  routePoints: RoutePoint[];
}

const RouteMap: React.FC<RouteMapProps> = ({ routePoints }) => {
  if (!routePoints || routePoints.length === 0) {
    return <div>Brak punktów trasy do wyświetlenia.</div>;
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // @ts-ignore
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
    }
  }, []);

  const getMapCenter = () => {
    const lats = routePoints.map((point) => point.coordinates.lat);
    const lngs = routePoints.map((point) => point.coordinates.lng);
    
    const avgLat = lats.reduce((a, b) => a + b, 0) / lats.length;
    const avgLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;
    
    return [avgLat, avgLng];
  };

  const polylinePositions = routePoints.map((point) => [
    point.coordinates.lat,
    point.coordinates.lng,
  ]);

  return (
    <MapWrapper>
      <MapContainer 
        center={getMapCenter() as [number, number]} 
        zoom={10} 
        scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Linia trasy */}
        <Polyline 
          positions={polylinePositions as [number, number][]} 
          color="blue" 
          weight={3} 
          opacity={0.7} 
        />
        
        {routePoints.map((point, index) => (
          <Marker 
            key={index} 
            position={[point.coordinates.lat, point.coordinates.lng]}
          >
            <Popup>
              <div>
                <strong>{point.name}</strong>
                <p>{point.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </MapWrapper>
  );
};

export default RouteMap;
