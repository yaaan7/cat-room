/**
 * Cat Room - Natural Language Reaction Template Engine
 */

export const REACTION_TEMPLATES = {
  FEED: {
    NORMAL: [
      "기다렸다는 듯 밥그릇으로 달려갔다.",
      "허겁지겁 사료를 오도독 비워냈다.",
      "기분이 좋은지 꼬리를 살랑이며 밥을 먹는다."
    ],
    FULL: [
      "밥그릇을 한번 보고는 등을 돌렸다.",
      "냄새만 살짝 맡고 관심 없는 듯 꼬리를 쳤다.",
      "배가 부른지 밥그릇 근처에서 하품을 했다."
    ],
    SLEEPING_DISTURBED: [
      "잘 자고 있는데 밥그릇 소리가 나서 짜증이 난 것 같다!",
      "잠에서 깨어 눈을 부릅뜨며 귀를 젖혔다."
    ]
  },
  PET: {
    NORMAL: [
      "기분이 좋은지 눈을 가늘게 떴다.",
      "손길에 맞춰 고개를 삐걱 밀어붙인다.",
      "목에서 기분 좋은 골골송 소리가 들린다."
    ],
    PET_LONG: [
      "오랜 시간 다정하게 쓸어내리자 기분 좋게 갸르릉거린다.",
      "손길을 만끽하며 턱을 가슴에 깊이 묻고 편안해한다.",
      "스르륵 눈을 감고 아늑한 감촉에 온몸을 맡긴다."
    ],
    OVERPETTED: [
      "지금은 혼자 있고 싶은 것 같다.",
      "귀를 젖히며 손을 톡 쳤다.",
      "귀찮아하며 꼬리를 팍팍 쳤다."
    ],
    SLEEPING_DISTURBED: [
      "자고 있을 때 만지자 신경질을 냈다!",
      "하악질을 하며 딴 곳으로 자리를 옮겼다."
    ]
  },
  PLAY: {
    NORMAL: [
      "장난감을 향해 펄쩍 튀어 올랐다!",
      "눈을 반짝이며 신나게 장난감을 쫓는다.",
      "엉덩이를 실룩거리며 습격 기회를 노린다!"
    ],
    TIRED: [
      "지금은 놀고 싶지 않은 모양이다.",
      "장난감을 무심하게 바라보며 누워버렸다.",
      "피곤한지 누워서 눈동자만 장난감을 따라간다."
    ],
    SLEEPING_DISTURBED: [
      "잠을 방해하자 귀를 젖히고 위협했다.",
      "지금 놀 기분이 아닌 듯 으르렁거렸다."
    ]
  },
  SLEEP: {
    NORMAL: [
      "아늑한 자리를 잡고 눈을 감았다.",
      "몸을 동그랗게 말고 조용히 숨을 쉰다.",
      "Zzz... 깊은 잠에 빠져들었다."
    ],
    ALREADY_SLEEPING: [
      "이미 아늑하게 단잠을 자고 있다."
    ]
  },
  APPROACH_SLOW: {
    NORMAL: [
      "호기심 어린 눈으로 살금살금 다가온다.",
      "귀를 쫑긋거리며 반갑게 눈인사를 건넨다."
    ]
  },
  APPROACH_FAST: {
    NORMAL: [
      "깜짝 놀라 구석으로 쏜살같이 숨었다!",
      "갑작스러운 접근에 털이 삐쭉 섰다!"
    ]
  },
  PERSON_LEFT: {
    NORMAL: [
      "혼자만의 편안한 휴식 시간으로 돌아갔다.",
      "느긋하게 몸을 풀며 기지개를 켠다."
    ]
  },
  LIGHT_DARK: {
    NORMAL: [
      "주변이 어두워지자 눈꺼풀이 무거워지는 듯하다.",
      "어두운 방 안에서 자리를 잡고 잠을 청한다."
    ]
  },
  LIGHT_BRIGHT: {
    NORMAL: [
      "방이 다시 밝아지자 가볍게 눈을 끔벅였다.",
      "햇살을 느끼며 기분 좋게 일어났다."
    ]
  }
};

export class TemplateEngine {
  static getReaction(action, reason = 'NORMAL') {
    const actionGroup = REACTION_TEMPLATES[action];
    if (!actionGroup) return "고양이가 조용히 당신을 바라본다.";

    const pool = actionGroup[reason] || actionGroup['NORMAL'] || actionGroup;
    if (Array.isArray(pool) && pool.length > 0) {
      const idx = Math.floor(Math.random() * pool.length);
      return pool[idx];
    }
    return "고양이가 조용히 반응했다.";
  }
}
