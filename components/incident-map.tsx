'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '@/lib/supabase';

interface Incident {
  id: string;
  title: string;
  location: string;
  description: string;
  severity: string;
  status: string;
  people_affected: number;
  latitude: number;
  longitude: number;
}

const severityColors: Record<string, string> = {
  Critical: '#ef4444',
  High: '#f97316',
  Medium: '#eab308',
  Low: '#22c55e',
};

function createMarkerIcon(color: string) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.5);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

export default function IncidentMap() {
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    async function fetchIncidents() {
      const { data } = await supabase
        .from('incidents')
        .select('*')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (data) {
        setIncidents(data as Incident[]);
      }
    }
    fetchIncidents();
  }, []);

  return (
    <MapContainer
      center={[39.8283, -98.5795]}
      zoom={4}
      style={{ height: '100%', width: '100%' }}
      className="rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {incidents.map((incident) => (
        <Marker
          key={incident.id}
          position={[incident.latitude, incident.longitude]}
          icon={createMarkerIcon(severityColors[incident.severity] || '#gray')}
        >
          <Popup>
            <div className="min-w-[200px]">
              <h3 className="font-bold text-white mb-2">{incident.title}</h3>
              <p className="text-gray-400 text-sm mb-1">
                <strong>Location:</strong> {incident.location}
              </p>
              <p className="text-gray-400 text-sm mb-1">
                <strong>Severity:</strong>{' '}
                <span
                  style={{ color: severityColors[incident.severity] }}
                  className="font-medium"
                >
                  {incident.severity}
                </span>
              </p>
              <p className="text-gray-400 text-sm mb-1">
                <strong>Status:</strong> {incident.status}
              </p>
              <p className="text-gray-400 text-sm mb-1">
                <strong>People Affected:</strong>{' '}
                {incident.people_affected?.toLocaleString()}
              </p>
              {incident.description && (
                <p className="text-gray-400 text-sm mt-2">
                  {incident.description}
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
