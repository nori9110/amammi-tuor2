# 奄美大島旅行しおりアプリケーション 機能仕様書

## 1. ドキュメント情報

| 項目 | 内容 |
|------|------|
| ドキュメント名 | 奄美大島旅行しおりアプリケーション 機能仕様書 |
| バージョン | 1.0 |
| 作成日 | 2024-12-XX |
| 最終更新日 | 2024-12-XX |
| 作成者 | - |
| 関連ドキュメント | 要件定義書 Ver2 (`requirements.md`) |

---

## 2. システム概要

### 2.1 システム目的
奄美大島旅行のしおり機能を提供するWebアプリケーション。参加メンバー間で旅行工程の進捗をリアルタイム共有し、Google Mapsを用いた案内機能を提供する。

### 2.2 対象ユーザー
- 奄美大島旅行の参加メンバー（8名：岡部夫婦・伊藤夫婦・今井夫婦・小野夫婦）
- 主な利用環境：スマートフォン、タブレット、PC

### 2.3 システム特性
- リアルタイム進捗共有
- レスポンシブデザイン対応
- オフライン機能（一部）
- モダンで洗練されたUI/UX

---

## 3. 技術スタック

### 3.1 フロントエンド

#### 3.1.1 コア技術
- **言語**: JavaScript (ES6+)
- **フレームワーク**: React 18.x または Next.js 14.x（推奨：モダンUI実現）
- **状態管理**: React Context API / Zustand
- **UIライブラリ**: 
  - Tailwind CSS 3.x（スタイリング）
  - shadcn/ui または Radix UI（コンポーネント）
- **アニメーション**: Framer Motion
- **フォーム管理**: React Hook Form

#### 3.1.2 地図機能
- **Google Maps JavaScript API**: 地図表示、マーカー、経路検索
- **Google Maps Directions API**: 経路案内
- **@react-google-maps/api**: React用Google Mapsライブラリ

#### 3.1.3 その他ライブラリ
- **日付処理**: date-fns
- **HTTP通信**: Fetch API / Axios
- **アイコン**: Luc-lucide-react または Heroicons
- **印刷**: window.print()（ブラウザ標準）

### 3.2 バックエンド

#### 3.2.1 実行環境
- **プラットフォーム**: Vercel Serverless Functions
- **ランタイム**: Node.js 18.x / 20.x
- **言語**: JavaScript (ES6+)

#### 3.2.2 API実装
- **フレームワーク**: なし（Vercel Functionsは単一ファイル関数）
- **ルーティング**: Vercelのファイルベースルーティング
- **認証**: なし（メンバーのみ公開のため認証不要）

### 3.3 データベース

#### 3.3.1 データストア
- **プライマリ**: Vercel KV（Redis互換）
  - 進捗データの保存・同期
  - セッション管理
  - キャッシュ
  
#### 3.3.2 代替案（検討）
- **Vercel Postgres**: リレーショナルデータが必要な場合
- **Vercel Blob Storage**: ファイル保存が必要な場合

### 3.4 インフラストラクチャ

#### 3.4.1 ホスティング
- **プラットフォーム**: Vercel
- **CDN**: Vercel Edge Network（自動）
- **ドメイン**: Vercel カスタムドメイン対応

#### 3.4.2 デプロイメント
- **CI/CD**: Vercel Git統合（自動デプロイ）
- **環境変数**: Vercel Environment Variables
- **プレビュー環境**: Vercel Preview Deployments

### 3.5 開発ツール

#### 3.5.1 ビルドツール
- **バンドラー**: Vite または Next.js（ビルトイン）
- **パッケージマネージャー**: npm / yarn / pnpm
- **型チェック**: TypeScript（推奨）または JSDoc

#### 3.5.2 コード品質
- **Linter**: ESLint
- **Formatter**: Prettier
- **テスト**: Vitest（ユニットテスト）、Playwright（E2Eテスト）

---

## 4. システムアーキテクチャ

### 4.1 全体構成

```
┌─────────────────────────────────────────────────┐
│           Frontend (React/Next.js)              │
│  - UI Components                                │
│  - State Management                             │
│  - Google Maps Integration                      │
│  - LocalStorage (Offline Cache)                 │
└───────────────┬─────────────────────────────────┘
                │
                │ HTTPS (REST API / WebSocket)
                │
┌───────────────▼─────────────────────────────────┐
│      Vercel Serverless Functions                │
│  - /api/schedule (進捗データ)                   │
│  - /api/expenses (割り勘データ)                 │
│  - /api/sync (同期機能)                         │
└───────────────┬─────────────────────────────────┘
                │
        ┌───────┴───────┐
        │               │
┌───────▼─────┐  ┌──────▼──────────┐
│ Vercel KV   │  │ Google Maps API │
│ (Redis)     │  │ - Maps          │
│ - Schedule  │  │ - Directions    │
│ - Expenses  │  │ - Places        │
│ - Sessions  │  └─────────────────┘
└─────────────┘
```

### 4.2 データフロー

#### 4.2.1 進捗データ同期フロー
```
1. ユーザーがチェックボックスを操作
   ↓
2. フロントエンドで即座にUI更新（楽観的更新）
   ↓
3. LocalStorageに一時保存
   ↓
4. API `/api/schedule` に送信
   ↓
5. Vercel KVに保存
   ↓
6. 他端末に通知（ポーリングまたはWebSocket）
   ↓
7. 全端末で同期完了
```

