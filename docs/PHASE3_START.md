# Phase 3 開始ガイド

## 📊 Phase 2 進捗確認

### ✅ 完了項目

Phase 2は以下の項目がすべて完了しています：

- ✅ ツアー内容セクション実装
- ✅ ツアー日程セクション実装
- ✅ チェック機能（LocalStorage保存）
- ✅ 進捗表示
- ✅ 割り勘・立替機能実装
- ✅ 計算・清算機能
- ✅ CSVエクスポート機能

**進捗率: 50%** ✅

---

## 🚀 Phase 3 開始準備

Phase 3では、Google Maps APIを使って地図機能を実装します。

### Phase 3 の目標

1. **Google Maps APIの設定**
2. **地図表示の実装**
3. **マーカー表示の実装**
4. **経路案内機能の実装**
5. **日程連携機能の実装**

**目標進捗率: 50% → 80%**

---

## 📝 実装前の準備

### 핃 Step 1: Google Maps APIキーの取得

**重要**: まず、Google Maps APIキーを取得してください。

**手順：**
1. 📖 [`docs/GOOGLE_MAPS_SETUP.md`](./GOOGLE_MAPS_SETUP.md) を開く
2. ガイドに従ってAPIキーを取得
3. `.env.local`ファイルにAPIキーを設定

**所要時間**: 約15-20分

### Step 2: わけん確認

APIキーを設定したら、以下を確認：

```bash
# 開発サーバーを起動
npm run dev
```

ブラウザで `http://localhost:3000/map` にアクセスし、エラーが出ないことを確認してください。

---

## 🎯 Phase 3 実装計画

### 3.1 Google Maps基本統合（50% → 58%）

#### 実装タスク

1. **環境変数の読み込み設定**
   - `src/lib/maps/config.ts` を作成
   - APIキーを環境変数から取得

2. **Google Maps Script Loader**
   - `components/map/GoogleMapsLoader.tsx` を作成
   - `@react-google-maps/api`の`useLoadScript`を使用

3. **地図表示コンポーネント**
   - `components/map/Map.tsx` を作成
   - 奄美大島の中心座標を設定
   - 初期ズームレベルを設定

4. **マーカー表示**
   - `components/map/Marker.tsx` を作成
   - 日程データからマーカーを生成
   - タイプ別の色分け実装

### 3.2 経路案内機能実装（58% → 70%）

1. **FromTo選択UI**
2. **現在地取得機能**
3. **Directions API統合**
4. **経路表示機能**

### 3.3 日程連携機能（70% → 75%）

1. **URLパラメータ対応**
2. **自動表示機能**

### 3.4 動作確認（75% → 80%）

1. **全機能の動作確認**
2. **レスポンシブデザイン確認**
3. **エラーハンドリング確認**

---

## 🛠 Priorit Implementation (最優先実装)

まず、以下の順番で実装を進めます：

1. ✅ **Google Maps API設定ガイド作成** ← 完了
2. ⬜ **環境変数の読み込み設定**
3. ⬜ **地図表示コンポーネント**
4. ⬜ **マーカー表示**

---

## 📌 注意事項

### APIキーの管理

- ✅ `.env.local`ファイルにAPIキーを設定（Gitにコミットしない）
- ✅ APIキーの制限設定を必ず行う（セキュリティ）
- ✅ 本番環境（Vercel）にも環境変数を設定する必要があります

### 料金管理

- Google Maps APIは無料枠がありますが、使用量に注意
- 定期的に使用量を確認することを推奨

---

## 📚 参考ドキュメント

- [Google Maps API設定ガイド](./GOOGLE_MAPS_SETUP.md)
- [機能仕様書](./specification.md) - 5.4ข้อ GoogleMap機能
- [作業手順書](./procedure.md) - Phase 3

---

## ✅ 次のアクション

1. **まず**: [`docs/GOOGLE_MAPS_SETUP.md`](./GOOGLE_MAPS_SETUP.md) を読んで、APIキーを取得してください
2. **次に**: APIキーを`.env.local`に設定してください
3. **その後**: 実装を開始します

準備ができたら、お知らせください！🚀

