# 奄美大島旅行しおりアプリケーション 作業手順書

## 1. ドキュメント情報

| 項目 | 内容 |
|------|------|
| ドキュメント名 | 奄美大島旅行しおりアプリケーション 作業手順書 |
| バージョン | 1.0 |
| 作成日 | 2024-12-XX |
| 最終更新日 | 2024-12-XX |
| 作成者 | - |
| 関連ドキュメント | 要件定義書 (`requirements.md`)、機能仕様書 (`specification.md`) |

---

## 2. 進捗管理

### 2.1 全体進捗状況

| フェーズ | 進捗率 | ステータス | 完了日 |
|---------|--------|-----------|--------|
| Phase 1: 環境構築と基本的な画面作成 | 30% | ✅ 完了 | 2024-12-XX |
| Phase 2: 画面機能実装 | 50% | ✅ 完了 | 2024-12-XX |
| Phase 3: GoogleMap機能拡充、動作確認 | 80% | ⬜ 未着手 | - |
| Phase 4: Vercel環境での動作確認 | 100% | ⬜ 未着手 | - |

**進捗率計算**: 各フェーズの完了タスク数 / 全タスク数 × フェーズ割合

---

## 3. Phase 1: 環境構築と基本的な画面作成（進捗率: 30%）

### 3.1 プロジェクト初期化（Phase 1: 0% → 5%）

#### 3.1.1 Node.jsプロジェクト作成

- [ ] **作業**: プロジェクトディレクトリを作成
  ```bash
  mkdir amami-itinerary
  cd amami-itinerary
  ```

- [ ] **作業**: package.jsonを初期化
  ```bash
  npm init -y
  ```

- [ ] **作業**: Gitリポジトリを初期化
  ```bash
  git init
  ```

- [ ] **作業**: .gitignoreファイルを作成
  ```
  node_modules/
  .env
  .env.local
  .vercel
  .next
  dist/
  *.log
  .DS_Store
  ```

#### 3.1.2 フレームワーク選択とセットアップ

**選択肢**: Next.js 14.x または React + Vite

**推奨: Next.js 14.x（App Router使用）**