#### 4.2.2 割り勘データフロー
```
1. ユーザーが費用項目を追加/編集
   ↓
2. フロントエンドでバリデーション
   ↓
3. API `/api/expenses` に送信
   ↓
4. Vercel KVに保存
   ↓
5. 計算処理（サーバー側で再計算）
   ↓
6. 結果をフロントエンドに返却
```

---

## 5. 機能仕様詳細

### 5.1 トップページ

#### 5.1.1 機能概要
旅行の全体概要、進捗状況、ナビゲーションメニューを表示するダッシュボード。

#### 5.1.2 表示項目

##### A. しおりの目的
- **項目**: 旅行の目的を簡潔に表示
- **表示形式**: カード型コンポーネント
- **データソース**: 静的データ（`data.js`から読み込み）

##### B. 旅行工程の進捗状況
- **進捗率表示**
  - プログレスバー（円形または線形）
  - パーセンテージ表示
  - 完了項目数 / 全項目数（例: 15/32）
- **リセット機能**
  - ボタン: 「全体リセット」
  - 確認ダイアログ表示
  - 全チェック状態をfalseにリセット
  - API `/api/schedule/reset` を呼び出し

##### C. ツアーコンダクター
- **表示項目**: 担当者名、連絡先（オプション）
- **表示形式**: カード型

##### D. 持ち物セクション
- **表示項目**: 持ち物リスト（チェックリスト形式）
- **データ保存**: LocalStorage（個人別）または Vercel KV（共有）

##### E. 反省会情報
- **表示項目**: 日時、場所、参加者
- **表示形式**: カード型

#### 5.1.3 UI/UX要件

##### レスポンシブデザイン
- **ブレークポイント**:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px
- **基準デバイス**: iPhone SE（375px）を最小基準

##### ダークモード/ライトモード
- **切り替え方法**: ヘッダーのトグルボタン
- **保存**: LocalStorage（`theme`キー）
- **適用範囲**: 全ページ

##### ナビゲーション
- **メニュー構成**:
  - ツアー内容
  - ツアー日程
  - GoogleMap
  - 割り勘・立替
- **スクロール**: スムーズスクロール（`scroll-behavior: smooth`）
- **トップへ戻るボタン**: スクロール時に表示（フローティングボタン）

##### 印刷機能
- **実装**: `window.print()`
- **印刷用CSS**: `@media print` でスタイル調整
- **印刷対象**: 日程表、持ち物リスト、割り勘結果

### 5.2 ツアー内容セクション

#### 5.2.1 参加メンバー

##### 機能仕様
- **表示項目**: 
  - メンバー名（8名）
  - 家族グループ（岡部・小野・今井・伊藤）
- **表示形式**: カードグリッド（2列×4行、レスポンシブ）
- **データソース**: 静的データ

##### UIコンポーネント
```
<MemberCard>
  - 家族名（ヘッダー）
  - メンバー1名
  - メンバー2名
  - アイコン（オプション）
</MemberCard>
```

#### 5.2.2 旅の目的

##### 機能仕様
- **表示項目**: 目的リスト（既存データ継承）
- **表示形式**: リストまたはカード形式
- **データソース**: 静的データ

#### 5.2.3 注意事項

##### 機能仕様
- **表示項目**: 重要な注意事項
- **表示形式**: 警告カード（黄色背景、アイコン付き）
- **スタイル**: 既存デザイン継承

#### 5.2.4 係り分担

##### 機能仕様
- **表示項目**: 
  - 係名（班長、風紀係、宴会係、YouTube係、会計係、食事係、お助け係、副班長）
  - 担当者名
  - 役割説明
- **表示形式**: カードグリッド（2列×4行、レスポンシブ）

##### UIコンポーネント
```
<RoleCard>
  - 係名（タイトル）
  - 担当者名
  - 役割説明（本文）
  - アイコン（オプション）
</RoleCard>
```

### 5.3 ツアー日程セクション

#### 5.3.1 基本機能

##### 日程表示
- **日付別表示**: 11月3日、4日、5日
- **項目表示**:
  - 時刻（`time`）
  - 活動内容（`activity`、HTML対応）
  - 備考（`note`、オプション）
  - チェックボックス（`checked`）
  - 場所情報（`location`）
  - ウェブサイトリンク（`website`）
  - タイプ（`type`：sightseeing/restaurant/hotel/activity）

##### チェック機能
- **実装**: 
  - チェックボックス操作で即座にUI更新
  - API `/api/schedule/check` に送信
  - 楽観的更新（Optimistic Update）
- **エラーハンドリング**:
  - ネットワークエラー時はLocalStorageに一時保存
  - 再接続時に自動同期

##### 進捗表示
- **完了項目の視覚的フィードバック**:
  - 打ち消し線（`text-decoration: line-through`）
  - グレーアウト（`opacity: 0.6`）
  - チェックアイコン表示
- **全項目完了時**:
  - 通知アラート表示（トースト通知）
  - アニメーション（confettiなど、オプション）

#### 5.3.2 データ構造

