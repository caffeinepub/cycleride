import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useRef } from "react";
import { useGeolocation } from "../hooks/useGeolocation";

const LEAFLET_CDN = "https://unpkg.com/leaflet@1.9.4/dist/images";

const customerIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:36px;height:36px;border-radius:50%;
    background:oklch(0.55 0.2 250);border:3px solid white;
    box-shadow:0 0 0 4px rgba(59,130,246,0.35);
    display:flex;align-items:center;justify-content:center;
    position:relative;
  ">
    <div style="
      position:absolute;inset:-6px;border-radius:50%;
      border:2px solid rgba(59,130,246,0.5);
      animation:pulse-ring 1.5s ease-out infinite;
    "></div>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><title>You</title>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -20],
});

const riderIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:40px;height:40px;border-radius:50%;
    background:oklch(0.55 0.2 145);border:3px solid white;
    box-shadow:0 2px 8px rgba(0,0,0,0.25);
    display:flex;align-items:center;justify-content:center;
  ">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><title>Rider</title>
      <path d="M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5S3.1 13.5 5 13.5s3.5 1.6 3.5 3.5S6.9 20.5 5 20.5zm5.8-10l2.4-2.4.8.8c1.3 1.3 3 2.1 5.1 2.1V11c-1.5 0-2.7-.6-3.6-1.5l-1.9-1.9c-.5-.4-1-.6-1.6-.6s-1.1.2-1.4.6L7.8 10.4c-.4.4-.6.9-.6 1.4 0 .6.2 1.1.6 1.4L11 16v5h2v-6.2l-2.2-2.8zM19 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z"/>
    </svg>
  </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -22],
});

// Fix default icon — use Object.assign to avoid noDelete lint rule
const iconProto = L.Icon.Default.prototype as unknown as Record<
  string,
  unknown
>;
iconProto._getIconUrl = undefined;
L.Icon.Default.mergeOptions({
  iconUrl: `${LEAFLET_CDN}/marker-icon.png`,
  iconRetinaUrl: `${LEAFLET_CDN}/marker-icon-2x.png`,
  shadowUrl: `${LEAFLET_CDN}/marker-shadow.png`,
});

function offsetCoords(
  lat: number,
  lng: number,
  deltaLat: number,
  deltaLng: number,
) {
  return { lat: lat + deltaLat, lng: lng + deltaLng };
}

interface LiveTrackingMapProps {
  etaSeconds: number;
}

export default function LiveTrackingMap({ etaSeconds }: LiveTrackingMapProps) {
  const { lat, lng, error, loading } = useGeolocation();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const customerMarkerRef = useRef<L.Marker | null>(null);
  const riderMarkerRef = useRef<L.Marker | null>(null);
  const riderPosRef = useRef<{ lat: number; lng: number } | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    if (loading || error || lat === null || lng === null) return;

    const map = L.map(mapContainerRef.current, {
      center: [lat, lng],
      zoom: 15,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // Customer marker
    const custMarker = L.marker([lat, lng], { icon: customerIcon })
      .addTo(map)
      .bindPopup("<strong>You</strong>");
    customerMarkerRef.current = custMarker;

    // Start rider ~800m away
    const startOffset = offsetCoords(lat, lng, 0.0052, 0.0052);
    riderPosRef.current = startOffset;
    const riderMarker = L.marker([startOffset.lat, startOffset.lng], {
      icon: riderIcon,
    })
      .addTo(map)
      .bindPopup("<strong>Your Rider</strong><br/>Arjun • Mountain Bike");
    riderMarkerRef.current = riderMarker;

    mapRef.current = map;

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      map.remove();
      mapRef.current = null;
      customerMarkerRef.current = null;
      riderMarkerRef.current = null;
    };
  }, [lat, lng, loading, error]);

  // Animate rider toward customer
  useEffect(() => {
    if (!mapRef.current || lat === null || lng === null) return;

    const totalMs = etaSeconds * 1000;
    const startTime = Date.now();
    const startPos =
      riderPosRef.current || offsetCoords(lat, lng, 0.0052, 0.0052);

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / totalMs, 1);
      const rLat = startPos.lat + (lat - startPos.lat) * t;
      const rLng = startPos.lng + (lng - startPos.lng) * t;
      riderPosRef.current = { lat: rLat, lng: rLng };
      riderMarkerRef.current?.setLatLng([rLat, rLng]);

      if (t < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [lat, lng, etaSeconds]);

  // Update customer marker on GPS update
  useEffect(() => {
    if (!mapRef.current || lat === null || lng === null) return;
    customerMarkerRef.current?.setLatLng([lat, lng]);
    mapRef.current.panTo([lat, lng]);
  }, [lat, lng]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] bg-muted rounded-xl">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">Acquiring GPS signal…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] bg-muted/50 rounded-xl border border-border">
        <div className="text-center space-y-4 px-6 max-w-sm">
          <div className="w-14 h-14 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-7 h-7 text-destructive"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <title>Location error</title>
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">
              Location Access Required
            </h3>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
          <div className="text-xs text-muted-foreground bg-muted rounded-lg p-3 text-left space-y-1">
            <p className="font-medium">How to enable:</p>
            <p>• Click the lock or info icon in your browser address bar</p>
            <p>• Set Location to "Allow"</p>
            <p>• Refresh the page</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-xl overflow-hidden">
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>
      <div
        ref={mapContainerRef}
        className="w-full h-full"
        style={{ minHeight: 400 }}
      />
    </div>
  );
}
