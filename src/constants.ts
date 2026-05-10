import { TeamCore } from "./types";

export const TYPE_NAME_KO: Record<string, string> = {
  normal: '노말', fire: '불꽃', water: '물', grass: '풀', electric: '전기', ice: '얼음',
  fighting: '격투', poison: '독', ground: '땅', flying: '비행', psychic: '에스퍼',
  bug: '벌레', rock: '바위', ghost: '고스트', dragon: '드래곤', dark: '악',
  steel: '강철', fairy: '페어리'
};

export const MOCK_TEAMS: TeamCore[] = [
  {
    id: "vgc-2026-hyper-offense",
    name: "쾌청 메가진화 비트다운",
    format: "Pokémon Champions",
    description: "메가리자몽Y의 가뭄 특성을 활용하여 화력을 극대화한 파티입니다. 피카츄의 전력 공격과 망나뇽의 신속 마무리가 핵심입니다.",
    synergyLevel: 98,
    winRate: 72,
    pokemon: [
      {
        id: "mega-charizard-y",
        name: "메가리자몽Y",
        types: ["fire", "flying"],
        item: "메가스톤",
        ability: "가뭄",
        nature: "겁쟁이",
        evs: { hp: 4, atk: 0, def: 0, spa: 31, spd: 0, spe: 31 }, // Total 66, max 32 per stat
        moves: ["열풍", "솔라빔", "에어슬래시", "방어"],
        imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10035.png"
      },
      {
        id: "mega-lucario",
        name: "메가루카리오",
        types: ["fighting", "steel"],
        item: "메가스톤",
        ability: "적응력",
        nature: "명랑",
        evs: { hp: 0, atk: 32, def: 0, spa: 0, spd: 4, spe: 30 },
        moves: ["인파이트", "코멧펀치", "신속", "칼춤"],
        imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10055.png"
      },
      {
        id: "pikachu",
        name: "피카츄",
        types: ["electric"],
        item: "전기구슬",
        ability: "피뢰침",
        nature: "명랑",
        evs: { hp: 0, atk: 32, def: 0, spa: 0, spd: 2, spe: 32 },
        moves: ["볼트태클", "치근거리기", "속이다", "전광석화"],
        imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
      },
      {
        id: "dragonite",
        name: "망나뇽",
        types: ["dragon", "flying"],
        item: "기합의띠",
        ability: "멀티스케일",
        nature: "고집",
        evs: { hp: 32, atk: 32, def: 2, spa: 0, spd: 0, spe: 0 },
        moves: ["신속", "드래곤다이브", "역린", "지진"],
        imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png"
      },
      {
        id: "incineroar",
        name: "어흥염",
        types: ["fire", "dark"],
        item: "자뭉열매",
        ability: "위협",
        nature: "신중",
        evs: { hp: 32, atk: 0, def: 12, spa: 0, spd: 22, spe: 0 },
        moves: ["플레어드라이브", "탁쳐서떨구기", "막말내뱉기", "속이다"],
        imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/727.png"
      },
      {
        id: "ninetales-alola",
        name: "알로라 나인테일",
        types: ["ice", "fairy"],
        item: "빛의점토",
        ability: "눈퍼뜨리기",
        nature: "겁쟁이",
        evs: { hp: 32, atk: 0, def: 2, spa: 0, spd: 0, spe: 32 },
        moves: ["오로라베일", "보드레기", "문포스", "방어"],
        imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10103.png"
      }
    ]
  }
];

