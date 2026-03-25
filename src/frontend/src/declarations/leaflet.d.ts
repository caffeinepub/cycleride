declare module "leaflet" {
  export interface Map {
    remove(): void;
    panTo(latlng: [number, number]): void;
  }
  export interface Marker {
    setLatLng(latlng: [number, number]): void;
    bindPopup(content: string): this;
    addTo(map: Map): this;
  }
  export namespace Icon {
    class Default {
      static prototype: Record<string, unknown>;
      static mergeOptions(options: Record<string, string>): void;
    }
  }
  export function map(container: HTMLElement, options?: Record<string, unknown>): Map;
  export function marker(latlng: [number, number], options?: Record<string, unknown>): Marker;
  export function tileLayer(url: string, options?: Record<string, unknown>): { addTo(map: Map): void };
  export function divIcon(options: Record<string, unknown>): unknown;
  const L: typeof import("leaflet");
  export default L;
}
declare module "leaflet/dist/leaflet.css" {
  const styles: string;
  export default styles;
}
