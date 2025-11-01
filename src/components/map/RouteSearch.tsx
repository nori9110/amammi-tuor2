'use client';

import * as React from 'react';
import { DirectionsRenderer } from '@react-google-maps/api';
import { LocationPoint } from '@/components/map/Markers';
import { getCurrentPosition } from '@/lib/geolocation';
import { Button } from '@/components/ui/Button';

type TravelMode = 'DRIVING' | 'WALKING' | 'TRANSIT';

interface RouteSearchProps {
  points: LocationPoint[];
}

export function RouteSearch({ points }: RouteSearchProps) {
  const [fromId, setFromId] = React.useState<string>('');
  const [toId, setToId] = React.useState<string>('');
  const [mode, setMode] = React.useState<TravelMode>('DRIVING');
  const [directions, setDirections] = React.useState<google.maps.DirectionsResult | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string>('');

  const findPoint = (id: string) => points.find((p) => p.itemId === id) || null;

  const requestRoute = async (origin: google.maps.LatLngLiteral, destination: google.maps.LatLngLiteral) => {
    setLoading(true);
    setError('');
    try {
      const service = new google.maps.DirectionsService();
      const res = await service.route({
        origin,
        destination,
        travelMode: google.maps.TravelMode[mode],
        provideRouteAlternatives: false,
      });
      setDirections(res);
    } catch (e: any) {
      setError(e?.message || '経路検索に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    const fromPt = findPoint(fromId);
    const toPt = findPoint(toId);
    if (!toPt) {
      setError('到着地点を選択してください');
      return;
    }
    // from: 指定がなければ現在地
    let origin: google.maps.LatLngLiteral;
    if (fromPt) {
      origin = { lat: fromPt.lat, lng: fromPt.lng };
    } else {
      origin = await getCurrentPosition();
    }
    await requestRoute(origin, { lat: toPt.lat, lng: toPt.lng });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col md:flex-row gap-3">
        <select className="border rounded px-3 py-2 flex-1" value={fromId} onChange={(e) => setFromId(e.target.value)}>
          <option value="">出発地: 現在地</option>
          {points.map((p) => (
            <option key={p.itemId} value={p.itemId}>
              {p.label} {p.placeName || p.title}
            </option>
          ))}
        </select>
        <select className="border rounded px-3 py-2 flex-1" value={toId} onChange={(e) => setToId(e.target.value)}>
          <option value="">到着地を選択</option>
          {points.map((p) => (
            <option key={p.itemId} value={p.itemId}>
              {p.label} {p.placeName || p.title}
            </option>
          ))}
        </select>
        <select className="border rounded px-3 py-2" value={mode} onChange={(e) => setMode(e.target.value as TravelMode)}>
          <option value="DRIVING">車</option>
          <option value="WALKING">徒歩</option>
          <option value="TRANSIT">公共交通機関</option>
        </select>
        <Button onClick={handleSearch} isLoading={loading}>経路検索</Button>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {directions && directions.routes[0] && (
        <>
          <div className="bg-pastel-50 dark:bg-pastel-900/30 p-4 rounded-lg border border-pastel-200 dark:border-pastel-700">
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div className="text-sm text-pastel-700 dark:text-pastel-300">距離</div>
                <div className="text-lg font-semibold text-pastel-900 dark:text-pastel-100">
                  {directions.routes[0].legs[0].distance?.text || 'N/A'}
                </div>
              </div>
              <div>
                <div className="text-sm text-pastel-700 dark:text-pastel-300">所要時間</div>
                <div className="text-lg font-semibold text-pastel-900 dark:text-pastel-100">
                  {directions.routes[0].legs[0].duration?.text || 'N/A'}
                </div>
              </div>
            </div>
            {(() => {
              const fromPt = findPoint(fromId);
              const toPt = findPoint(toId);
              if (!toPt) return null;
              const fromStr = fromPt
                ? `${fromPt.lat},${fromPt.lng}`
                : 'current+location';
              const toStr = `${toPt.lat},${toPt.lng}`;
              const googleMapsUrl = `https://www.google.com/maps/dir/${fromStr}/${toStr}`;
              return (
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button variant="outline" size="sm">
                    Google Mapsで開く
                  </Button>
                </a>
              );
            })()}
          </div>
          <DirectionsRenderer directions={directions} options={{ suppressMarkers: false, preserveViewport: false }} />
        </>
      )}
    </div>
  );
}