```typescript
interface ScheduleItem {
  id: string;                    // ユニークID（例: "item-1"）
  time: string;                  // 時刻（例: "6:30"）
  activity: string;              // 活動内容（HTML対応）
  note?: string;                 // 備考（オプション）
  checked: boolean;              // チェック状態
  location: {
    name: string;                // 場所名
    lat: number;                 // 緯度
    lng: number;                 // 経度
    address: string;             // 住所
  };
  website?: string;              // ウェブサイトURL（オプション）
  type: "sightseeing" | "restaurant" | "hotel" | "activity";
}

interface ScheduleDate {
  date: string;                  // 日付（ISO形式: "2024-11-03"）
  dateLabel: string;             // 表示用ラベル（例: "11月3日（月曜日）"）
  items: ScheduleItem[];
}

interface ScheduleData {
  schedule: ScheduleDate[];
  lastUpdated: string;           // ISO形式タイムスタンプ
  version: number;               // データバージョン
}
```

#### 5.3.3 ウェブサイトリンク機能

##### 機能仕様
- **リンク表示**:
  - 施設名をクリック可能なリンクとして表示
  - 外部リンクアイコン表示（`<ExternalLink>`）
  - 新規タブで開く（`target="_blank"`）
  - セキュリティ属性: `rel="noopener noreferrer"`
- **リンクがない場合**:
  - Google検索へのリンクを表示
  - GPS: `https://www.google.com/search?q={施設名}`
- **実装済みURL**: 要件定義書4.1.1参照（13件）

##### UIコンポーネント
```
<WebsiteLink>
  - 施設名（リンクテキスト）
  - 外部リンクアイコン
  - URL（`website`またはGoogle検索URL）
</WebsiteLink>
```

#### 5.3.4 地図連携

##### 機能仕様
- **「地図で表示」リンク**:
  - 各日程項目に配置
  - クリックで地図ページ（`/map`）に遷移
  - URLパラメータ: `?location={item-id}`
- **地図ページでの動作**:
  - URLパラメータから`item-id`を取得
  - 該当マーカーをハイライト
  - 情報ウィンドウを自動表示

### 5.4 GoogleMap機能

#### 5.4.1 基本機能

##### 地図表示
- **初期表示**:
  - 奄美大島の中心座標（例: 28.3764, 129.4936）
  - ズームレベル: 11-12
- **地図操作**:
  - ズームイン/アウト（マウスホイール、ピンチ操作）
  - ドラッグ移動
  - フルスクリーンモード（オプション）

##### 実装技術
- **ライブラリ**: `@react-google-maps/api`
- **API**: Google Maps JavaScript API

#### 5.4.2 マーカー表示

##### 機能仕様
- **マーカー配置**: 日程に含まれる主要地点に自動配置
- **マーカー色分け一遍**:
  - 観光地: 青色（`#4285F4`）
  - 食事処: 赤色（`#EA4335`）
  - ホテル: 緑色（`#34A853`）
  - アクティビティ: 黄色（`#FBBC04`）
- **時刻ラベル**:
  - マーカー上に時刻を表示（カスタムラベル）
  - フォント: 12px、太字、白文字
- **情報ウィンドウ（InfoWindow）**:
  - マーカークリックで表示
  - 表示内容:
    - 時刻
    - 活動内容
    - 場所名
    - ウェブサイトリンク（存在する場合）
    - 「この場所を起点にする」「この場所を目的地にする」ボタン

##### UIコンポーネント
```
<GoogleMap>
  <Marker>
    - 位置（lat, lng）
    - 色（typeに基づく）
    - 時刻ラベル
    - onClick → InfoWindowMonth
  </Marker>
  <InfoWindow>
    - 日程情報
    - ウェブサイトリンク
    - アクションボタン
  </InfoWindow>
</GoogleMap>
```

#### 5.4.3 経路案内機能（FromTo）

##### 機能仕様

**出発地点（From）の指定**:
- **選択方法**:
  1. 日程項目から選択（ドロップダウン）
  2. マーカーから選択（「起点にする」ボタン）
  3. 現在地（GPS）から選択（「現在地から」ボタン）
- **現在地取得**:
  - ブラウザのGeolocation APIを使用
  - 権限リクエスト表示
  - エラーハンドリング（権限拒否、取得失敗）

**到着地点（To）の指定**:
- **選択方法**:
  1. 日程項目から選択（ドロップダウン）
  2. マーカーから選択（「目的地にする」ボタン）

**経路表示**:
- **交通手段選択**:
  - 徒歩（`walking`）
  - 車（`driving`）
  - 公共交通機関（`transit`）
- **経路情報表示**:
  - 距離（km）
  - 所要時間（分）
  - 経路のポリライン表示（地図上）
- **Google Mapsアプリリンク**:
  - 「Google Mapsで開く」ボタン
  - URL形式: `https://www.google.com/maps/dir/{from}/{to}`

##### API使用
- **Google Maps Directions API**:
  - エンドポイント: `https://maps.googleapis.com/maps/api/directions/json`
  - パラメータ:
    - `origin`: 出発地点（座標または住所）
    - `destination`: 到着地点
    - `mode`: walking/driving/transit
    - `key`: APIキー（環境変数から取得）

