# CycleRide

## Current State
App has landing page with ride booking form, rider listings, how it works, pricing, and auth. The MapSVG component shows a static SVG map.

## Requested Changes (Diff)

### Add
- LiveTrackingMap component using browser Geolocation API + Leaflet.js + OpenStreetMap
- Real GPS customer location on interactive map
- Simulated rider marker moving toward customer
- Track My Ride section shown after booking

### Modify
- HeroSection or App: show live tracking after booking

### Remove
- Nothing

## Implementation Plan
1. Install leaflet + @types/leaflet
2. Create useGeolocation hook
3. Create LiveTrackingMap component
4. Add TrackRideSection and wire into App.tsx
