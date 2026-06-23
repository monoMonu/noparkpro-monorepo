'use client'

import { createContext, useContext, useState, useEffect, useRef } from 'react';

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
  onMarkerHover?: (locationId: string | null) => void;
  selectedLocationId?: string;
}

const MapContext = createContext<{ wrapper: any; raw: any } | null>(null);

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
  isSelected?: boolean;
}

export const Marker = ({ location, color, isSelected = false }: MarkerProps) => {
  const context = useContext(MapContext);
  const markerRef = useRef<any | null>(null);

  useEffect(() => {
    if (!context || !context.wrapper || !context.raw) return;

    const mapplsObj = (window as any).mappls;
    if (!mapplsObj) return;

    const el = document.createElement('div');
    el.setAttribute('data-marker-id', location.id);
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

    const marker = new mapplsObj.Marker({
      map: context.wrapper,
      position: { lat: location.latitude, lng: location.longitude },
      html: el.outerHTML,
      width: isSelected ? 26 : 20,
      height: isSelected ? 26 : 20,
    });

    markerRef.current = marker;

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };
  }, [context, location.id, location.longitude, location.latitude, color, isSelected]);

  return null;
};

const Map = ({ locations, viewport, height = '600px', onMarkerClick, onMarkerHover, selectedLocationId }: MapProps) => {
  const [map, setMap] = useState<{ wrapper: any; raw: any } | null>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredLocation, setHoveredLocation] = useState<Location | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Load Mappls SDK script and CSS dynamically
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_MAPPLS_API_KEY || "";
    if (!apiKey || apiKey === "YOUR_MAPPLS_API_KEY") {
      console.warn("Mappls API key not found or using placeholder value.");
      return;
    }

    // Load CSS
    const existingCss = document.getElementById('mappls-sdk-css');
    if (!existingCss) {
      const link = document.createElement('link');
      link.id = 'mappls-sdk-css';
      link.rel = 'stylesheet';
      link.href = `https://apis.mappls.com/advancedmaps/api/${apiKey}/map_sdk_css?v=3.0`;
      document.head.appendChild(link);
    }

    // Load JS Script
    const existingScript = document.getElementById('mappls-sdk-script');
    if (existingScript) {
      if ((window as any).mappls) {
        setSdkLoaded(true);
      } else {
        existingScript.addEventListener('load', () => setSdkLoaded(true));
      }
      return;
    }

    const script = document.createElement('script');
    script.id = 'mappls-sdk-script';
    script.src = `https://apis.mappls.com/advancedmaps/api/${apiKey}/map_sdk?layer=vector&v=3.0`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setSdkLoaded(true);
    };
    script.onerror = () => {
      console.error("Failed to load Mappls SDK");
    };
    document.head.appendChild(script);
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!sdkLoaded || !containerRef.current) return;

    // Dynamically assign ID on client to avoid hydration mismatch
    const uniqueId = `mappls-map-${Math.random().toString(36).substring(2, 9)}`;
    containerRef.current.id = uniqueId;

    // Mappls map options expect { lat, lng } for center
    const initialCenter = viewport
      ? { lat: viewport.center.lat, lng: viewport.center.lng }
      : { lat: 12.9716, lng: 77.5946 };
    const initialZoom = viewport ? viewport.zoom : 12;

    const mapplsObj = (window as any).mappls;
    if (!mapplsObj) return;

    let mapInstance: any = null;
    try {
      mapInstance = new mapplsObj.Map(uniqueId, {
        center: initialCenter,
        zoom: initialZoom,
      });

      const handleLoad = () => {
        if (mapInstance && typeof mapInstance.getMap === 'function') {
          setMap({ wrapper: mapInstance, raw: mapInstance.getMap() });
        } else {
          setMap({ wrapper: mapInstance, raw: mapInstance });
        }
      };

      if (mapInstance.addListener) {
        mapInstance.addListener('load', handleLoad);
      } else {
        handleLoad();
      }
    } catch (error) {
      console.error("Error creating Mappls map:", error);
    }

    return () => {
      if (mapInstance) {
        if (typeof mapInstance.remove === 'function') {
          mapInstance.remove();
        } else if (typeof mapInstance.getMap === 'function') {
          const raw = mapInstance.getMap();
          if (raw && typeof raw.remove === 'function') {
            raw.remove();
          }
        }
      }
    };
  }, [sdkLoaded]);

  // Update viewport dynamically if it changes
  useEffect(() => {
    if (!map || !map.raw || !viewport) return;
    map.raw.setCenter([viewport.center.lng, viewport.center.lat]);
    map.raw.setZoom(viewport.zoom);
  }, [map, viewport]);

  // Track mouse position relative to map container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    container.addEventListener('mousemove', handleMouseMove);
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Event delegation for hover (mouseover and mouseout)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const markerEl = target.closest('[data-marker-id]');
      if (markerEl) {
        const markerId = markerEl.getAttribute('data-marker-id');
        const foundLoc = locations.find((l) => l.id === markerId);
        if (foundLoc) {
          setHoveredLocation(foundLoc);
          if (onMarkerHover) {
            onMarkerHover(markerId);
          }
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const markerEl = target.closest('[data-marker-id]');
      if (markerEl) {
        setHoveredLocation(null);
        if (onMarkerHover) {
          onMarkerHover(null);
        }
      }
    };

    container.addEventListener('mouseover', handleMouseOver);
    container.addEventListener('mouseout', handleMouseOut);

    return () => {
      container.removeEventListener('mouseover', handleMouseOver);
      container.removeEventListener('mouseout', handleMouseOut);
    };
  }, [locations, onMarkerHover]);

  // Event delegation for clicks
  useEffect(() => {
    if (!containerRef.current || !onMarkerClick) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const markerEl = target.closest('[data-marker-id]');
      if (markerEl) {
        const markerId = markerEl.getAttribute('data-marker-id');
        if (markerId) {
          onMarkerClick(markerId);
        }
      }
    };

    const container = containerRef.current;
    container.addEventListener('click', handleClick);

    return () => {
      container.removeEventListener('click', handleClick);
    };
  }, [onMarkerClick]);

  return (
    <MapContext.Provider value={map}>
      <div ref={containerRef} style={{ width: '100%', height, position: 'relative' }}>
        {!sdkLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[2px] z-10">
            <span className="text-sm font-semibold text-on-surface-variant">Loading Mappls SDK...</span>
          </div>
        )}
        {map && locations.map((location) => (
          <Marker
            key={location.id}
            location={location}
            color={getRiskColor(location.riskLevel)}
            isSelected={selectedLocationId === location.id}
          />
        ))}

        {(() => {
          if (!hoveredLocation) return null;

          const tooltipWidth = 220;
          const tooltipHeight = 135;
          let leftPos = mousePos.x + 15;
          let topPos = mousePos.y + 15;

          if (containerRef.current) {
            const containerWidth = containerRef.current.clientWidth;
            const containerHeight = containerRef.current.clientHeight;

            if (mousePos.x + tooltipWidth + 15 > containerWidth) {
              leftPos = mousePos.x - tooltipWidth - 15;
            }
            if (mousePos.y + tooltipHeight + 15 > containerHeight) {
              topPos = mousePos.y - tooltipHeight - 15;
            }
          }

          leftPos = Math.max(5, leftPos);
          topPos = Math.max(5, topPos);

          return (
            <div
              className="absolute z-50 pointer-events-none bg-surface/95 text-on-surface backdrop-blur-md border border-outline-variant rounded-lg p-3 shadow-[0_10px_30px_rgba(0,0,0,0.15)] text-sm flex flex-col gap-1.5 w-[220px]"
              style={{
                left: leftPos,
                top: topPos,
                fontFamily: 'sans-serif'
              }}
            >
              <div className="font-semibold text-base border-b border-outline-variant pb-1 mb-1 text-on-surface">
                {hoveredLocation.zoneName || `Zone ${hoveredLocation.id}`}
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-on-surface-variant">Risk Level:</span>
                <span className="font-semibold capitalize" style={{ color: getRiskColor(hoveredLocation.riskLevel) }}>
                  {hoveredLocation.riskLevel}
                </span>
              </div>
              {hoveredLocation.riskScore !== undefined && (
                <div className="flex justify-between gap-4">
                  <span className="text-on-surface-variant">Risk Score:</span>
                  <span className="font-semibold">{hoveredLocation.riskScore}%</span>
                </div>
              )}
              {hoveredLocation.activeViolations !== undefined && (
                <div className="flex justify-between gap-4">
                  <span className="text-on-surface-variant">Active Violations:</span>
                  <span className="font-semibold">{hoveredLocation.activeViolations}</span>
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </MapContext.Provider>
  );
};

export default Map;