##### UIコンポーネント
```
<RouteSearch>
  <FromSelector>
    - 日程項目ドロップダウン
    - 「現在地から」ボタン
    - 現在選択中の地点表示
  </FromSelector>
  <ToSelector>
    - 日程項目ドロップダウン
    - 現在選択中の地点表示
  </ToSelector>
  <TransportModeSelector>
    - ラジオボタン（徒歩/車/公共交通機関）
  </TransportModeSelector>
  <RouteInfo>
    - 距離表示
    - 所要時間表示
    - 「Google Mapsで開く」ボタン
  </RouteInfo>
  <DirectionsRenderer>
    - 経路のポリライン表示
  </DirectionsRenderer>
</RouteSearch>
```

#### 5.4.4 日程連携

##### URLパラメータ対応
- **パラメータ**: `?location={item-id}`
- **処理フロー**:
  1. ページロード時にURLパラメータを解析
  2. `item-id`に該当するマーカーを検索
  3. 該当マーカーを中心に地図を移動（`map.panTo()`）
  4. ズームレベルを調整（例: 15）
  5. 情報ウィンドウを自動表示

##### 実装例
```javascript
// URLパラメータ解析
const urlParams = new URLSearchParams(window.location.search);
const locationId = urlParams.get('location');

if (locationId) {
  // 該当マーカーを検索
  const marker = markers.find(m => m.itemId === locationId);
  if (marker) {
    // 地図を移動
    map.panTo({ lat: marker.lat, lng: marker.lng });
    map.setZoom(15);
    // 情報ウィンドウ 측示
    infoWindow.open(map, marker);
  }
}
```

### 5.5 割り勘・立替機能

#### 5.5.1 家族設定

##### 機能仕様
- **家族構成**:
  - 岡部家族（2名）
  - 小野家族（2名）
  - 今井家族（2名）
  - 伊藤家族（2名）
  - 合計: 8名
- **表示形式**: 家族別カード表示（4枚のカード）
- **データソース**: 静的データ（編集不可）

##### UIコンポーネント
```
<FamilyCard>
  - 家族名（ヘッダー）
  - メンバー1名
  - メンバー2名
  - 支払額（計算結果）
  - 負担額（計算結果）
</FamilyCard>
```

#### 5.5.2 費用項目管理

##### 費用項目の追加
- **入力項目**:
  - 日付（日付ピッカー）
  - 項目名（テキスト入力）
  - 立替者（選択: 岡部・小野・今井・伊藤・現地）
  - 計算方式（選択: 固定単価×人数 / 家族均等 / 部屋按分 둓レッタ特別）
  - 金額（数値入力）
  - 参加者（チェックボックス: 8名）
  - 集計対象フラグ（チェックボックス）
  - 備考（テキストエリア、オプション）
- **バリデーション**:
  - 項目名: 必須、最大100文字
  - 金額: 必須、0以上の数値
  - 参加者: 1名以上選択必須

##### 費用項目の編集
- **編集方法**: 項目カードの「編集」ボタン
- **編集内容**: 追加時と同じ入力項目
- **保存**: API `/api/expenses/{id}` (PUT)

##### 費用項目の削除
- **削除方法**: 項目カードの「削除」ボタン
- **確認ダイアログ**: 「削除しますか？」表示
- **保存**: API `/api/expenses/{id}` (DELETE)

##### 計算方式の詳細

**1. 固定単価×人数（`fixedPerPerson`）**
- **計算式**: `金額 = 単価 × 参加者数`
- **入力**: 単価（`unitPrice`）
- **例**: 単価500円 × 8名 = 4,000円

**2. 家族均等（`perFamily`）**
- **計算式**: `1家族あたり = 総額 ÷ 参加家族数`
- **入力**: 総額（`amount`）
- **例**: 総額8,000円 ÷ 4家族 = 2,000円/家族

**3. 部屋按分（`perRoom`）**
- **計算式**: `1部屋あたり = 金額 ÷ 部屋数`
- **入力**: 金額（`amount`）、部屋数（`rooms`）
- **例**: 10,000円 ÷ 2部屋 = 5,000円/部屋

**4. カレッタ特別（`caretta`）**
- **計算式**: 
  - 基本: `4,800円 × 参加者数`
  - 余り: `総額 - (4,800円 × 参加者数)`
- **入力**: 総額（`amount`）
- **例**: 総額40,000円、8名 → 基本38,400円、余り1,600円

##### 集計対象フラグ
- **機能**: チェックボックスで集計対象の切り替え
- **動作**: チェックが外れた項目は計算から除外
- **表示**: グレーアウト表示

#### 5.5.3 データ構造

```typescript
interface Expense {
  id: string;                    // UUID
  date: string;                  // ISO形式日付（例: "2024-11-03"）
  title: string;                 // 項目名
  payer: "okabe" | "ono" | "imai" | "ito" | "local";
  method: "fixedPerPerson" | "perFamily" | "perRoom" | "caretta";
  amount: number;                // 金額（総額または単価）
  unitPrice?: number;            // 単価（fixedPerPersonの場合）
  rooms?: number;                // 部屋数（perRoomの場合）
  participants: string[];        // 参加者IDリスト（例: ["okabe-1", "okabe-2"]）
  checked: boolean;              // 集計対象フラグ
  note?: string;                 // 備考
  createdAt: string;             // ISO形式タイムスタンプ
  updatedAt: string;             // ISO形式タイムスタンプ
}

interface ExpenseData {
  expenses: Expense[];
  lastUpdated: string;
  version: number;
}
```

