/**
 * Cat Room - Configuration & Item Catalog Specifications
 */

export const GAME_CONFIG = {
  APP_VERSION: '1.0.0',
  STORAGE_KEY: 'CAT_ROOM_DATA_V1',
  TICK_INTERVAL_MS: 30000, // 30 seconds tick
  DEBOUNCE_MS: 300,        // 300ms serial/UI event debouncing
  PET_STRESS_THRESHOLD: 4,  // 4 pets within 3s triggers stress escalation
  PET_STRESS_WINDOW_MS: 3000
};

export const METRIC_LIMITS = {
  MIN: 0,
  MAX: 100
};

export const BEHAVIOR_STATES = {
  IDLE: 'IDLE',
  HAPPY: 'HAPPY',
  HUNGRY: 'HUNGRY',
  SLEEPY: 'SLEEPY',
  SLEEPING: 'SLEEPING',
  STARTLED: 'STARTLED',
  ANGRY: 'ANGRY',
  INDIFFERENT: 'INDIFFERENT'
};

export const STATE_TAGS = {
  IDLE: { label: '💬 평온함', color: '#70a1ff' },
  HAPPY: { label: '💕 행복함', color: '#ff7597' },
  HUNGRY: { label: '🐟 배고픔', color: '#ff6b81' },
  SLEEPY: { label: '🥱 졸림', color: '#ffbe76' },
  SLEEPING: { label: '🌙 수면 중', color: '#a55eea' },
  STARTLED: { label: '⚡ 놀람', color: '#ffa502' },
  ANGRY: { label: '🔥 화남', color: '#ff4757' },
  INDIFFERENT: { label: '💤 무관심', color: '#a4b0be' }
};

export const ROOM_SLOTS = [
  { id: 'wallpaper', label: '벽지' },
  { id: 'floor', label: '바닥' },
  { id: 'bed', label: '침대' },
  { id: 'bowl', label: '밥그릇' },
  { id: 'catTower', label: '캣타워' },
  { id: 'cushion', label: '쿠션' },
  { id: 'toy', label: '장난감' },
  { id: 'window', label: '창밖 배경' },
  { id: 'wallDecor', label: '벽 장식' }
];

export const ITEM_CATALOG = {
  wallpaper: [
    { id: 'wp_beige', name: '원목 베이지 벽지', icon: '🎨', default: true },
    { id: 'wp_pink', name: '핑크 파스텔 벽지', icon: '🌸', default: false, unlockCondition: 'feedCount:1' },
    { id: 'wp_gray', name: '모던 그레이 벽지', icon: '🏙️', default: false, unlockCondition: 'affection:30' }
  ],
  floor: [
    { id: 'fl_wood', name: '내추럴 원목 마루', icon: '🪵', default: true },
    { id: 'fl_rug', name: '포근 원형 카펫', icon: '🧶', default: false, unlockCondition: 'affection:40' },
    { id: 'fl_tile', name: '화이트 타일 바닥', icon: '⬛', default: false, unlockCondition: 'captureCount:1' }
  ],
  bed: [
    { id: 'bed_cushion', name: '폭신 원형 쿠션', icon: '🛋️', default: true },
    { id: 'bed_box', name: '아늑한 종이 상자', icon: '📦', default: false, unlockCondition: 'petCount:5' },
    { id: 'bed_wood', name: '원목 해먹 침대', icon: '🛏️', default: false, unlockCondition: 'affection:60' }
  ],
  bowl: [
    { id: 'bowl_plastic', name: '기본 플라스틱 식기', icon: '🥣', default: true },
    { id: 'bowl_ceramic', name: '도자기 사료 그릇', icon: '🥛', default: false, unlockCondition: 'feedCount:10' },
    { id: 'bowl_wood', name: '원목 2단 식기대', icon: '🍽️', default: false, unlockCondition: 'affection:50' }
  ],
  catTower: [
    { id: 'tower_mini', name: '미니 캣타워', icon: '🪜', default: true },
    { id: 'tower_wood', name: '3단 원목 캣타워', icon: '🏰', default: false, unlockCondition: 'affection:50' }
  ],
  cushion: [
    { id: 'cushion_default', name: '기본 라운드 쿠션', icon: '⚪', default: true },
    { id: 'cushion_fish', name: '생선 모양 쿠션', icon: '🐟', default: false, unlockCondition: 'feedCount:1' },
    { id: 'cushion_donut', name: '도넛 방석', icon: '🍩', default: false, unlockCondition: 'playCount:5' }
  ],
  toy: [
    { id: 'toy_yarn', name: '알록달록 털실 공', icon: '🧶', default: true },
    { id: 'toy_mouse', name: '태엽 쥐 인형', icon: '🐁', default: false, unlockCondition: 'playCount:10' },
    { id: 'toy_circuit', name: '회로 모양 장난감', icon: '⚡', default: false, unlockCondition: 'arduinoConnected:true' }
  ],
  window: [
    { id: 'win_day', name: '따사로운 낮 햇살', icon: '☀️', default: true },
    { id: 'win_night', name: '조용한 밤하늘 별빛', icon: '🌙', default: false, unlockCondition: 'petCount:10' },
    { id: 'win_rain', name: '비 내리는 창가', icon: '🌧️', default: false, unlockCondition: 'captureCount:2' }
  ],
  wallDecor: [
    { id: 'wall_frame', name: '원목 액자 프레임', icon: '🖼️', default: true },
    { id: 'wall_calendar', name: '고양이 캘린더', icon: '📅', default: false, unlockCondition: 'captureCount:3' },
    { id: 'wall_light', name: '감성 은하수 조명', icon: '💡', default: false, unlockCondition: 'arduinoConnected:true' }
  ]
};
