'use client'

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export interface Location {
  id: string;
  longitude: number;
  latitude: number;
  riskLevel: string;
  zoneName?: string;
  riskScore?: number;
  activeViolations?: number;
}

export interface Viewport {
  center: { lat: number; lng: number };
  zoom: number;
}

interface MapProps {
  locations: Location[];
  viewport?: Viewport;
  height?: string;
  onMarkerClick?: (locationId: string) => void;
  selectedLocationId?: string;
}

const MapContext = createContext<maplibregl.Map | null>(null);

export const getRiskColor = (riskLevel: string) => {
  switch (riskLevel) {
    case 'critical':
      return '#ef4444'; // Red
    case 'high':
      return '#f97316'; // Orange
    case 'elevated':
      return '#eab308'; // Yellow/Amber
    case 'routine':
    case 'nominal':
    case 'low':
    default:
      return '#3b82f6'; // Blue
  }
};

interface MarkerProps {
  location: Location;
  color: string;
  anchor?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  onClick?: (locationId: string) => void;
  isSelected?: boolean;
}

export const Marker = ({ location, color, anchor = 'center', onClick, isSelected = false }: MarkerProps) => {
  const map = useContext(MapContext);
  const markerRef = useRef<maplibregl.Marker | null>(null);

  useEffect(() => {
    if (!map) return;

    const el = document.createElement('div');
    el.style.width = isSelected ? '26px' : '20px';
    el.style.height = isSelected ? '26px' : '20px';
    el.style.borderRadius = '50%';
    el.style.backgroundColor = color;
    el.style.border = isSelected ? '3px solid #fff' : '2px solid #fff';
    el.style.boxShadow = isSelected
      ? `0 0 15px rgba(0,0,0,0.5), 0 0 0 3px ${color}`
      : '0 0 10px rgba(0,0,0,0.3)';
    el.style.cursor = 'pointer';
    el.style.transition = 'width 0.2s ease-in-out, height 0.2s ease-in-out, border 0.2s ease-in-out, box-shadow 0.2s ease-in-out, background-color 0.2s ease-in-out';

    const marker = new maplibregl.Marker({
      element: el,
      anchor: anchor,
    })
      .setLngLat([location.longitude, location.latitude])
      .addTo(map);

    let popup: maplibregl.Popup | null = null;

    // Click handler
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      if (onClick) {
        onClick(location.id);
      }
    });

    // Hover details popup
    el.addEventListener('mouseenter', () => {
      const popupContent = `
        <div style="font-family: sans-serif; padding: 8px; font-size: 13px; line-height: 1.4; color: #171717;">
          <div style="font-weight: 600; margin-bottom: 4px;">${location.zoneName || 'Zone ' + location.id}</div>
          <div style="display: flex; justify-content: space-between; gap: 16px; margin-bottom: 2px;">
            <span style="color: #666;">Risk Level:</span>
            <span style="font-weight: 500; text-transform: capitalize; color: ${color};">${location.riskLevel}</span>
          </div>
          ${location.riskScore !== undefined ? `
            <div style="display: flex; justify-content: space-between; gap: 16px; margin-bottom: 2px;">
              <span style="color: #666;">Risk Score:</span>
              <span style="font-weight: 600;">${location.riskScore}%</span>
            </div>
          ` : ''}
          ${location.activeViolations !== undefined ? `
            <div style="display: flex; justify-content: space-between; gap: 16px;">
              <span style="color: #666;">Active Violations:</span>
              <span style="font-weight: 600;">${location.activeViolations}</span>
            </div>
          ` : ''}
        </div>
      `;

      popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: [0, -10] as [number, number],
      })
        .setLngLat([location.longitude, location.latitude])
        .setHTML(popupContent)
        .addTo(map);
    });

    el.addEventListener('mouseleave', () => {
      if (popup) {
        popup.remove();
        popup = null;
      }
    });

    markerRef.current = marker;

    return () => {
      if (popup) {
        popup.remove();
      }
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };
  }, [map, location.id, location.longitude, location.latitude, location.riskLevel, location.zoneName, location.riskScore, location.activeViolations, color, anchor, onClick, isSelected]);

  return null;
};

const MAPTILER_API_KEY = process.env.NEXT_PUBLIC_MAPTILER_API_KEY || ""

const Map = ({ locations, viewport, height = '600px', onMarkerClick, selectedLocationId }: MapProps) => {
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!containerRef.current) return;

    const initialCenter: [number, number] = viewport
      ? [viewport.center.lng, viewport.center.lat]
      : [77.5946, 12.9716];

    const initialZoom = viewport ? viewport.zoom : 12;

    if (!MAPTILER_API_KEY) {
      console.error("Maptiler api key not available.");
      return;
    }

    const mapInstance = new maplibregl.Map({
      container: containerRef.current,
      style: `https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_API_KEY}`,
      center: initialCenter,
      zoom: initialZoom,
    });

    mapInstance.on('load', () => {
      setMap(mapInstance);
    });

    return () => {
      mapInstance.remove();
    };
  }, []);

  // Update viewport dynamically if it changes
  useEffect(() => {
    if (!map || !viewport) return;
    map.setCenter([viewport.center.lng, viewport.center.lat]);
    map.setZoom(viewport.zoom);
  }, [map, viewport]);

  // Handle GeoJSON Source and Layer
  useEffect(() => {
    if (!map) return;

    const sourceId = 'locations';
    const layerId = 'locations-layer';

    const geojsonData: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: locations.map((location) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [location.longitude, location.latitude],
        },
        properties: {
          riskLevel: location.riskLevel,
        },
      })),
    };

    if (map.getSource(sourceId)) {
      const source = map.getSource(sourceId) as maplibregl.GeoJSONSource;
      source.setData(geojsonData);
    } else {
      map.addSource(sourceId, {
        type: 'geojson',
        data: geojsonData,
      });

      if (!map.getLayer(layerId)) {
        map.addLayer({
          id: layerId,
          type: 'circle',
          source: sourceId,
          paint: {
            'circle-radius': 10,
            'circle-color': [
              'case',
              ['==', ['get', 'riskLevel'], 'critical'],
              '#ef4444',
              ['==', ['get', 'riskLevel'], 'high'],
              '#f97316',
              ['==', ['get', 'riskLevel'], 'elevated'],
              '#eab308',
              '#3b82f6',
            ],
          },
        });
      }
    }
  }, [map, locations]);

  return (
    <MapContext.Provider value={map}>
      <div ref={containerRef} style={{ width: '100%', height, position: 'relative' }}>
        {map && locations.map((location) => (
          <Marker
            key={location.id}
            location={location}
            color={getRiskColor(location.riskLevel)}
            anchor="center"
            onClick={onMarkerClick}
            isSelected={selectedLocationId === location.id}
          />
        ))}
      </div>
    </MapContext.Provider>
  );
};

export default Map;