#### 5.5.4 計算・清算機能

##### 各家族の支払額・負担額の計算

**計算ロジック**:
1. **集計対象項目のフィルタリング**: `checked === true` の項目のみ
2. **各項目の計算**:
   - 計算方式に応じて、各家族・各参加者の負担額を計算
   - 参加者IDから家族を特定
3. **家族ごとの集計**:
   - **支払額**: その家族が立替えた金額の合計
   - **負担額**: その家族が負担すべき金額の合計
4. **小計表示**: 各家族の支払額・負担額を表示

**計算例**:
```
岡部家族:
  支払額: 10,000円（項目Aを立替）
  負担額: 12,000円（項目A: 5,000円 + 項目B: 7,000円）
  差額: -2,000円（2,000円を受け取る）
```

##### 清算結果表示

**清算ロジック**:
1. **各家族の差額を計算**: `差額 = 支払額 - 負担額`
   - 正の値: 受け取る金額
   - 負の値: 支払う金額
2. **最小転送回数で清算**:
   - 最大の受け取り額を持つ家族を特定
   - 最大の支払い額を持つ家族から受け取り家族へ送金
   - これを繰り返して清算
3. **丸め処理**: 1円単位（端数そのまま）

**表示形式**:
```
清算結果:
  小野 → 岡部: 2,000円
  今井 → 岡部: 1,500円
  伊藤 → 岡部: 500円
```

##### UIコンポーネント
```
<ExpenseSummary>
  <FamilySummary>
    - 家族名
    - 支払額
    - 負担額
    - 差額（色分け: 受け取り/支払い）
  </FamilySummary>
  <SettlementResult>
    - 清算表（誰が誰にいくら支払うか）
    - 合計金額
  </SettlementResult>
</ExpenseSummary>
```

#### 5.5.5 データ管理

##### データ保存
- **API**: `/api/锁enses` (POST/PUT/DELETE)
- **ストレージ**: Vercel KV
- **フォールバック**: LocalStorage（オフライン時）

##### CSVエクスポート機能
- **エクスポート内容**:
  - 項目一覧（日付、項目名、立替者、金額、参加者、備考）
  - 清算結果（家族ごとの支払額・負担額・差額）
- **ファイル名**: `割り勘_${日付}.csv`
- **実装**: フロントエンドで生成（Blob API使用）

---

## 6. API仕様

### 6.1 エンドポイント一覧

#### 6.1.1 進捗データAPI

##### GET /api/schedule
**説明**: 日程データを取得

**リクエスト**:
```http
GET /api/schedule
```

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "schedule": [
      {
        "date": "2024-11-03",
        "dateLabel": "11月3日（月曜日）",
        "items": [
          {
            "id": "item-1",
            "time": "6:30",
            "activity": "羽田第1ターミナル第3時計台に集合",
            "note": "朝食は各自用意をしておく",
            "checked": false,
            "location": {
              "name": "羽田空港第1ターミナル",
              "lat": 35.5494,
              "lng": 139.7798,
              "address": "東京都大田区羽田空港"
            },
            "website": "https://example.com",
            "type": "sightseeing"
          }
        ]
      }
    ],
    "lastUpdated": "2024-11-03T10:30:00Z",
    "version": 1
  }
}
```

**エラーレスポンス**:
```json
{
  "success": false,
  "error": "Error message"
}
```

##### PUT /api/schedule/check
**説明**: チェック状態を更新

**リクエスト**:
```http
PUT /api/schedule/check
Headers:
  Content-Type: application/json
Body:
{
  "itemId": "item-1",
  "checked": true
}
```

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "itemId": "item-1",
    "checked": true,
    "updatedAt": "2024-11-03T10:35:00Z"
  }
}
```

##### POST /api/schedule/reset
**説明**: 全チェック状態をリセット

**リクエスト**:
```http
POST /api/schedule/reset
```

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "resetAt": "2024-11-03T10:40:00Z"
  }
}
```

#### 6.1.2 割り勘データAPI

##### GET /api/expenses
**説明**: 費用項目一覧を取得

**リクエスト**:
```http
GET /api/expenses
```

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "expenses": [
      {
        "id": "uuid-1",
        "date": "2024-11-03",
        "title": "ランチ代",
        "payer": "okabe",
        "method": "fixedPerPerson",
        "amount": 4000,
        "unitPrice": 500,
        "participants": ["okabe-1", "okabe-2", "ono-1", "ono-2"],
        "checked": true,
        "note": "",
        "createdAt": "2024-11-03T12:00:00Z",
        "updatedAt": "2024-11-03T12:00:00Z"
      }
    ],
    "lastUpdated": "2024-11-03T12:00:00Z",
    "version": 1
  }
}
```

##### POST /api/expenses
**説明**: 費用項目を追加

