export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

if (!GOOGLE_MAPS_API_KEY && typeof window === 'undefined') {
  // サーバーサイド（ビルド時）では警告のみ（クライアントサイドでチェックされる）
  console.warn('Google Maps APIキーが設定されていません。環境変数 NEXT_PUBLIC_GOOGLE_MAPS_API_KEY を設定してください。');
} else if (GOOGLE_MAPS_API_KEY && typeof window !== 'undefined') {
console.log('APIキーが読み込まれました:', GOOGLE_MAPS_API_KEY.substring(0, 10) + '...');
}