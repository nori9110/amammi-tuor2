'use client';

import * as React from 'react';
import { Marker, InfoWindow, useGoogleMap } from '@react-google-maps/api';
import { ScheduleData, ScheduleItem } from '@/types';

type MarkerColor = 'sightseeing' | 'restaurant' | 'hotel' | 'activity';

const typeToColor: Record<MarkerColor, string> = {
  sightseeing: '#4285F4',
  restaurant: '#EA4335',
  hotel: '#34A853',
  activity: '#FBBC04',
};

export interface LocationPoint {
  itemId: string;
  lat: number;
  lng: number;
  label: string; // time
  title: string; // activity text (plain)
  type: MarkerColor;
  placeName?: string;
  website?: string;
}

export function extractLocationPoints(data: ScheduleData): LocationPoint[] {
  const points: LocationPoint[] = [];
  data.schedule.forEach((d) => {
    d.items.forEach((item: ScheduleItem) => {
      if (item.location && typeof item.location.lat === 'number' && typeof item.location.lng === 'number') {
        points.push({
          itemId: item.id,
          lat: item.location.lat,
          lng: item.location.lng,
          label: item.time,
          title: item.activity.replace(/<[^>]+>/g, ''),
          type: item.type as MarkerColor,
          placeName: item.location?.name,
          website: item.website,
        });
      }
    });
  });
  return points;
}

interface MarkersProps {
  points: LocationPoint[];
  initialActiveId?: string | null;
}

export function Markers({ points, initialActiveId = null }: MarkersProps) {
  const [activeId, setActiveId] = React.useState<string | null>(initialActiveId);
  const active = points.find((pt) => pt.itemId === activeId) || null;
  const map = useGoogleMap();

  React.useEffect(() => {
    if (initialActiveId) {
      setActiveId(initialActiveId);
    }
  }, [initialActiveId]);

  const openGoogleMapsUrl = (pt: LocationPoint) =>
    `https://www.google.com/maps?q=${pt.lat},${pt.lng}(${encodeURIComponent(pt.placeName || pt.title)})`;

  return (
    <>
      {points.map((p) => (
        <Marker
          key={p.itemId}
          position={{ lat: p.lat, lng: p.lng }}
          onClick={() => {
            if (activeId === p.itemId) {
              setActiveId(null);
            } else {
              setActiveId(p.itemId);
              if (map) {
                map.panTo({ lat: p.lat, lng: p.lng });
                const zoom = map.getZoom();
                if (zoom !== undefined && zoom < 14) {
                  map.setZoom(15);
                }
              }
            }
          }}
          label={{ text: p.label, color: '#ffffff', fontSize: '12px', fontWeight: '700' }}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: typeToColor[p.type],
            fillOpacity: 1,
            strokeColor: '#1e293b',
            strokeWeight: 1,
            scale: 8,
          }}
          title={p.title}
        />
      ))}

      {active && (
        <InfoWindow
          position={{ lat: active.lat, lng: active.lng }}
          onCloseClick={() => setActiveId(null)}
        >
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="font-semibold text-pastel-900 dark:text-pastel-100">
                  {active.label} {active.placeName || ''}
                </div>
                <div className="text-sm text-pastel-700 dark:text-pastel-300 max-w-[220px] mt-1">
                  {active.title}
                </div>
              </div>
              <button
                onClick={() => setActiveId(null)}
                className="text-pastel-600 hover:text-pastel-900 dark:text-pastel-400 dark:hover:text-pastel-100 text-lg leading-none font-bold"
                aria-label="閉じる"
              >
                ×
              </button>
            </div>
            <div className="text-sm space-x-2 pt-1 border-t border-pastel-200 dark:border-pastel-700">
              {active.website ? (
                <a className="underline text-pastel-900 dark:text-pastel-100 hover:text-primary" href={active.website} target="_blank" rel="noopener noreferrer">公式サイト</a>
              ) : (
                <a className="underline text-pastel-900 dark:text-pastel-100 hover:text-primary" href={`https://www.google.com/search?q=${encodeURIComponent(active.placeName || active.title)}`} target="_blank" rel="noopener noreferrer">Google検索</a>
              )}
              <a className="underline text-pastel-900 dark:text-pastel-100 hover:text-primary" href={openGoogleMapsUrl(active)} target="_blank" rel="noopener noreferrer">Google Mapsで開く</a>
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
}