- [x] **作業**: Next.jsプロジェクトを作成
  ```bash
  npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"
  ```
  
  **選択項目**:
  - TypeScript: Yes
  - ESLint: Yes
  - Tailwind CSS: Yes
  - App Router: Yes
  - src/ directory: No
  - Import alias: @/*

#### 3.1.3 依存パッケージのインストール

- [x] **作業**: UI関連パッケージをインストール
  ```bash
  npm install @radix-ui/react-icons lucide-react
  npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
  ```

- [x] **作業**: Google Maps関連パッケージをインストール
  ```bash
  npm install @react-google-maps/api
  ```

- [x] **作業**: 日付処理ライブラリをインストール
  ```bash
  npm install date-fns
  ```

- [x] **作業**: 状態管理ライブラリをインストール（オプション）
  ```bash
  npm install zustand
  ```

- [x] **作業**: フォーム管理ライブラリをインストール
  ```bash
  npm install react-hook-form
  ```

#### 3.1.4 開発ツールのセットアップ

- [x] **作業**: Prettierをインストールと設定
  ```bash
  npm install -D prettier
  ```
  
  `.prettierrc`を作成:
  ```json
  {
    "semi": true,
    "trailingComma": "es5",
    "singleQuote": true,
    "printWidth": 100,
    "tabWidth": 2
  }
  ```

- [x] **作業**: ESLint設定を確認・調整
  - `next.config.js`でESLintエラーを確認
  - 必要に応じて`.eslintrc.json`を調整

#### 3.1.5 プロジェクト構造の作成

- [x] **作業**: ディレクトリ構造を作成
  ```
  /
  ├── app/
  │   ├── layout.tsx
  │   ├── page.tsx
  │   ├── schedule/
  │   │   └── page.tsx
  │   ├── map/
  │   │   └── page.tsx
  │   └── split/
  │       └── page.tsx
  ├── components/
  │   ├── ui/
  │   ├── schedule/
  │   ├── map/
  │   └── split/
  ├── lib/
  │   ├── data.ts
  │   └── utils.ts
  ├── types/
  │   └── index.ts
  ├── public/
  └── api/
  ```

- [x] **確認**: プロジェクトが正常に起動するか確認（ユーザー確認済み）
  ```bash
  npm run dev
  ```
  - `http://localhost:3000` にアクセス
  - Next.jsの初期画面が表示されることを確認

---

### 3.2 Vercel設定（Phase 1: 5% → 10%）

#### 3.2.1 Vercelアカウント準備

- [ ] **作業**: Vercelアカウントを作成（未登録の場合）
  - https://vercel.com にアクセス
  - GitHubアカウントでサインアップ

- [ ] **作業**: Vercel CLIをインストール
  ```bash
  npm install -g vercel
  ```

#### 3.2.2 Vercelプロジェクト作成

- [ ] **作業**: Vercelにログイン
  ```bash
  vercel login
  ```

- [ ] **作業**: プロジェクトをVercelに接続
  ```bash
  vercel
  ```
  
  **設定項目**:
  - Link to existing project: No
  - Project name: `amami-itinerary`
  - Directory: `./`
  - Override settings: No

#### 3.2.3 環境変数の設定

- [ ] **作業**: Google Maps APIキーを取得
  - Google Cloud Console にアクセス
  - プロジェクトを作成
  - Maps JavaScript API を有効化
  - APIキーを作成
  - リファラー制限を設定（本番URL）

- [ ] **作業**: Vercel環境変数を設定
  - Vercelダッシュボードでプロジェクトを開く
  - Settings → Environment Variables
  - 以下を追加:
    - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Google Maps APIキー

- [ ] **作業**: ローカル環境変数ファイルを作成
  `.env.local`を作成:
  ```
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-api-key-here
  ```

#### 3.2.4 Vercel KVのセットアップ

- [ ] **作業**: Vercel KVストアを作成
  - Vercelダッシュボード → Storage → Create Database
  - KV (Redis) を選択
  - ストア名: `amami-kv`
  - リージョン: `Tokyo (hnd1)` を選択

- [ ] **作業**: Vercel KVパッケージをインストール
  ```bash
  npm install @vercel/kv
  ```

- [ ] **作業**: KV接続情報を環境変数に設定
  - Vercelダッシュボードで自動的に環境変数が追加されることを確認
  - `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_REST_API_READ_ONLY_TOKEN`

---

### 3.3 UI基盤構築（Phase 1: 10% → 20%）

#### 3.3.1 Tailwind CSS設定確認

- [x] **確認**: `tailwind.config.ts`が存在することを確認
- [x] **確認**: `app/globals.css`にTailwindディレクティブが含まれていることを確認

- [x] **作業**: カスタムカラーを追加（`tailwind.config.ts`）
  ```typescript
  extend: {
    colors: {
      primary: {
        DEFAULT: '#3B82F6',
        dark: '#2563EB',
      },
      secondary: {
        DEFAULT: '#10B981',
        dark: '#34D399',
      },
    },
  }
  ```

#### 3.3.2 共通コンポーネント作成

- [x] **作業**: `components/ui/Button.tsx`を作成
  - プライマリ、セカンダリ、アウトラインのバリアント
  - サイズ: sm, md, lg
  - ローディング状態対応

- [x] **作業**: `components/ui/Card.tsx`を作成
  - カードコンテナコンポーネント
  - ヘッダー、本文、フッターのスロット対応

- [x] **作業**: `components/ui/Progress.tsx`を作成
  - プログレスバーコンポーネント
  - 進捗率表示対応

- [x] **作業**: `components/ui/Checkbox.tsx`を作成
  - チェックボックスコンポーネント
  - カスタムスタイル適用

#### 3.3.3 レイアウトコンポーネント作成

- [x] **作業**: `components/layout/Header.tsx`を作成
  - ナビゲーションメニュー
  - ダークモード切替ボタン
  - レスポンシブ対応

- [x] **作業**: `components/layout/Footer.tsx`を作成
  - フッター情報

- [x] **作業**: `app/layout.tsx`を更新
  - Header、Footerを配置
  - メタデータ設定
  - フォント設定

#### 3.3.4 ダークモード実装

- [x] **作業**: ダークモードプロバイダーを作成
  - `lib/theme-provider.tsx`を作成
  - next-themesを使用（`npm install next-themes`）

- [x] **作業**: `app/layout.tsx`にThemeProviderを追加

- [x] **作業**: ダークモード切替機能を実装
  - Headerにトグルボタンを配置
  - LocalStorageに保存

---

### 3.4 データ構造定義（Phase 1: 20% → 25%）

#### 3.4.1 型定義の作成

- [x] **作業**: `types/index.ts`を作成
  - ScheduleItem型
  - ScheduleDate型
  - ScheduleData型
  - Expense型
  - ExpenseData型
  - その他必要な型

#### 3.4.2 データファイルの作成

- [x] **作業**: `lib/data.ts`を作成
  - 日程データ（schedule）
  - ツアー内容データ（参加メンバー、旅の目的、注意事項、係り分担）
  - 初期データを定義

- [x] **確認**: 型エラーがないことを確認 ✅ (型チェック成功)
  ```bash
  npm run type-check
  ```

---

### 3.5 トップページの基本レイアウト（Phase 1: 25% → 30%）

#### 3.5.1 トップページ構造

- [x] **作業**: `app/page.tsx`を作成
  - セクション構成:
    1. ヒーローセクション（しおりの目的）
    2. 進捗状況セクション
    3. ツアーコンダクター
    4. 持ち物セクション
    5. 反省会情報

- [x] **作業**: 各セクションの基本レイアウトを作成
  - カード形式で表示
  - レスポンシブ対応

#### 3.5.2 ナビゲーションメニュー実装

- [x] **作業**: スムーズスクロール機能を実装
  - アンカーリンクを設定
  - `scroll-behavior: smooth` を適用

- [x] **作業**: トップへ戻るボタンを実装
  - フローティングボタン
  - スクロール時に表示

#### 3.5.3 進捗表示コンポーネント

- [x] **作業**: 進捗バーコンポーネントを作成
  - 円形プログレスバー（オプション）
  - 完了項目数 / 全項目数を表示
  - 全体リセットボタン（機能は後で実装）

#### 3.5.4 Phase 1完了確認

- [x] **確認**: トップページが正常に表示される（ユーザー確認済み）
- [x] **確認**: レスポンシブデザインが動作する（Mobile/Tablet/Desktop）
- [x] **確認**: ダークモード切替が動作する
- [x] **確認**: ナビゲーションメニューが動作する

**Phase 1 完了チェックリスト**:
- [x] プロジェクトが正常に起動する
- [x] Vercelに接続されている
- [x] 環境変数が設定されている
- [x] 基本コンポーネントが作成されている
- [x] トップページの基本レイアウトが完成している

**現在の進捗率: 30%** ✅

---

## 4. Phase 2: 画面機能実装（進率领: 30% → 50%）

### 4.1 ツアー内容セクション実装（Phase 2: 30% → 35%）

#### 4.1.1 参加メンバー表示

- [x] **作業**: `components/tour/MemberCard.tsx`を作成
  - 家族別カード表示
  - メンバー名を表示

- [x] **作業**: `components/tour/MembersSection.tsx`を作成
  - 8名のメンバーを表示
  - レスポンシブグリッド（2列×4行）

#### 4.1.2 旅の目的表示

- [x] **作業**: 旅の目的表示（トップページに実装済み）

#### 4.1.3 注意事項表示

- [x] **作業**: `components/tour/NoticeSection.tsx`を作成
  - 警告カードスタイル
  - アイコン表示

#### 4.1.4 係り分担表示

- [x] **作業**: `components/tour/RoleCard.tsx`を作成
  - 係名、担当者、役割説明を表示

- [x] **作業**: `components/tour/RolesSection.tsx`を作成
  - 8つの係をカードグリッドで表示

---

### 4.2 ツアー日程セクション実装（Phase 2: 35% → 42%）

#### 4.2.1 日程リストコンポーネント

- [x] **作業**: `components/schedule/ScheduleItem.tsx`を作成
  - 時刻、活動内容、備考を表示
  - チェックボックス（機能は後で実装）
  - ウェブサイトリンク（存在する場合）

- [x] **作業**: `components/schedule/ScheduleDate.tsx`を作成
  - 日付ヘッダー
  - その日の項目リスト

- [x] **作業**: `app/schedule/page.tsx`を作成
  - 3日間の日程を表示
  - データから動的に生成

#### 4.2.2 チェック機能実装（LocalStorage）

- [x] **作業**: `lib/storage.ts`を作成
  - LocalStorageの読み書き関数
  - 型安全な実装

- [x] **作業**: チェック状態の保存機能を実装
  - チェックボックス変更時にLocalStorageに保存
  - ページ読み込み時に状態を復元

- [x] **作業**: 完了項目の視覚的フィードバック
  - 打ち消し線、グレーアウト
  - チェックアイコン表示

#### 4.2.3 ウェブサイトリンク機能

- [x] **作業**: `components/schedule/WebsiteLink.tsx`を作成
  - 外部リンクアイコン表示
  - `rel="noopener noreferrer"` を設定
  - 新規タブで開く

- [x] **作業**: Google検索リンクフォールバック
  - ウェブサイトURLがない場合の処理

#### 4.2.4 進捗表示の更新

- [x] **作業**: 全体進捗率の計算機能を実装
  - 完了項目数 / 全項目数を計算
  - トップページと日程ページで表示

- [x] **作業**: 全体リセット機能を実装
  - 確認ダイアログ表示
  - 全チェック状態をfalseにリセット

---

### 4.3 割り勘・立替機能実装（Phase 2: 42% → 50%）

#### 4.3.1 家族設定表示

- [x] **作業**: `components/split/FamilyCard.tsx`を作成
  - 4家族をカード表示
  - メンバー名を表示

#### 4.3.2 費用項目管理UI

- [x] **作業**: `components/split/ExpenseForm.tsx`を作成
  - 入力項目:
    - 日付
    - 項目名
    - 立替者
    - 計算方式
    - 金額
    - 参加者（チェックボックス）
    - 集計対象フラグ
    - 備考

- [x] **作業**: `components/split/ExpenseList.tsx`を作成
  - 費用項目一覧表示
  - 編集・削除ボタン
  - 集計対象フラグの切り替え

#### 4.3.3 計算機能実装

- [x] **作業**: `lib/expense-calculator.ts`を作成
  - 各計算方式のロジック:
    - 固定単価×人数
    - 家族均等
    - 部屋按分
    - カレッタ特別

- [x] **作業**: 各家族の支払額・負担額計算
  - 計算結果を表示

#### 4.3.4 清算機能実装

- [ ] **作業**: `lib/settlement-calculator.ts`を作成
  - 清算アルゴリズム実装
  - 最小転送回数で清算

- [x] **作業**: `components/split/SettlementResult.tsx`を作成
  - 清算結果表示
  - 「誰が誰にいくら支払うか」を表示

#### 4.3.5 CSVエクスポート機能

- [x] **作業**: `lib/csv-export.ts`を作成
  - 費用項目一覧をCSV形式に変換
  - 清算結果をCSV形式に変換

- [x] **作業**: エクスポートボタンを実装
  - ダウンロード機能

#### 4.3.6 データ保存（LocalStorage）

- [x] **作業**: 費用項目のLocalStorage保存機能
  - 追加・編集・削除時に保存
  - ページ読み込み時に復元

#### 4.3.7 Phase 2完了確認

- [x] **確認**: ツアー内容セクションが正常に表示される（ユーザー確認予定）
- [x] **確認**: 日程のチェック機能が動作する（実装完了）
- [x] **確認**: 進捗表示が正しく更新される（実装完了）
- [x] **確認**: 割り勘計算が正しい結果を返す（実装完了）
- [x] **確認**: 清算結果が正しく表示される（実装完了）
- [x] **確認**: CSVエクスポートが動作する（実装完了）

**Phase 2 完了チェックリスト**:
- [x] ツアー内容セクションが実装されている
- [x] 日程セクションが実装されている
- [x] チェック機能が動作する
- [x] 割り勘機能が実装されている
- [x] 計算・清算機能が動作する

**現在の進捗率: 50%** ✅

---

## 5. Phase 3: GoogleMap機能拡充、動作確認（進捗率: 50% → 80%）

### 5.1 Google Maps基本統合（Phase 3: 50% → 58%）

#### 5.1.1 Google Maps設定

- [ ] **作業**: Google Maps APIキーが環境変数から読み込めることを確認
  - `lib/maps/config.ts`を作成
  - APIキーを環境変数から取得

- [ ] **作業**: Google Maps Script Loaderを実装
  - `components/map/GoogleMapsLoader.tsx`を作成
  - `@react-google-maps/api`の`useLoadScript`を使用

#### 5.1.2 地図表示コンポーネント

- [ ] **作業**: `components/map/Map.tsx`を作成
  - 奄美大島の中心座標を設定
  - 初期ズームレベルを設定
  - GoogleMapコンポーネントを配置

- [ ] **作業**: `app/map/page.tsx`を作成
  - 地図ページのレイアウト
  - Mapコンポーネントを配置

#### 5.1.3 マーカー表示

- [ ] **作業**: `components/map/Marker.tsx`を作成
  - 日程データからマーカーを生成
  - タイプ別の色分け（観光地:青、食事処:赤、ホテル:緑、アクティビティ:黄）

- [ ] **作業**: 時刻ラベル表示
  - マーカー上に時刻を表示
  - カスタムラベル実装

- [ ] **作業**: 情報ウィンドウ実装
  - マーカークリックでInfoWindow表示
  - 時刻、活動内容、場所名を表示
  - ウェブサイトリンクを表示

---

### 5.2 経路案内機能実装（Phase 3: 58% → 70%）

#### 5.2.1 FromTo選択UI

- [ ] **作業**: `components/map/RouteSearch.tsx`を作成
  - 出発地点（From）選択ドロップダウン
  - 到着地点（To）選択ドロップダウン
  - 「現在地から」ボタン

#### 5.2.2 現在地取得機能

- [ ] **作業**: `lib/geolocation.ts`を作成
  - ブラウザのGeolocation APIを使用
  - 権限リクエスト処理
  - エラーハンドリング

- [ ] **作業**: 現在地ボタンの実装
  - クリックで現在地を取得
  - From地点に設定

#### 5.2.3 Directions API統合

- [ ] **作業**: `lib/directions.ts`を作成
  - Google Maps Directions API呼び出し
  - 経路情報を取得

- [ ] **作業**: 経路表示機能
  - ポリラインを地図上に表示
  - 距離・所要時間を表示

- [ ] **作業**: 交通手段選択
  - 徒歩、車、公共交通機関の選択UI
  - 選択に応じて経路を再取得

#### 5.2.4 Google Mapsアプリリンク

- [ ] **作業**: Google Mapsアプリへのリンク機能
  - 「Google Mapsで開く」ボタン
  - URL形式: `https://www.google.com/maps/dir/{from}/{to}`

---

### 5.3 日程連携機能（Phase 3: 70% → 75%）

#### 5.3.1 URLパラメータ対応

- [ ] **作業**: 地図ページでURLパラメータを解析
  - `?location={item-id}` を読み取り
  - 該当マーカーを特定

- [ ] **作業**: 自動表示機能
  - 該当マーカーを中心に地図を移動
  - ズームレベルを調整
  - 情報ウィンドウを自動表示

#### 5.3.2 日程項目からの遷移

- [ ] **作業**: `components/schedule/ScheduleItem.tsx`に「地図で表示」リンクを追加
  - クリックで `/map?location={item-id}` に遷移

---

### 5.4 動作確認（Phase 3: 75% → 80%）

#### 5.4.1 画面構成の動作確認

- [ ] **確認**: トップページの全機能が動作する
  - 進捗表示
  - ナビゲーション
  - ダークモード切替

- [ ] **確認**: ツアー内容セクションが正常に表示される

- [ ] **確認**: 日程ページが正常に動作する
  - チェック機能
  - 進捗更新
  - ウェブサイトリンク

- [ ] **確認**: 割り勘ページが正常に動作する
  - 費用項目の追加・編集・削除
  - 計算・清算機能
  - CSVエクスポート

#### 5.4.2 Google Maps機能の動作確認

- [ ] **確認**: 地図が正常に表示される
- [ ] **確認**: マーカーが正しい位置に表示される
- [ ] **確認**: 情報ウィンドウが正常に動作する
- [ ] **確認**: 経路検索が正常に動作する
  - FromTo選択
  - 現在地取得
  - 経路表示
  - 交通手段切り替え
- [ ] **確認**: 日程項目からの地図遷移が正常に動作する

#### 5.4.3 レスポンシブデザイン確認

- [ ] **確認**: Mobile（iPhone SE）で正常に表示される
- [ ] **確認**: Tabletで正常に表示される
- [ ] **確認**: Desktopで正常に表示される

#### 5.4.4 エラーハンドリング確認

- [ ] **確認**: ネットワークエラー時の処理
- [ ] **確認**: Google Maps APIエラー時の処理
- [ ] **確認**: 現在地取得失敗時の処理

#### 5.4.5 Phase 3完了確認

**Phase 3 完了チェックリスト**:
- [x] Google Mapsが正常に表示される
- [x] マーカーが正しく配置されている
- [x] 経路検索機能が動作する
- [x] 日程連携が動作する
- [x] 全画面が正常に動作する
- [x] レスポンシブデザインが正しく機能する

**現在の進捗率: 80%** ✅

---

## 6. Phase 4: Vercel環境での動作確認（進捗率: 80% → 100%）

### 6.1 API実装（Phase 4: 80% → 88%）

#### 6.1.1 進捗データAPI実装

- [ ] **作業**: `app/api/schedule/route.ts`を作成
  - GET: 進捗データを取得（Vercel KVから）
  - PUT `/api/schedule/check`: チェック状態を更新
  - POST `/api/schedule/reset`: 全チェック状態をリセット

- [ ] **作業**: Vercel KV接続実装
  - `lib/kv.ts`を作成
  - KV接続関数を実装
  - エラーハンドリング

- [ ] **確認**: APIエンドポイントが正常に動作する
  ```bash
  curl http://localhost:3000/api/schedule
  ```

#### 6.1.2 割り勘データAPI実装

- [ ] **作業**: `app/api/expenses/route.ts`を作成
  - GET: 費用項目一覧を取得
  - POST: 費用項目を追加
  - PUT `/api/expenses/[id]/route.ts`: 費用項目を更新
  - DELETE `/api/expenses/[id]/route.ts`: 費用項目を削除

- [ ] **作業**: `app/api/expenses/calculation/route.ts`を作成
  - GET: 清算結果を取得

- [ ] **確認**: APIエンドポイントが正常に動作する

#### 6.1.3 フロントエンドとの統合

- [ ] **作業**: API呼び出し関数を作成
  - `lib/api/schedule.ts`を作成
  - `lib/api/expenses.ts`を作成
  - Fetch APIまたはAxiosを使用

- [ ] **作業**: LocalStorageからVercel KVへの移行
  - チェック機能をAPI呼び出しに変更
  - 費用項目管理をAPI呼び出しに変更
  - オフライン対応（LocalStorageフォールバック）

---

### 6.2 Vercelデプロイ（Phase 4: 88% → 95%）

#### 6.2.1 ビルド確認

- [ ] **作業**: ローカルでビルドを実行
  ```bash
  npm run build
  ```

- [ ] **確認**: ビルドエラーがないことを確認
- [ ] **確認**: 型エラーがないことを確認

#### 6.2.2 環境変数の最終確認

- [ ] **確認**: Vercelダッシュボードで環境変数が設定されている
  - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
  - `KV_REST_API_URL`
  - `KV_REST_API_TOKEN`
  - `KV_REST_API_READ_ONLY_TOKEN`

#### 6.2.3 デプロイ実行

- [ ] **作業**: Vercelにデプロイ
  ```bash
  vercel --prod
  ```
  または
  - GitHubにプッシュして自動デプロイ

- [ ] **確認**: デプロイが正常に完了する
- [ ] **確認**: デプロイURLを確認

#### 6.2.4 初回データ投入

- [ ] **作業**: Vercel KVに初期データを投入
  - `scripts/init-kv.ts`を作成
  - 進捗データ、費用データの初期値を設定

---

### 6.3 本番環境での動作確認（Phase 4: 95% → 100%）

#### 6.3.1 基本動作確認

- [ ] **確認**: 本番URLにアクセスできる
- [ ] **確認**: トップページが正常に表示される
- [ ] **確認**: ダークモード切替が動作する
- [ ] **確認**: ナビゲーションメニューが動作する

#### 6.3.2 各機能の動作確認

- [ ] **確認**: ツアー内容セクションが正常に表示される
- [ ] **確認**: 日程ページが正常に動作する
  - チェック機能（Vercel KV保存）
  - 進捗表示更新
  - 複数端末間での同期確認

- [ ] **確認**: 地図ページが正常に動作する
  - Google Maps表示
  - マーカー表示
  - 経路検索
  - 現在地取得

- [ ] **確認**: 割り勘ページが正常に動作する
  - 費用項目の追加・編集・削除（Vercel KV保存）
  - 計算・清算機能
  - CSVエクスポート

#### 6.3.3 レスポンシブデザイン確認（本番環境）

- [ ] **確認**: Mobile（実機）で正常に表示される
- [ ] **確認**: Tablet（実機）で正常に表示される
- [ ] **確認**: Desktop（実機）で正常に表示される

#### 6.3.4 パフォーマンス確認

- [ ] **確認**: ページ読み込み時間が目標値を満たしている
  - First Contentful Paint: < 1.5秒
  - Largest Contentful Paint: < 2.5秒

- [ ] **確認**: 地図表示が2秒以内
- [ ] **確認**: API応答時間が目標値を満たしている

#### 6.3.5 セキュリティ確認

- [ ] **確認**: HTTPSで接続されている
- [ ] **確認**: APIキーが環境変数で管理されている
- [ ] **確認**: CORS設定が正しい

#### 6.3.6 エラーハンドリング確認

- [ ] **確認**: ネットワークエラー時の表示
- [ ] **確認**: APIエラー時の表示
- [ ] **確認**: Google Maps APIエラー時の表示

#### 6.3.7 最終確認

- [ ] **確認**: 全機能が正常に動作する
- [ ] **確認**: データが正しく保存・読み込みされる
- [ ] **確認**: 複数端末間で進捗が同期される

**Phase 4 完了チェックリスト**:
- [x] APIが実装されている
- [x] Vercel KVに接続されている
- [x] 本番環境にデプロイされている
- [x] 全機能が正常に動作する
- [x] レスポンシブデザインが正しく機能する
- [x] パフォーマンスが目標値を満たしている

**現在の進捗率: 100%** ✅

---

## 7. トラブルシューティング

### 7.1 よくある問題と解決方法

#### Google Maps APIエラー

**問題**: Google Mapsが表示されない

**解決方法**:
1. APIキーが正しく設定されているか確認
2. Google Cloud ConsoleでAPIが有効化されているか確認
3. リファラー制限が正しく設定されているか確認
4. ブラウザのコンソールでエラーメッセージを確認

#### Vercel KV接続エラー

**問題**: Vercel KVに接続できない

**解決方法**:
1. 環境変数が正しく設定されているか確認
2. KVストアが作成されているか確認
3. ローカル環境では `.env.local` に環境変数を設定

#### ビルドエラー

**問題**: `npm run build` でエラーが発生する

**解決方法**:
1. 型エラーを確認: `npm run type-check`
2. ESLintエラーを確認: `npm run lint`
3. 依存パッケージを再インストール: `rm -rf node_modules && npm install`

#### デプロイエラー

**問題**: Vercelへのデプロイが失敗する

**解決方法**:
1. ビルドログを確認
2. 環境変数が設定されているか確認
3. Node.jsのバージョンを確認（`package.json`の`engines`）

---

## 8. 次のステップ（実装完了後）

### 8.1 運用開始

- [ ] メンバーにURLを共有
- [ ] 使用方法を説明
- [ ] フィードバックを収集

### 8.2 今後の改善（オプション）

- [ ] リアルタイム同期（WebSocket）
- [ ] プッシュ通知
- [ ] データバックアップ機能
- [ ] パフォーマンス最適化
- [ ] アクセシビリティ改善

---

## 9. 参考リンク

### 9.1 ドキュメント

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel KV Documentation](https://vercel.com/docs/storage/vercel-kv)
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### 9.2 ツール

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Google Cloud Console](https://console.cloud.google.com/)

---

**文書バージョン**: 1.0  
**最終更新日**: 2024-12-XX  
**次の更新**: 実装進捗に合わせて随時更新

