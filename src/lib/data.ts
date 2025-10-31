import { ScheduleData, Member, Role } from '@/types';

// 参加メンバー
export const members: Member[] = [
  { id: 'okabe-1', name: '岡部 夫', family: 'okabe' },
  { id: 'okabe-2', name: '岡部 妻', family: 'okabe' },
  { id: 'ito-1', name: '伊藤 夫', family: 'ito' },
  { id: 'ito-2', name: '伊藤 妻', family: 'ito' },
  { id: 'imai-1', name: '今井 夫', family: 'imai' },
  { id: 'imai-2', name: '今井 妻', family: 'imai' },
  { id: 'ono-1', name: '小野 夫', family: 'ono' },
  { id: 'ono-2', name: '小野 妻', family: 'ono' },
];

// 旅の目的
export const purposes: string[] = [
  '奄美大島の自然を満喫する',
  'マングローブや海などのアクティビティを楽しむ',
  '地元の美味しい料理を味わう',
  '参加メンバーと楽しい時間を過ごす',
  'のんびりとリフレッシュする',
];

// 注意事項
export const notices: string[] = [
  'ながい期間での移動のため、時間に余裕を持って行動してください',
  '天候によりスケジュールが変更になる可能性があります',
  '貴重品の管理は各自でお願いします',
  '体調管理には十分気をつけてください',
];

// 係り分担
export const roles: Role[] = [
  {
    id: 'role-1',
    name: '班長',
    member: '岡部',
    description: '全体の進行管理、連絡調整',
  },
  {
    id: 'role-2',
    name: '副班長',
    member: '伊藤',
    description: '班長の補佐、緊急時の対応',
  },
  {
    id: 'role-3',
    name: '風紀係',
    member: '今井',
    description: '時間管理、マナー向上',
  },
  {
    id: 'role-4',
    name: '宴会係',
    member: '小野',
    description: '懇親会の企画・進行',
  },
  {
    id: 'role-5',
    name: 'YouTube係',
    member: '岡部',
    description: '旅行の動画編集・投稿',
  },
  {
    id: 'role-6',
    name: '会計係',
    member: '伊藤',
    description: '費用管理、精算処理',
  },
  {
    id: 'role-7',
    name: '食事係',
    member: '今井',
    description: '食事場所の予約・調整',
  },
  {
    id: 'role-8',
    name: 'お助け係',
    member: '小野',
    description: '困ったときのサポート',
  },
];

// 日程データ（初期データ）
export const initialScheduleData: ScheduleData = {
  schedule: [
    {
      date: '2024-11-03',
      dateLabel: '11月3日（月曜日）',
      items: [
        {
          id: 'item-1',
          time: '6:30',
          activity: '羽田第1ターミナル第3時計台に集合',
          note: '朝食は各自用意をしておく、帰りのチケットを配布',
          checked: false,
          location: {
            name: '羽田空港第1ターミナル',
            lat: 35.5494,
            lng: 139.7798,
            address: '東京都大田区羽田空港',
          },
          type: 'sightseeing',
        },
        {
          id: 'item-7',
          time: '12:00',
          activity: '海工房で昼食',
          note: '',
          checked: false,
          location: {
            name: '海工房',
            lat: 28.3764,
            lng: 129.4936,
            address: '鹿児島県奄美市',
          },
          website: 'https://kyoraumi.com/',
          type: 'restaurant',
        },
      ],
    },
    {
      date: '2024-11-04',
      dateLabel: '11月4日（火曜日）',
      items: [
        {
          id: 'item-16',
          time: '9:00',
          activity: '金作原原生林ツアー',
          note: '',
          checked: false,
          location: {
            name: '金作原原生林',
            lat: 28.3764,
            lng: 129.4936,
            address: '鹿児島県奄美市',
          },
          type: 'sightseeing',
        },
      ],
    },
    {
      date: '2024-11-05',
      dateLabel: '11月5日（水曜日）',
      items: [],
    },
  ],
  lastUpdated: new Date().toISOString(),
  version: 1,
};

// ツアーコンダクター情報
export const tourConductor = {
  name: '担当者名',
  contact: '連絡先',
};

// 持ち物リスト
export const packingList: string[] = [
  'パスポート',
  'チケット',
  '現金・クレジットカード',
  '服（季節に応じて）',
  '日焼け止め',
  'カメラ',
  '充電器',
];

// 反省会情報
export const reflectionMeeting = {
  date: '2024-11-XX',
  time: 'XX:XX',
  location: '場所',
  participants: '全員',
};

