'use client';

import * as React from 'react';
import { LocationPoint } from '@/components/map/Markers';
import { updateScheduleItemLatLng } from '@/lib/storage';

interface LocationAutoCorrectProps {
  points: LocationPoint[];
}

// 初期データのダミー座標（全て同一になってしまっている値）
const DUMMY_LAT = 28.3764;
const DUMMY_LNG = 129.4936;

export function LocationAutoCorrect({ points }: LocationAutoCorrectProps) {
  React.useEffect(() => {
    let cancelled = false;

    const run = async () => {
      // GeocoderはMapの外でも利用可能
      const geocoder = new google.maps.Geocoder();

      for (const p of points) {
        if (cancelled) break;
        // ダミー座標のものを自動補正
        if (Math.abs(p.lat - DUMMY_LAT) < 1e-6 && Math.abs(p.lng - DUMMY_LNG) < 1e-6) {
          try {
            const q = `${p.placeName || p.title} 奄美`;
            const resp = await geocoder.geocode({ address: q });
            const result = resp.results?.[0];
            if (result?.geometry?.location) {
              const lat = result.geometry.location.lat();
              const lng = result.geometry.location.lng();
              updateScheduleItemLatLng(p.itemId, lat, lng);
            }
          } catch (e) {
            // 失敗時はスキップ
          }
          // 呼び出し間隔（軽いレート制御）
          await new Promise((r) => setTimeout(r, 250));
        }
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [points]);

  return null;
}


