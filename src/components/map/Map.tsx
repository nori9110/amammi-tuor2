'use client';

import * as React from 'react';
import { GoogleMap } from '@react-google-maps/api';

const AMAMI_CENTER = { lat: 28.3764, lng: 129.4936 };

interface MapProps {
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  children?: React.ReactNode;
  onMapLoad?: (map: google.maps.Map) => void;
}

export function Map({ center = AMAMI_CENTER, zoom = 11, children, onMapLoad }: MapProps) {
  const containerStyle = React.useMemo(() => ({ width: '100%', height: '70vh', borderRadius: 12 }), []);

  return (
    <div className="rounded-lg overflow-hidden border border-pastel-300">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={zoom} options={{
        disableDefaultUI: false,
        fullscreenControl: false,
        mapTypeControl: false,
      }} onLoad={(m) => onMapLoad && onMapLoad(m)}>
        {children}
      </GoogleMap>
    </div>
  );
}


