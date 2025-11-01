'use client';

import * as React from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { GOOGLE_MAPS_API_KEY } from '@/lib/maps/config';

interface GoogleMapsLoaderProps {
  children: React.ReactNode;
}

const libraries: ("places")[] = ['places'];

export function GoogleMapsLoader({ children }: GoogleMapsLoaderProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  if (loadError) {
    return (
      <div className="p-4 rounded-lg border border-pastel-300 bg-white text-pastel-900">
        Google Mapsの読み込みに失敗しました。時間をおいて再度お試しください。
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="p-4 rounded-lg border border-pastel-300 bg-white text-pastel-900">
        地図を読み込み中...
      </div>
    );
  }

  return <>{children}</>;
}