export const DEFENDING_TYPE_CHART: Record<string, Record<string, number>> = {
  normal: { fighting: 2, ghost: 0 },
  fire: { fire: 0.5, water: 2, grass: 0.5, ice: 0.5, ground: 2, bug: 0.5, rock: 2, steel: 0.5, fairy: 0.5 },
  water: { fire: 0.5, water: 0.5, grass: 2, electric: 2, ice: 0.5, steel: 0.5 },
  grass: { fire: 2, water: 0.5, grass: 0.5, electric: 0.5, ice: 2, poison: 2, ground: 0.5, flying: 2, bug: 2 },
  electric: { electric: 0.5, ground: 2, flying: 0.5, steel: 0.5 },
  ice: { fire: 2, ice: 0.5, fighting: 2, rock: 2, steel: 2 },
  fighting: { flying: 2, psychic: 2, bug: 0.5, rock: 0.5, dark: 0.5, fairy: 2 },
  poison: { grass: 0.5, fighting: 0.5, poison: 0.5, ground: 2, bug: 0.5, psychic: 2, fairy: 0.5 },
  ground: { water: 2, grass: 2, electric: 0, ice: 2, poison: 0.5, rock: 0.5 },
  flying: { grass: 0.5, electric: 2, ice: 2, fighting: 0.5, ground: 0, bug: 0.5 },
  psychic: { fighting: 0.5, psychic: 0.5, bug: 2, ghost: 2, dark: 2 },
  bug: { fire: 2, grass: 0.5, fighting: 0.5, ground: 0.5, flying: 2, rock: 2 },
  rock: { normal: 0.5, fire: 0.5, water: 2, grass: 2, poison: 0.5, flying: 0.5, fighting: 2, ground: 2, steel: 2 },
  ghost: { normal: 0, fighting: 0, poison: 0.5, bug: 0.5, ghost: 2, dark: 2 },
  dragon: { fire: 0.5, water: 0.5, grass: 0.5, electric: 0.5, ice: 2, dragon: 2, fairy: 2 },
  dark: { fighting: 2, psychic: 0, bug: 2, ghost: 0.5, dark: 0.5, fairy: 2 },
  steel: { normal: 0.5, fire: 2, grass: 0.5, ice: 0.5, fighting: 2, poison: 0, ground: 2, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 0.5, dragon: 0.5, steel: 0.5, fairy: 0.5 },
  fairy: { fighting: 0.5, poison: 2, bug: 0.5, dragon: 0, dark: 0.5, steel: 2 }
};

export const getTypeEffectiveness = (types: string[]) => {
  const multipliers: Record<string, number> = {};
  const ALL_TYPES = Object.keys(DEFENDING_TYPE_CHART);
  
  ALL_TYPES.forEach(attackerType => {
    let totalMultiplier = 1;
    types.forEach(defenderType => {
      const typeLower = defenderType.toLowerCase();
      if (DEFENDING_TYPE_CHART[typeLower] && DEFENDING_TYPE_CHART[typeLower][attackerType] !== undefined) {
        totalMultiplier *= DEFENDING_TYPE_CHART[typeLower][attackerType];
      }
    });
    if (totalMultiplier !== 1) {
      multipliers[attackerType] = totalMultiplier;
    }
  });

  const weaknesses = [];
  const resistances = [];
  const immunities = [];

  Object.entries(multipliers).forEach(([type, multiplier]) => {
    if (multiplier > 1) weaknesses.push({ type, multiplier });
    else if (multiplier > 0 && multiplier < 1) resistances.push({ type, multiplier });
    else if (multiplier === 0) immunities.push({ type, multiplier });
  });

  weaknesses.sort((a, b) => b.multiplier - a.multiplier);
  resistances.sort((a, b) => a.multiplier - b.multiplier);

  return { weaknesses, resistances, immunities };
};

export const TYPE_COLORS: Record<string, string> = {
  normal: 'bg-stone-500 text-white',
  fire: 'bg-orange-500 text-white',
  water: 'bg-blue-500 text-white',
  grass: 'bg-green-500 text-white',
  electric: 'bg-yellow-400 text-black',
  ice: 'bg-cyan-300 text-black',
  fighting: 'bg-red-700 text-white',
  poison: 'bg-purple-600 text-white',
  ground: 'bg-amber-600 text-white',
  flying: 'bg-indigo-400 text-white',
  psychic: 'bg-pink-500 text-white',
  bug: 'bg-lime-500 text-white',
  rock: 'bg-yellow-700 text-white',
  ghost: 'bg-violet-800 text-white',
  dragon: 'bg-indigo-700 text-white',
  dark: 'bg-zinc-800 text-white',
  steel: 'bg-slate-500 text-white',
  fairy: 'bg-rose-400 text-white'
};