**リクエスト**:
```http
POST /api/expenses
Headers:
  Content-Type: application/json
Body:
{
  "date": "2024-11-03",
  "title": "ランチ代",
  "payer": "okabe",
  "method": "fixedPerPerson",
  "amount": 4000,
  "unitPrice": 500,
  "participants": ["okabe-1", "okabe-2"],
  "checked": true,
  "note": ""
}
```

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "id": "uuid-1",
    "date": "2024-11-03",
    "title": "ランチ代",
    "payer": "okabe",
    "method": "fixedPerPerson",
    "amount": 4000,
    "unitPrice": 500,
    "participants": ["okabe-1", "okabe-2"],
    "checked": true,
    "note": "",
    "createdAt": "2024-11-03T12:00:00Z",
    "updatedAt": "2024-11-03T12:00:00Z"
  }
}
```

##### PUT /api/expenses/{id}
**説明**: 費用項目を更新

**リクエスト**:
```http
PUT /api/expenses/{id}
Headers:
  Content-Type: application/json
Body:
{
  "title": "ランチ代（修正）",
  "amount": 4500
}
```

**レスポンス**: POST /api/expenses と同じ形式

##### DELETE /api/expenses/{id}
**説明**: 費用項目を削除

**リクエスト**:
```http
DELETE /api/expenses/{id}
```

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "id": "uuid-1",
    "deletedAt": "2024-11-03T12:05:00Z"
  }
}
```

##### GET /api/expenses/calculation
**説明**: 清算結果を取得

**リクエスト**:
```http
GET /api/expenses/calculation
```

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "families": [
      {
        "family": "okabe",
        "paid": 10000,
        "owed": 8000,
        "difference": 2000
      },
      {
        "family": "ono",
        "paid": 5000,
        "owed": 7000,
        "difference": -2000
      }
    ],
    "settlement": [
      {
        "from": "ono",
        "to": "okabe",
        "amount": 2000
      }
    ]
  }
}
```

### 6.2 エラーハンドリング

#### 6.2.1 HTTPステータスコード
- **200 OK**: 成功
- **400 Bad Request**: リクエストエラー（バリデーション失敗など）
- **404 Not Found**: リソース不存在
- **500 Internal Server Error**: サーバーエラー

#### 6.2.2 エラーレスポンス形式
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "項目名は必須です",
    "details": {
      "field": "title",
      "reason": "required"
    }
  }
}
```

---

## 7. データベース設計

### 7.1 Vercel KVスキーマ

#### 7.1.1 進捗データ（Schedule）

**キー**: `schedule:main`

**値（JSON）**:
```json
{
  "schedule": [
    {
      "date": "2024-11-03",
      "dateLabel": "11月3日（月曜日）",
      "items": [
        {
          "id": "item-1",
          "time": "6:30",
          "activity": "羽田第1ターミナル第3時計台に集合",
          "note": "朝食は各自用意をしておく",
          "checked": false,
          "location": {
            "name": "羽田空港第1ターミナル",
            "lat": 35.5494,
            "lng": 139.7798,
            "address": "東京都大田区羽田空港"
          },
          "website": "https://example.com",
          "type": "sightseeing"
        }
      ]
    }
  ],
  "lastUpdated": "2024-11-03T10:30:00Z",
  "version": 1
}
```

**TTL**: なし（永続保存）

#### 7.1.2 割り勘データ（Expenses）

**キー**: `expenses:main`

**値（JSON）**:
```json
{
  "expenses": [
    {
      "id": "uuid-1",
      "date": "2024-11-03",
      "title": "ランチ代",
      "payer": "okabe",
      "method": "fixedPerPerson",
      "amount": 4000,
      "unitPrice": 500,
      "participants": ["okabe-1", "okabe-2"],
      "checked": true,
      "note": "",
      "createdAt": "2024-11-03T12:00:00Z",
      "updatedAt": "2024-11-03T12:00:00Z"
    }
  ],
  "lastUpdated": "2024-11-03T12:00:00Z",
  "version": 1
}
```

**TTL**: なし（永続保存）

### 7.2 データアクセスパターン

#### 7.2.1 読み取り
- **頻度**: 高（ページロード時、定期的なポーリング）
- **最適化**: キャッシュ（Vercel KVのキャッシュ機能を活用）

#### 7.2.2 書き込み
- **頻度**: 中（チェック状態更新、費用項目追加）
- **競合制御**: 楽観的ロック（`version`フィールドを使用）

---

## 8. UI/UX設計

### 8.1 デザインシステム

#### 8.1.1 カラーパレット

**ライトモード**:
- **プライマリ**: `#3B82F6` (Blue-500)
- **セカンダリ**: `#10B981` (Green-500)
- **アクセント**: `#F59E0B` (Amber-500)
- **背景**: `#FFFFFF` (White)
- **テキスト**: `#1F2937` (Gray-800)
- **ボーダー**: `#E5E7EB` (Gray-200)

**ダークモード**:
- **プライマリ**: `#60A5FA` (Blue-400)
- **セカンダリ**: `#34D399` (Green-400)
- **アクセント**: `#FBBF24` (Amber-400)
- **背景**: `#111827` (Gray-900)
- **テキスト**: `#F9FAFB` (Gray-50)
- **ボーダー**: `#374151` (Gray-700)

#### 8.1.2 タイポグラフィ

