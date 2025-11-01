export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

if (!GOOGLE_MAPS_API_KEY) {
  throw new Error('Google Maps APIキーが設定されていません');
}

console.log('APIキーが読み込まれました:', GOOGLE_MAPS_API_KEY.substring(0, 10) + '...');