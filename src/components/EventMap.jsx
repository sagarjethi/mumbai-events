import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { CATEGORIES } from '../data/events';
import { toSlug } from '../utils/slug';

import 'leaflet/dist/leaflet.css';

// Fix default marker icon issue in bundled apps
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const CATEGORY_COLORS = {
  conference: '#5a78f2',
  hackathon: '#8b5cf6',
  startup: '#10b981',
  web3: '#f59e0b',
  meetup: '#06b6d4',
  music: '#f43f5e',
  sports: '#059669',
  expo: '#64748b',
  cybersecurity: '#e11d48',
};

function createCategoryIcon(category) {
  const color = CATEGORY_COLORS[category] || '#5a78f2';
  return L.divIcon({
    className: '',
    html: `<div style="width:28px;height:28px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}

export default function EventMap({ events, height = '500px', zoom = 12, center, showLinks = true }) {
  const mappableEvents = events.filter((e) => e.lat && e.lng);
  const mapCenter = center || [12.9716, 77.5946];

  if (mappableEvents.length === 0) return null;

  return (
    <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height, width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {mappableEvents.map((event) => {
          const cat = CATEGORIES[event.category];
          return (
            <Marker
              key={event.id}
              position={[event.lat, event.lng]}
              icon={createCategoryIcon(event.category)}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <div className="font-bold text-sm text-slate-900 mb-1">{event.name}</div>
                  <div className="text-xs text-slate-500 mb-1">{event.date} &middot; {event.time}</div>
                  <div className="text-xs text-slate-500 mb-2">{event.venue}</div>
                  <div className="flex items-center gap-1 mb-2">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: `${CATEGORY_COLORS[event.category]}20`, color: CATEGORY_COLORS[event.category] }}>
                      {cat?.label}
                    </span>
                    {event.cost === 'Free' && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700">Free</span>
                    )}
                    {event.prize && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700">{event.prize}</span>
                    )}
                  </div>
                  <div className="flex gap-1.5">
                    {showLinks && (
                      <Link
                        to={`/events/${toSlug(event.name)}`}
                        className="text-[11px] font-medium text-primary-600 hover:text-primary-700"
                      >
                        View Details →
                      </Link>
                    )}
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${event.lat},${event.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-medium text-emerald-600 hover:text-emerald-700"
                    >
                      Get Directions →
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