**フォントファミリー**:
- **日本語**: `"Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif`
- **英語**: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`

**フォントサイズ**:
- **H1**: `2.5rem` (40px)
- **H2**: `2rem` (32px)
- **H3**: `1.5rem` (24px)
- **Body**: `1rem` (16px)
- **Small**: `0.875rem` (14px)

#### 8.1.3 スペーシング

**基準単位**: 4px

**スペーシングスケール**:
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px

#### 8.1.4 コンポーネントスタイル

##### ボタン
```css
/* プライマリボタン */
.btn-primary {
  background: #3B82F6;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #2563EB;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}
```

##### カード
```css
.card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

### 8.2 レスポンシブデザイン

#### 8.2.1 ブレークポイント
- **Mobile**: `< 640px`
- **Tablet**: `640px - 1024px`
- **Desktop**: `> 1024px`

#### 8.2.2 レイアウトグリッド
- **Mobile**: 1列
- **Tablet**: 2列
- **Desktop**: 3-4列（コンテンツに応じて）

### 8.3 アニメーション

#### 8.3.1 トランジション
- **標準**: `transition: all 0.2s ease-in-out`
- **ホバー**: `transform: translateY(-2px)`
- **クリック**: `transform: scale(0.98)`

#### 8.3.2 ページ遷移
- **フェードイン**: `opacity: 0 → 1` (300ms)
- **スライドイン**: `transform: translateX(-20px) → 0` (300ms)

### 8.4 アクセシビリティ

#### 8.4.1 WCAG 2.1準拠
- **レベル**: AA準拠を目標
- **コントラスト比**: 4.5:1以上（テキスト）
- **キーボード操作**: 全機能をキーボードで操作可能
- **スクリーンリーダー**: ARIA属性を適切に設定

#### 8.4.2 実装項目
- **フォーカス表示**: 明確なフォーカスリング
- **alt属性**: 画像に適切なalt属性
- **ラベル**: フォーム入力に適切なラベル
- **エラーメッセージ**: 明確なエラーメッセージ表示

---

## 9. セキュリティ仕様

### 9.1 アクセス制御

#### 9.1.1 公開範囲
- **アクセス**: メンバーのみ公開のため認証不要
- **制限方法**: URLを知っているメンバーのみアクセス可能（URLを非公開にする）
- **将来的な拡張**: 必要に応じて簡易認証を実装可能

### 9.2 データ保護

#### 9.2.1 暗号化
- **通信**: HTTPS（必須）
- **保存**: Vercel KVは暗号化保存（自動）

#### 9.2.2 機密情報管理
- **APIキー**: 環境変数で管理（`GOOGLE_MAPS_API_KEY`）
- **URL管理**: アプリケーションURLはメンバー間のみ共有

### 9.3 入力値検証

#### 9.3.1 フロントエンド
- **リアルタイムバリデーション**: React Hook Form
- **XSS対策**: Reactの自動エスケープ

#### 9.3.2 バックエンド
- **サーバーサイドバリデーション**: 必須
- **SQLインジェクション対策**: パラメータ化クエリ（Vercel KVは自動対応）

### 9.4 CORS設定

#### 9.4.1 許可オリジン
- **本番環境**: カスタムドメインのみ
- **開発環境**: `http://localhost:3000` など

---

## 10. パフォーマンス要件

### 10.1 目標値

#### 10.1.1 ページ読み込み
- **First Contentful Paint (FCP)**: < 1.5秒
- **Largest Contentful Paint (LCP)**: < 2.5秒
- **Time to Interactive (TTI)**: < 3.5秒

#### 10.1.2 API応答時間
- **進捗データ取得**: < 500ms
- **チェック状態更新**: < 300ms
- **割り勘計算**: < 1秒

#### 10.1.3 地図表示
- **初期表示**: < 2秒
- **マーカー表示**: < 1秒
- **経路検索**: < 3秒

### 10.2 最適化手法

#### 10.2.1 フロントエンド
- **コード分割**: React.lazy()で動的インポート
- **画像最適化**: Next.js Imageコンポーネント（使用時）
- **バンドルサイズ**: < 500KB（gzip圧縮後）

#### 10.2.2 バックエンド
- **キャッシュ**: Vercel KVのキャッシュ機能
- **CDN**: Vercel Edge Networkで自動配信奧

#### 10.2.3 データベース
- **インデックス**: 必要に応じて設定（Vercel KVは自動最適化）

---

## 11. 実装計画

### 11.1 開発フェーズ

#### Phase 1: プロジェクトセットアップ（1-2週間）
1. **プロジェクト初期化**
   - Next.jsまたはReact + Viteプロジェクト作成
   - 依存パッケージインストール
   - ESLint、Prettier設定
   - Gitリポジトリ初期化

2. **Vercel設定**
   - Vercelプロジェクト作成
   - 環境変数設定（Google Maps APIキーなど）
   - Vercel KVセットアップ
   - デプロイパイプライン設定

3. **UI基盤構築**
   - Tailwind CSS設定
   - デザインシステム実装（カラー、タイポグラフィ）
   - 共通コンポーネント作成（Button、Cardなど）
   - レイアウトコンポーネント作成

#### Phase 2: 基本機能実装（2-3週間）
1. **トップページ**
   - レイアウト実装
   - 進捗表示コンポーネント
   - ナビゲーションメニュー
   - ダークモード切替

2. **ツアー内容セクション**
   - 参加メンバー表示
   - 旅の目的表示
   - 注意事項表示
   - 係り分担表示

#### Phase 3: 日程機能実装（2-3週間）
1. **日程表示**
   - 日程リストコンポーネント
   - 日付別グループ化
   - チェックボックス機能

2. **進捗同期機能**
   - API `/api/schedule` 実装
   - Vercel KVへの保存・取得
   - 楽観的更新実装
   - オフライン対応（LocalStorageフォールバック）

3. **ウェブサイトリンク機能**
   - リンクコンポーネント実装
   - 外部リンクアイコン
   - Google検索フォールバック

#### Phase 4: 地図機能実装（2-3週間）
1. **Google Maps統合**
   - `@react-google-maps/api` セットアップ
   - 地図表示コンポーネント
   - マーカー表示（色分け、時刻ラベル）
   - 情報ウィンドウ実装

2. **経路検索機能**
   - FromTo選択UI
   - 現在地取得（Geolocation API）
   - Directions API統合
   - 経路表示（ポリライン）
   - Google Mapsアプリリンク

3. **日程連携**
   - URLパラメータ対応
   - マーカー自動表示

#### Phase 5: 割り勘機能実装（2-3週間）
1. **費用項目管理**
   - 項目追加・編集・削除UI
   - 計算方式選択UI
   - 参加者選択UI
   - バリデーション実装

2. **計算・清算機能**
   - 計算ロジック実装
   - 清算アルゴリズム実装
   - 結果表示UI

3. **データ管理**
   - API `/api/expenses` 実装
   - CSVエクスポート機能

#### Phase 6: リファインメント（1-2週間）
1. **UI/UX改善**
   - アニメーション追加
   - レスポンシブ調整
   - アクセシビリティ改善

2. **パフォーマンス最適化**
   - コード分割
   - キャッシュ網路
   - バンドルサイズ最適化

3. **テスト**
   - ユニットテスト
   - 統合テスト
   - E2Eテスト

4. **ドキュメント**
   - README更新
   - APIドキュメント作成

### 11.2 技術的負債・将来実装

#### 優先度: 高
- [ ] Google Maps APIキーの環境変数化
- [ ] エラーハンドリング強化
- [ ] オフライン対応の完全実装

#### 優先度: 中
- [ ] リアルタイム同期（WebSocket）
- [ ] プッシュ通知
- [ ] データバックアップ機能

#### 優先度: 低
- [ ] 多言語対応
- [ ] 簡易認証の実装（将来的に必要になった場合）

---

## 12. テスト仕様

### 12.1 テスト戦略

#### 12.1.1 テストレベル
- **ユニットテスト**: 個別関数・コンポーネント
- **統合テスト**: APIエンドポイント
- **E2Eテスト**: ユーザーシナリオ

#### 12.1.2 テストツール
- **ユニットテスト**: Vitest
- **コンポーネントテスト**: React Testing Library
- **E2Eテスト**: Playwright

### 12.2 テストケース（主要機能）

#### 12.2.1 進捗チェック機能
- [ ] チェックボックス操作でUI更新される
- [ ] APIに正しく送信される
- [ ] オフライン時はLocalStorageに保存される
- [ ] 再接続時に自動同期される

#### 12.2.2 地図機能
- [ ] 地図が正常に表示される
- [ ] マーカーが正しい位置に表示される
- [ ] 経路検索が正常に動作する
- [ ] 現在地取得が正常に動作する

#### 12.2.3 割り勘機能
- [ ] 費用項目の追加・編集・削除が正常に動作する
- [ ] 計算ロジックが正しい結果を返す
- [ ] 清算結果が正しく表示される
- [ ] CSVエクスポートが正常に動作する

---

## 13. 運用・保守

### 13.1 監視

#### 13.1.1 ログ
- **フロントエンド**: コンソールログ（開発環境のみ）
- **バックエンド**: Vercel Functions ログ
- **エラー**: Sentryなどのエラー追跡ツール（推奨）

#### 13.1.2 メトリクス
- **パフォーマンス**: Vercel Analytics
- **API使用量**: Google Maps API使用量監視
- **データベース**: Vercel KV使用量監視

### 13.2 バックアップ

#### 13.2.1 データバックアップ
- **自動バックアップ**: Vercel KVのスナップショット機能（将来実装）
- **手動バックアップ**: 定期的手動エクスポート（推奨）

### 13.3 アップデート

#### 13.3.1 依存パッケージ
- **更新頻度**: 月1回（セキュリティパッチは即座）
- **バージョン固定**: `package-lock.json`で固定

---

## 14. 付録

### 14.1 参考資料
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel KV Documentation](https://vercel.com/docs/storage/vercel-kv)
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [React Documentation](https://react.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### 14.2 用語集
- **Vercel KV**: Vercelが提供するRedis互換のキーバリューストア
- **Serverless Functions**: サーバーレス環境で実行される関数
- **楽観的更新**: UIを先に更新し、その後サーバーに送信する更新方式
- **TTL**: Time To Live、データの有効期限

---

**文書バージョン**: 1.0  
**最終更新日**: 2024-12-XX  
**次のレビュー予定**: 実装開始後、必要に応じて更新

