"use client";

import * as React from 'react';
import { GoogleMapsLoader } from '@/components/map/GoogleMapsLoader';
import { Map } from '@/components/map/Map';
import { Markers, extractLocationPoints } from '@/components/map/Markers';
import { RouteSearch } from '@/components/map/RouteSearch';
import { LocationAutoCorrect } from '@/components/map/LocationAutoCorrect';
import { PlaceSearch } from '@/components/map/PlaceSearch';
import { loadScheduleData, saveScheduleData } from '@/lib/storage';
import { initialScheduleData } from '@/lib/data';

export default function MapPage() {
  const [points, setPoints] = React.useState(() => extractLocationPoints(initialScheduleData));
  const [selectedLocationId, setSelectedLocationId] = React.useState<string | null>(null);
  const [mapCenter, setMapCenter] = React.useState<google.maps.LatLngLiteral | undefined>(undefined);
  const [mapZoom, setMapZoom] = React.useState<number | undefined>(undefined);
  const [mapInstance, setMapInstance] = React.useState<google.maps.Map | null>(null);

  React.useEffect(() => {
    const saved = loadScheduleData();
    if (!saved) {
      // 初回は初期データを保存して以降の更新が永続化されるようにする
      saveScheduleData(initialScheduleData);
      setPoints(extractLocationPoints(initialScheduleData));
    } else {
      setPoints(extractLocationPoints(saved));
    }

    // スケジュール更新イベントでポイントを再読込
    const onUpdated = () => {
      const latest = loadScheduleData();
      if (latest) setPoints(extractLocationPoints(latest));
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('schedule-updated', onUpdated);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('schedule-updated', onUpdated);
      }
    };
  }, []);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const locationId = params.get('location');
      if (locationId) {
        const point = points.find((p) => p.itemId === locationId);
        if (point) {
          setSelectedLocationId(locationId);
          setMapCenter({ lat: point.lat, lng: point.lng });
          setMapZoom(15);
        }
      }
    }
  }, [points]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold text-pastel-800 dark:text-pastel-100">奄美大島歩き方</h1>
      <GoogleMapsLoader>
        <div className="space-y-3">
          <RouteSearch points={points} />
        </div>
        <Map center={mapCenter} zoom={mapZoom} onMapLoad={setMapInstance}>
          <PlaceSearch map={mapInstance} />
          <LocationAutoCorrect points={points} />
          <Markers points={points} initialActiveId={selectedLocationId} />
        </Map>
      </GoogleMapsLoader>
    </div>
  );
}

