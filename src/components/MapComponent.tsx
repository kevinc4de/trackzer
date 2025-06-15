import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { PhoneType } from '../types';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different phone statuses
const createCustomIcon = (status: string) => {
  const colors = {
    lost: '#f59e0b',
    stolen: '#ef4444',
    found: '#10b981'
  };
  
  const color = colors[status as keyof typeof colors] || '#6b7280';
  
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background-color: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    className: 'custom-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

interface MapComponentProps {
  phones: PhoneType[];
  center?: [number, number];
  zoom?: number;
  height?: string;
}

export const MapComponent: React.FC<MapComponentProps> = ({ 
  phones, 
  center = [7.3697, 12.3547], // Cameroon center coordinates
  zoom = 6,
  height = "400px"
}) => {
  // Adjust zoom and center based on phones data
  const getMapBounds = () => {
    if (phones.length === 0) {
      return { center, zoom };
    }

    if (phones.length === 1) {
      return {
        center: [phones[0].lastKnownLocation.lat, phones[0].lastKnownLocation.lng] as [number, number],
        zoom: 10
      };
    }

    // Calculate bounds for multiple phones
    const lats = phones.map(p => p.lastKnownLocation.lat);
    const lngs = phones.map(p => p.lastKnownLocation.lng);
    
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    
    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;
    
    // Calculate appropriate zoom level based on bounds
    const latDiff = maxLat - minLat;
    const lngDiff = maxLng - minLng;
    const maxDiff = Math.max(latDiff, lngDiff);
    
    let calculatedZoom = 6;
    if (maxDiff < 0.1) calculatedZoom = 12;
    else if (maxDiff < 0.5) calculatedZoom = 10;
    else if (maxDiff < 1) calculatedZoom = 9;
    else if (maxDiff < 2) calculatedZoom = 8;
    else if (maxDiff < 5) calculatedZoom = 7;
    
    return {
      center: [centerLat, centerLng] as [number, number],
      zoom: calculatedZoom
    };
  };

  const mapConfig = getMapBounds();

  const getStatusText = (status: string) => {
    switch (status) {
      case 'lost': return 'Perdu';
      case 'stolen': return 'Volé';
      case 'found': return 'Retrouvé';
      default: return 'Inconnu';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'lost': return 'text-orange-600';
      case 'stolen': return 'text-red-600';
      case 'found': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div style={{ height }} className="rounded-lg overflow-hidden paypal-shadow">
      <MapContainer
        center={mapConfig.center}
        zoom={mapConfig.zoom}
        style={{ height: '100%', width: '100%' }}
        className="z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {phones.map((phone) => (
          <Marker
            key={phone.id}
            position={[phone.lastKnownLocation.lat, phone.lastKnownLocation.lng]}
            icon={createCustomIcon(phone.status)}
          >
            <Popup className="custom-popup">
              <div className="p-2 min-w-[250px]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900">
                    {phone.brand} {phone.model}
                  </h3>
                  <span className={`text-sm font-semibold ${getStatusColor(phone.status)}`}>
                    {getStatusText(phone.status)}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">IMEI:</span>
                    <span className="ml-2 font-mono text-gray-900">{phone.imei}</span>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-600">Propriétaire:</span>
                    <span className="ml-2 text-gray-900">{phone.owner.name}</span>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-600">Contact:</span>
                    <span className="ml-2 text-gray-900">{phone.owner.phone}</span>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-600">Localisation:</span>
                    <span className="ml-2 text-gray-900">{phone.lastKnownLocation.address}</span>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-600">Signalé le:</span>
                    <span className="ml-2 text-gray-900">
                      {new Date(phone.reportedDate).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  
                  {phone.reward && (
                    <div className="mt-3 p-2 bg-green-50 rounded-lg">
                      <span className="font-medium text-green-700">
                        Récompense: {phone.reward} FCFA
                      </span>
                    </div>
                  )}
                  
                  <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 text-xs">
                      {phone.description}
                    </p>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};