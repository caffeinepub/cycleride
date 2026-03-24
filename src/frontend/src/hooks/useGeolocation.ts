import { useEffect, useState } from "react";

export interface GeolocationState {
  lat: number | null;
  lng: number | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    lat: null,
    lng: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        lat: null,
        lng: null,
        error: "Geolocation is not supported by your browser.",
        loading: false,
      });
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          error: null,
          loading: false,
        });
      },
      (err) => {
        let message = "Unable to get your location.";
        if (err.code === err.PERMISSION_DENIED) {
          message =
            "Location access denied. Please enable GPS permissions in your browser settings.";
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          message =
            "Location information is unavailable. Please check your GPS signal.";
        } else if (err.code === err.TIMEOUT) {
          message = "Location request timed out. Please try again.";
        }
        setState({ lat: null, lng: null, error: message, loading: false });
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return state;
}
