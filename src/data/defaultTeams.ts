import { TeamCore } from '../types';

export const DEFAULT_META_TEAMS: TeamCore[] = [
  {
    id: "meta-team-1",
    name: "정석 대면 구축 (메가캥카 & 메가팬텀)",
    format: "Pokémon Champions",
    description: "현재 메타에서 가장 안정적이고 다재다능한 공격수익인 메가캥카와 변수 창출 능력이 뛰어난 메가팬텀을 주축으로 구성한 스탠다드 형태입니다.",
    synergyLevel: 98,
    synergyDescription: "메가캥카가 활약하기 어려운 물리막이나 고스트 타입을 상대로 메가팬텀이 완벽한 억제력을 제공하며, 한카리아스와 불카모스로 다양한 콤보를 만들 수 있습니다.",
    leads: [
      {
        strategyName: "vs 특수 어태커 위주 파티",
        description: "내 선출: 메가캥카 + 한카리아스 + 불카모스\n운영법: 메가캥카로 선봉 1:1 대면을 제압하고 한카리아스와 불카모스의 스윕을 설계합니다."
      },
      {
        strategyName: "vs 물리 어태커 위주 파티",
        description: "내 선출: 메가팬텀 + 워시로토무 + 킬가르도\n운영법: 워시로토무의 도깨비불과 킬가르도의 사이클을 통해 상대 핵심 물리몬의 기능을 정지시킵니다."
      }
    ],
    usageNotes: [
      { pokemonId: "115", pokemonName: "메가캥카", note: "선봉 출전 시 속이기 후 은혜갚기로 초반 기점을 잡으며, 기습으로 마무리 각을 봅니다." },
      { pokemonId: "94", pokemonName: "메가팬텀", note: "특수막이 혹은 고집스러운 랭크업 스위퍼가 나오면 그림자밟기로 묶은 후 길동무로 강제 돌파합니다." },
      { pokemonId: "445", pokemonName: "한카리아스", note: "구애스카프로 인해 130족 이상의 스피드를 확보하여 스위퍼를 확실하게 처단하는 역할입니다." },
      { pokemonId: "681", pokemonName: "킬가르도", note: "사이클의 핵심. 킹실드를 기반으로 상대 물리몬의 공격을 버티며 먹다남은음식으로 체력을 보전합니다." },
      { pokemonId: "479", pokemonName: "워시로토무", note: "훌륭한 방어 상성으로 한카리아스와 캥카의 약점을 보완해주며, 도깨비불로 상대를 압박합니다." },
      { pokemonId: "637", pokemonName: "불카모스", note: "기합의띠의 행동 보증을 통해 나비춤 기점을 1회 잡고 불꽃 몸으로 스윕을 시도합니다." }
    ],
    pokemon: [
      {
        id: "115",
        name: "메가캥카",
        enName: "Kangaskhan-Mega",
        types: ["normal"],
        item: "캥카나이트",
        enItem: "Kangaskhanite",
        ability: "배짱 -> 부자유친",
        enAbility: "Scrappy -> Parental Bond",
        nature: "명랑(스피드 상승/특공 하락)",
        enNature: "Jolly",
        evs: { hp: 4, atk: 32, def: 0, spa: 0, spd: 0, spe: 30 },
        moves: ["속이기", "은혜갚기", "지진", "기습"],
        enMoves: ["Fake Out", "Return", "Earthquake", "Sucker Punch"],
        imageUrl: "https://play.pokemonshowdown.com/sprites/dex/kangaskhan-mega.png"
      },
      {
        id: "94",
        name: "메가팬텀",
        enName: "Gengar-Mega",
        types: ["ghost", "poison"],
        item: "팬텀나이트",
        enItem: "Gengarite",
        ability: "저주받은바디 -> 그림자밟기",
        enAbility: "Cursed Body -> Shadow Tag",
        nature: "겁쟁이(스피드 상승/공격 하락)",
        enNature: "Timid",
        evs: { hp: 32, atk: 0, def: 2, spa: 0, spd: 0, spe: 32 },
        moves: ["섀도볼", "오물폭탄", "도발", "길동무"],
        enMoves: ["Shadow Ball", "Sludge Bomb", "Taunt", "Destiny Bond"],
        imageUrl: "https://play.pokemonshowdown.com/sprites/dex/gengar-mega.png"
      },
      {
        id: "445",
        name: "한카리아스",
        enName: "Garchomp",
        types: ["dragon", "ground"],
        item: "구애스카프",
        enItem: "Choice Scarf",
        ability: "까칠한피부",
        enAbility: "Rough Skin",
        nature: "명랑(스피드 상승/특공 하락)",
        enNature: "Jolly",
        evs: { hp: 0, atk: 32, def: 0, spa: 0, spd: 2, spe: 32 },
        moves: ["역린", "지진", "스톤에지", "불꽃엄니"],
        enMoves: ["Outrage", "Earthquake", "Stone Edge", "Fire Fang"],
        imageUrl: "https://play.pokemonshowdown.com/sprites/dex/garchomp.png"
      },
      {
        id: "681",
        name: "킬가르도",
        enName: "Aegislash",
        types: ["steel", "ghost"],
        item: "먹다남은음식",
        enItem: "Leftovers",
        ability: "배틀스위치",
        enAbility: "Stance Change",
        nature: "건방(특방 상승/스피드 하락)",
        enNature: "Sassy",
        evs: { hp: 32, atk: 0, def: 2, spa: 32, spd: 0, spe: 0 },
        moves: ["섀도볼", "성스러운칼", "야습", "킹실드"],
        enMoves: ["Shadow Ball", "Sacred Sword", "Shadow Sneak", "King's Shield"],
        imageUrl: "https://play.pokemonshowdown.com/sprites/dex/aegislash.png"
      },
      {
        id: "479",
        name: "워시로토무",
        enName: "Rotom-Wash",
        types: ["electric", "water"],
        item: "자뭉열매",
        enItem: "Sitrus Berry",
        ability: "부유",
        enAbility: "Levitate",
        nature: "조심(특공 상승/공격 하락)",
        enNature: "Modest",
        evs: { hp: 32, atk: 0, def: 2, spa: 28, spd: 4, spe: 0 },
        moves: ["하이드로펌프", "10만볼트", "볼트체인지", "도깨비불"],
        enMoves: ["Hydro Pump", "Thunderbolt", "Volt Switch", "Will-O-Wisp"],
        imageUrl: "https://play.pokemonshowdown.com/sprites/dex/rotom-wash.png"
      },
      {
        id: "637",
        name: "불카모스",
        enName: "Volcarona",
        types: ["bug", "fire"],
        item: "기합의띠",
        enItem: "Focus Sash",
        ability: "불꽃몸",
        enAbility: "Flame Body",
        nature: "겁쟁이(스피드 상승/공격 하락)",
        enNature: "Timid",
        evs: { hp: 0, atk: 0, def: 4, spa: 30, spd: 0, spe: 32 },
        moves: ["불춤", "벌레의야단법석", "기가드레인", "나비춤"],
        enMoves: ["Fiery Dance", "Bug Buzz", "Giga Drain", "Quiver Dance"],
        imageUrl: "https://play.pokemonshowdown.com/sprites/dex/volcarona.png"
      }
    ]
  },
  {
    id: "meta-team-2",
    name: "맑음 전개 (메가리자몽Y & 메가마기라스)",
    format: "Pokémon Champions",
    description: "메가리자몽Y의 가뭄 특성으로 상대 날씨를 장악하고 고화력으로 압박하는 공격적 날씨 파티입니다.",
    synergyLevel: 96,
    synergyDescription: "리자몽Y의 가뭄특성과 마기라스의 모래날림을 번갈아 활용하며 날씨 상황을 주도하고, 하마돈이나 랜드로스 등을 견제하기 매우 좋습니다.",
    leads: [
      {
        strategyName: "vs 특수 어태커 위주 파티",
        description: "내 선출: 메가마기라스 + 마릴리 + 뽀록나\n운영법: 튼튼한 메가마기라스가 모래바람 특방업을 앞세워 적 특수 에이스를 제압하고 마릴리가 랭크업으로 경기를 장악합니다."
      },
      {
        strategyName: "vs 물리 어태커 위주 파티",
        description: "내 선출: 메가리자몽Y + 랜드로스 + 버섯모\n운영법: 랜드로스의 위협과 리자몽의 오버히트 조합으로 물리 타점을 찍어누르며 우위를 선점합니다."
      }
    ],
    usageNotes: [
      { pokemonId: "6", pokemonName: "메가리자몽Y", note: "가뭄의 초고화력 오버히트/불대문자로 강행돌파. 스피드는 최속 보정." },
      { pokemonId: "248", pokemonName: "메가마기라스", note: "모래날림으로 적의 기띠/날씨를 파괴. 특방 보정을 받아 매우 튼튼한 딜탱입니다." },
      { pokemonId: "184", pokemonName: "마릴리", note: "천하장사 특성과 자뭉열매 배북을 이용해 템포를 끌어올리는 물리 스위퍼 역할을 수행합니다." },
      { pokemonId: "591", pokemonName: "뽀록나", note: "리자몽의 약점인 물, 전기를 반감으로 맞으며 버섯포자, 분노가루로 메인 어태커를 지키는 스페셜리스트." },
      { pokemonId: "645", pokemonName: "랜드로스 (영물폼)", note: "위협 쿠션 및 스텔스록/유턴을 통한 기점잡이입니다." },
      { pokemonId: "286", pokemonName: "버섯모", note: "기합의띠 버섯포자로 사이클을 끊어버리는 대면의 신." }
    ],
    pokemon: [
      {
        id: "6",
        name: "메가리자몽Y",
        enName: "Charizard-Mega-Y",
        types: ["fire", "flying"],
        item: "리자몽나이트Y",
        enItem: "Charizardite Y",
        ability: "맹화 -> 가뭄",
        enAbility: "Blaze -> Drought",
        nature: "겁쟁이(스피드 상승/특공 하락)",
        enNature: "Timid",
        evs: { hp: 0, atk: 0, def: 4, spa: 30, spd: 0, spe: 32 },
        moves: ["불대문자", "솔라빔", "오버히트", "기합구슬"],
        enMoves: ["Fire Blast", "Solar Beam", "Overheat", "Focus Blast"],
        imageUrl: "https://play.pokemonshowdown.com/sprites/dex/charizard-megay.png"
      },
      {
        id: "248",
        name: "메가마기라스",
        enName: "Tyranitar-Mega",
        types: ["rock", "dark"],
        item: "마기라스나이트",
        enItem: "Tyranitarite",
        ability: "모래날림 -> 모래날림",
        enAbility: "Sand Stream -> Sand Stream",
        nature: "명랑(스피드 상승/특공 하락)",
        enNature: "Jolly",
        evs: { hp: 0, atk: 32, def: 0, spa: 0, spd: 2, spe: 32 },
        moves: ["스톤에지", "지진", "냉동펀치", "용의춤"],
        enMoves: ["Stone Edge", "Earthquake", "Ice Punch", "Dragon Dance"],
        imageUrl: "https://play.pokemonshowdown.com/sprites/dex/tyranitar-mega.png"
      },
      {
        id: "184",
        name: "마릴리",
        enName: "Azumarill",
        types: ["water", "fairy"],
        item: "자뭉열매",
        enItem: "Sitrus Berry",
        ability: "천하장사",
        enAbility: "Huge Power",
        nature: "고집(공격 상승/특공 하락)",
        enNature: "Adamant",
        evs: { hp: 30, atk: 32, def: 2, spa: 0, spd: 0, spe: 2 },
        moves: ["아쿠아제트", "치근거리기", "엄청난힘", "배북"],
        enMoves: ["Aqua Jet", "Play Rough", "Superpower", "Belly Drum"],
        imageUrl: "https://play.pokemonshowdown.com/sprites/dex/azumarill.png"
      },
      {
        id: "591",
        name: "뽀록나",
        enName: "Amoonguss",
        types: ["grass", "poison"],
        item: "멘탈허브",
        enItem: "Mental Herb",
        ability: "재생력",
        enAbility: "Regenerator",
        nature: "건방(특방 상승/스피드 하락)",
        enNature: "Sassy",
        evs: { hp: 32, atk: 0, def: 18, spa: 0, spd: 16, spe: 0 },
        moves: ["버섯포자", "분노가루", "오물폭탄", "기가드레인"],
        enMoves: ["Spore", "Rage Powder", "Sludge Bomb", "Giga Drain"],
        imageUrl: "https://play.pokemonshowdown.com/sprites/dex/amoonguss.png"
      },
      {
        id: "445", 
        name: "한카리아스",
        enName: "Garchomp",
        types: ["dragon", "ground"],
        item: "구애스카프",
        enItem: "Choice Scarf",
        ability: "까칠한피부",
        enAbility: "Rough Skin",
        nature: "명랑(스피드 상승/특공 하락)",
        enNature: "Jolly",
        evs: { hp: 0, atk: 32, def: 0, spa: 0, spd: 2, spe: 32 },
        moves: ["역린", "지진", "스텔스록", "암석봉인"],
        enMoves: ["Outrage", "Earthquake", "Stealth Rock", "Rock Tomb"],
        imageUrl: "https://play.pokemonshowdown.com/sprites/dex/garchomp.png"
      },
      {
        id: "286",
        name: "버섯모",
        enName: "Breloom",
        types: ["grass", "fighting"],
        item: "기합의띠",
        enItem: "Focus Sash",
        ability: "테크니션",
        enAbility: "Technician",
        nature: "명랑(스피드 상승/특공 하락)",
        enNature: "Jolly",
        evs: { hp: 0, atk: 32, def: 2, spa: 0, spd: 0, spe: 32 },
        moves: ["버섯포자", "기관총", "마하펀치", "암석봉인"],
        enMoves: ["Spore", "Bullet Seed", "Mach Punch", "Rock Tomb"],
        imageUrl: "https://play.pokemonshowdown.com/sprites/dex/breloom.png"
      }
    ]
  }
];
