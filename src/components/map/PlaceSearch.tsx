'use client';

import * as React from 'react';
import { Autocomplete, Marker } from '@react-google-maps/api';
interface PlaceSearchProps {
  map: google.maps.Map | null;
}

export function PlaceSearch({ map }: PlaceSearchProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [auto, setAuto] = React.useState<google.maps.places.Autocomplete | null>(null);
  const [selected, setSelected] = React.useState<google.maps.LatLngLiteral | null>(null);

  const onLoad = (a: google.maps.places.Autocomplete) => {
    setAuto(a);
  };

  const onPlaceChanged = () => {
    if (!auto) return;
    const place = auto.getPlace();
    const loc = place.geometry?.location;
    if (!loc) return;
    const pos = { lat: loc.lat(), lng: loc.lng() };
    setSelected(pos);
    if (map) {
      map.panTo(pos);
      if (map.getZoom() < 14) map.setZoom(15);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2">
        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
          {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
          <input
            ref={inputRef}
            type="text"
            placeholder="場所を検索（例: 土森海岸 / きよら海工房 / 住所）"
            className="w-full md:w-1/2 border border-pastel-300 dark:border-pastel-500 rounded-lg px-3 py-2 bg-white dark:bg-pastel-900/30 text-pastel-900 dark:text-pastel-100"
          />
        </Autocomplete>
      </div>
      {selected && <Marker position={selected} />}
    </div>
  );
}


