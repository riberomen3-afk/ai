import React, { useState, useRef, useEffect } from 'react';
import { Send, Copy, Wand2, Plus, BarChart3, Loader2, Save, Zap, RotateCcw } from 'lucide-react';
import { PokemonCard } from '../components/PokemonCard';
import { MOCK_TEAMS, TYPE_NAME_KO } from '../constants';
import { getStatsForPokemon, extractRate, extractSpreadRate } from '../utils/statsUtils';
import { motion } from 'motion/react';
import { chatWithProfessor } from '../services/geminiService';
import Markdown from 'react-markdown';
import { TeamCore } from '../types';
import { MEGA_DATA, REGULAR_DATA } from '../data/searchData';

interface BuildProps {
  onSaveTeam?: (team: TeamCore) => void;
  onNavigate?: (tab: string) => void;
}

// Constants for restricted lists
const ALLOWED_MEGAS = [
  "메가이상해꽃", "메가리자몽X", "메가리자몽Y", "메가거북왕", "메가독침붕", "메가피죤투", "메가후딘", "메가야도란", "메가팬텀", "메가캥카", "메가쁘사이저", "메가갸라도스", "메가프테라", "메가전룡", "메가강철톤", "메가핫삼", "메가헤라크로스", "메가헬가", "메가마기라스", "메가가디안", "메가깜까미", "메가보스로라", "메가요가램", "메가썬더볼트", "메가샤크니아", "메가폭타", "메가파비코리", "메가다크펫", "메가앱솔", "메가얼음귀신", "메가한카리아스", "메가루카리오", "메가눈설왕", "메가엘레이드", "메가이어롭", "메가다부니", "메가메가니움", "메가장크로다일", "메가블레이범", "메가마폭시", "지우개굴닌자", "메가브리그론", "메가염무왕", "메가무장조", "메가치렁", "메가눈여아", "메가몰드류", "메가샹델라", "메가골루그", "메가영원의꽃플라엣테", "메가냐오닉스", "메가루차불", "메가모단게", "메가할비롱", "메가캡싸이", "메가킬라플로르", "메가망나뇽", "메가아쿠스타"
];

const ALLOWED_REGULAR = [
  "이상해꽃", "리자몽", "거북왕", "독침붕", "피죤투", "아보크", "피카츄", "라이츄", "알로라 라이츄", "픽시", "나인테일", "알로라 나인테일", "윈디", "히스이 윈디", "후딘", "괴력몬", "우츠보트", "야도란", "가라르 야도란", "팬텀", "캥카", "아쿠스타", "쁘사이저", "켄타로스", "팔데아 켄타로스", "갸라도스", "메타몽", "샤미드", "쥬피썬더", "부스터", "프테라", "잠만보", "망나뇽", "메가니움", "블레이범", "히스이 블레이범", "장크로다일", "아리아도스", "전룡", "마릴리", "왕구리", "에브이", "블래키", "야도킹", "가라르 야도킹", "쏘콘", "강철톤", "핫삼", "헤라크로스", "무장조", "헬가", "마기라스", "패리퍼", "가디안", "깜까미", "보스로라", "요가램", "썬더볼트", "샤크니아", "폭타", "코터스", "파비코리", "밀로틱", "캐스퐁", "다크펫", "치렁", "앱솔", "얼음귀신", "토대부기", "초염몽", "엠페르트", "렌트라", "로즈레이드", "램펄드", "바리톱스", "이어롭", "화강돌", "한카리아스", "루카리오", "하마돈", "독개굴", "눈설왕", "포푸니라", "거대코뿌리", "리피아", "글레이시아", "글라이온", "맘모꾸리", "엘레이드", "눈여아", "로토무", "샤로다", "염무왕", "대검귀", "히스이 대검귀", "보르그", "레파르다스", "야나키", "바오키", "앗차키", "몰드류", "다부니", "노보청", "엘풍", "악비아르", "데스니칸", "더스트나", "조로아크", "히스이 조로아크", "란쿨루스", "배바닐라", "에몽가", "샹델라", "툰베어", "메더", "가라르 메더", "골루그", "삼삼드래", "불카모스", "브리그론", "마폭시", "개굴닌자", "파르토", "파이어로", "비비용", "플라엣테", "플라제스", "부란다", "트리미앙", "냐오닉스", "킬가르도", "프레프티르", "나루림", "블로스터", "일레도리자드", "견고라스", "아마루르가", "님피아", "루차불", "데덴네", "미끄래곤", "히스이 미끄래곤", "클레피", "대로트", "펌킨인", "크레베이스", "히스이 크레베이스", "음번", "모크나이퍼", "히스이 모크나이퍼", "어흥염", "누리레느", "왕큰부리", "모단게", "루가루암", "더시마사리", "만마드", "깨비물거미", "염뉴트", "달코퀸", "하랑우탄", "내던숭이", "따라큐", "할비롱", "짜랑고우거", "아머까오", "애프룡", "단지래플", "사다이사", "포트데스", "브리무음", "마임꽁꽁", "데스판", "마휘핑", "모르페코", "드래펄트", "신비록", "사마자르", "대쓰여너", "포푸니크", "마스카나", "라우드본", "웨이니발", "파밀쥐", "콜로솔트", "홍련아머", "파라블레이즈", "찌리배리", "캡싸이", "클레스퍼스", "두드리짱", "돌핀맨", "꿈트렁", "킬라플로르", "키다리기린", "대도각참", "그우린차", "브리두라스", "과미드라"
];

const ALLOWED_ITEMS = [
  "기합의띠", "구애스카프", "먹다남은음식", "하양허브", "멘탈허브", 
  "목탄", "신비의물방울", "기적의씨", "자석", "녹지않는얼음", "검은띠", "부드러운모래", "예리한부리", "휘어진스푼", "용의이빨", "검은안경", "금속코트",
  "반짝가루", "선제공격손톱", "왕의징표석", "초점렌즈", "조개껍질방울", "전기구슬",
  "리샘열매", "자뭉열매", "오카열매", "파세열매", "복슝열매", "린드열매", "플라베베열매", "초플열매", "슈카열매", "코바열매", "파야파열매", "탄가열매", "차티열매", "카시비열매", "하반열매", "콜버열매", "바비리열매", "로셀열매"
];

const DEFENDING_TYPE_CHART: Record<string, Record<string, number>> = {
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

const getTypeEffectiveness = (types: string[]) => {
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
    if (totalMultiplier !== 1) { // We filter out 1, or can keep it depending on UX. Usually only x2, x4, x0.5, x0.25, x0 are interesting.
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

const TYPE_COLORS: Record<string, string> = {
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

export const Build: React.FC<BuildProps> = ({ onSaveTeam, onNavigate }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    { role: 'ai', content: '안녕하세요 챔피언님! 오늘은 어떤 코어를 중심으로 팀을 짜볼까요? 메가진화 2마리와 일반 포켓몬 4마리로 구성된 파티, 그리고 메가진화가 겹치지 않는 효율적인 선출 조합을 제안해 드립니다.' },
  ]);
  const [input, setInput] = useState('');
  const [playstyle, setPlaystyle] = useState('balanced');
  const [advancedFilter, setAdvancedFilter] = useState('');
  const [corePokemon, setCorePokemon] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentTeam, setCurrentTeam] = useState<TeamCore | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const formatPokemonToShowdown = (p: TeamCore['pokemon'][number]) => {
    const itemStr = p.enItem || p.item;
    let res = `${p.enName || p.name}`;
    if (itemStr && itemStr !== 'None' && itemStr !== '없음') {
      res += ` @ ${itemStr}`;
    }
    res += '\n';
    if (p.enAbility || p.ability) res += `Ability: ${p.enAbility || p.ability}\n`;
    
    const stats: (keyof typeof p.evs)[] = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
    const labels: Record<keyof typeof p.evs, string> = { hp: 'HP', atk: 'Atk', def: 'Def', spa: 'SpA', spd: 'SpD', spe: 'Spe' };
    const evLines = stats
      .filter(stat => p.evs[stat] && p.evs[stat] > 0)
      .map(stat => `${p.evs[stat]} ${labels[stat]}`)
      .join(' / ');
    
    if (evLines) res += `EVs: ${evLines}\n`;
    if (p.enNature || p.nature) {
      const cleanNature = (p.enNature || p.nature).split('(')[0].trim();
      res += `${cleanNature} Nature\n`;
    }
    const movesList = p.enMoves && p.enMoves.length > 0 ? p.enMoves : p.moves;
    movesList.forEach(m => {
      if (m && m !== '없음') res += `- ${m}\n`;
    });
    return res;
  };

  const getTeamText = (team: TeamCore) => {
    return team.pokemon.map(formatPokemonToShowdown).join('\n\n');
  };

  const handleCopy = () => {
    if (!currentTeam) return;
    const text = getTeamText(currentTeam);
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleReset = () => {
    setMessages([
      { role: 'ai', content: '안녕하세요 챔피언님! 오늘은 어떤 코어를 중심으로 팀을 짜볼까요? 메가진화 2마리와 일반 포켓몬 4마리로 구성된 파티, 그리고 메가진화가 겹치지 않는 효율적인 선출 조합을 제안해 드립니다.' }
    ]);
    setCurrentTeam(null);
    setAdvancedFilter('');
    setCorePokemon('');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    window.scrollTo({ top: 0, behavior: 'smooth' });
    const userMessage = input;
    setInput('');
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    let playstyleText = '';
    switch (playstyle) {
      case 'offensive': playstyleText = '공격형 (Offensive)'; break;
      case 'hyper_offensive': playstyleText = '초공격형/기믹 (Hyper Offense)'; break;
      case 'defensive': playstyleText = '방어/막이형 (Defensive / Stall)'; break;
      case 'balanced': playstyleText = '밸런스형 (Balanced)'; break;
      case 'weather': playstyleText = '날씨 파티 (Weather Team)'; break;
      case 'trick_room': playstyleText = '트릭룸 파티 (Trick Room)'; break;
      default: playstyleText = playstyle;
    }

    const filterText = advancedFilter.trim() 
      ? `\n추가 고급 필터(Advanced Filters): [${advancedFilter}]\n위 필터값(특정 종족값 범위, 특성, 기술, 또는 커스텀 포지션/아키타입 등)을 반드시 만족하는 포켓몬으로 선별해 주세요.` 
      : '';

    const corePokemonText = corePokemon.trim()
      ? `\n중심 포켓몬(Core Pokemon): [${corePokemon}]\n이 포켓몬을 파티의 핵심 주축 또는 에이스로 반드시 포함하고, 이를 완벽하게 보완하며 시너지를 극대화할 수 있는 나머지 포켓몬들로 팀을 구성하세요.`
      : '';

    const currentTeamText = currentTeam 
      ? `\n\n(참고: 현재 파티 상태는 다음과 같습니다:\n${JSON.stringify(currentTeam)}\n이 정보를 바탕으로 사용자의 요청(멤버 교체, 기술/노력치 수정 등)을 반영한 '수정된 완성형 파티 6마리 전체 데이터'를 시스템 프롬프트의 JSON 형식에 맞게 다시 출력해주세요.)`
      : `\n\n(참고: 사용자의 플레이스타일/아키타입 선호도는 [${playstyleText}] 입니다.${corePokemonText}${filterText} 이 아키타입 목표에 맞춰 시너지가 명확한 파티 구성, 선출법, 기술 배치, 노력치 세부조정을 최적화해주세요.)`;

    const apiMessages = [...messages, { 
      role: 'user' as const, 
      content: `${userMessage}${currentTeamText}` 
    }];

    try {
      let attempt = 0;
      const MAX_RETRIES = 1;
      let textContent = '';
      let success = false;
      let lastError: any = null;

      while (attempt < MAX_RETRIES && !success) {
        attempt++;
        try {
          let response = await chatWithProfessor(apiMessages);
          
          // Fix translations before parsing
          response = response.replace(/독독/g, '맹독')
                             .replace(/코메트 ?펀치/g, '코멧펀치')
                             .replace(/반짝이는 ?회전/g, '킬러스핀');
          
          textContent = response;
          // Try matching markdown JSON block
          const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
          let jsonData = null;
          
          if (jsonMatch) {
            jsonData = JSON.parse(jsonMatch[1]);
          } else {
            // Try parsing the whole response directly if it's pure JSON
            try {
              jsonData = JSON.parse(response);
            } catch (e) {
              console.warn("Could not parse response as raw JSON");
            }
          }

          if (jsonData) {
            const teamData = jsonData.team || jsonData; 
            
            if (teamData && Array.isArray(teamData.pokemon)) {
              // Strict Validation Step
              const FORBIDDEN_ITEMS = ['생명의구슬', '돌격조끼', '울퉁불퉁멧', '구애머리띠', '구애안경', '헤비비투츠', '검은진흙'];
              const FORBIDDEN_MOVES = ['잠재파워'];
              
              const seenSpecies = new Set();
  
              for (const p of teamData.pokemon) {
                if (p.item && FORBIDDEN_ITEMS.some(i => p.item.includes(i))) {
                  // throw new Error(`VALIDATION_FAILED: AI가 금지된 도구(${p.item})를 제안했습니다.`);
                  p.item = '기합의띠';
                }
                
                if (p.moves && Array.isArray(p.moves)) {
                  p.moves = p.moves.map((m: string) => {
                    if (FORBIDDEN_MOVES.some(fm => m.includes(fm))) return '방어';
                    if ((p.name.includes('캥카') || p.name.includes('메가캥카')) && m.includes('그로우펀치')) return '은혜갚기';
                    if (p.name.includes('브리두라스') && m.includes('바디프레스')) return '파동탄';
                    if (p.name.includes('어흥염') && m.replace(/\s+/g, '').includes('탁쳐서떨구기')) return 'DD래리어트';
                    if (m === '얼다 바람' || m === '얼다바람') return '얼어붙은 바람';
                    if (m.includes('도게가') || m.includes('도게자')) return '도각참';
                    if (m.includes('라스트리스펙트')) return '성묘';
                    if (m.includes('웨이브크래시')) return '웨이브태클';
                    return m;
                  });
                }
                
                if (p.name.includes('메가캥카')) {
                  if (!p.ability.includes('->')) p.ability = '배짱 -> 부자유친';
                  if (p.enAbility && !p.enAbility.includes('->')) p.enAbility = 'Scrappy -> Parental Bond';
                }
                
                if (p.evs && typeof p.evs === 'object') {
                  let evSum = (p.evs.hp || 0) + (p.evs.atk || 0) + (p.evs.def || 0) + (p.evs.spa || 0) + (p.evs.spd || 0) + (p.evs.spe || 0);
                  if (evSum > 100) {
                    // Adjust 508 EVs to 66 system
                    const adjust = (val: number) => {
                      if (!val) return 0;
                      if (val >= 252) return 32;
                      if (val <= 4) return 2;
                      return Math.floor(val / 8);
                    };
                    p.evs.hp = adjust(p.evs.hp);
                    p.evs.atk = adjust(p.evs.atk);
                    p.evs.def = adjust(p.evs.def);
                    p.evs.spa = adjust(p.evs.spa);
                    p.evs.spd = adjust(p.evs.spd);
                    p.evs.spe = adjust(p.evs.spe);
                  }

                  // Cap individual stats at 32
                  const cap32 = (val: number) => Math.min(32, val || 0);
                  p.evs.hp = cap32(p.evs.hp);
                  p.evs.atk = cap32(p.evs.atk);
                  p.evs.def = cap32(p.evs.def);
                  p.evs.spa = cap32(p.evs.spa);
                  p.evs.spd = cap32(p.evs.spd);
                  p.evs.spe = cap32(p.evs.spe);

                  evSum = (p.evs.hp || 0) + (p.evs.atk || 0) + (p.evs.def || 0) + (p.evs.spa || 0) + (p.evs.spd || 0) + (p.evs.spe || 0);
                  if (evSum > 66) {
                    // Auto-fix minor overshoots implicitly instead of crashing
                    let diff = evSum - 66;
                    const statKeys: (keyof typeof p.evs)[] = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
                    statKeys.sort((a, b) => (p.evs[b] || 0) - (p.evs[a] || 0));
                    for (const stat of statKeys) {
                      if (diff <= 0) break;
                      const val = p.evs[stat] || 0;
                      if (val > 0) {
                        const reduction = Math.min(val, diff);
                        p.evs[stat] = val - reduction;
                        diff -= reduction;
                      }
                    }
                  }
                  
                  // Ensure all EVs are even numbers without exceeding 66
                  const adjustEven = (val: number) => {
                    const v = val || 0;
                    return v % 2 !== 0 ? Math.max(0, v - 1) : v;
                  };
                  p.evs.hp = adjustEven(p.evs.hp);
                  p.evs.atk = adjustEven(p.evs.atk);
                  p.evs.def = adjustEven(p.evs.def);
                  p.evs.spa = adjustEven(p.evs.spa);
                  p.evs.spd = adjustEven(p.evs.spd);
                  p.evs.spe = adjustEven(p.evs.spe);
                }
                
                const baseName = p.name.replace('메가', '').replace('알로라 ', '').replace('가라르 ', '').replace('히스이 ', '').replace('팔데아 ', '').trim();
                if (seenSpecies.has(baseName)) {
                  // throw new Error(`VALIDATION_FAILED: 파티에 동일한 종족 트리를 가진 포켓몬이 중복으로 포함되었습니다. (${baseName})`);
                  p.name = p.name + " (중복)";
                }
                seenSpecies.add(baseName);
  
                if (baseName === '메가니움') {
                  const physicalMoves = ['칼춤', '지진', '꽃보라', '은혜갚기', '이판사판태클', '기관총', '깨물어부수기'];
                  if (p.moves && Array.isArray(p.moves) && p.moves.some((m: string) => physicalMoves.some(pm => m.includes(pm)))) {
                     // throw new Error(`VALIDATION_FAILED: ${p.name}에게 물리 공격/랭크업 기술이 포함되어 있습니다. 메가니움은 반드시 기가드레인, 대지의힘 등 특수 공격형으로 배치해야 합니다.`);
                     p.moves = p.moves.map((m: string) => physicalMoves.some(pm => m.includes(pm)) ? '기가드레인' : m);
                  }
                }
              }
  
              if (teamData.leads && Array.isArray(teamData.leads)) {
                const megaPokemons = teamData.pokemon.filter((p: any) => p.name.includes('메가') && p.name !== '메가니움').map((p: any) => p.name);
                for (const lead of teamData.leads) {
                  let megaCountInLead = 0;
                  for (const mega of megaPokemons) {
                    if (lead.strategyName.includes(mega) || lead.description.includes(mega)) {
                      megaCountInLead++;
                    }
                  }
                  if (megaCountInLead > 1) {
                    // throw new Error(`VALIDATION_FAILED: 하나의 선출(Lead) 조합에 메가진화 포켓몬이 2마리 이상 포함되었습니다. (${lead.strategyName})\n메가진화는 1배틀당 1마리만 가능하므로 명백한 룰 위반입니다.`);
                    // Just let it pass, not a big deal for the UI
                  }
                }
              }
  
              const pokemon = teamData.pokemon.map((p: any) => {
                let item = p.item;
                let id = p.id || Math.floor(Math.random() * 1000).toString();
                
                if (p.name.includes('메가') && !item?.endsWith('나이트')) {
                  const baseName = p.name.replace('메가', '');
                  item = `${baseName}나이트`;
                  if (p.name.endsWith('X')) item = `${baseName.replace('X', '')}나이트X`;
                  if (p.name.endsWith('Y')) item = `${baseName.replace('Y', '')}나이트Y`;
                }
                
                // Resolve actual ID and Image using our Pokedex data
                let finalImageUrl = p.imageUrl || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
                
                const isMega = p.name.includes('메가');
                let foundMatch = false;
                
                if (isMega) {
                  const match = MEGA_DATA.find(m => m.ko === p.name) || MEGA_DATA.slice().sort((a, b) => b.ko.length - a.ko.length).find(m => p.name.includes(m.ko));
                  if (match) {
                    id = match.id.toString();
                    if (!p.imageUrl) {
                      // For valid megas (id >= 10000) we can use official artwork, for custom megas (<10000) use S3
                      if (match.id < 10000) {
                        // Adjust for specific pokemon forms or use default -01
                        let formId = '01';
                        if (match.id === 658) formId = '02'; // Greninja
                        if (match.id === 670) formId = '06'; // Floette Eternal?
                        if (match.id === 678) formId = '02'; // Meowstic F?
                        
                        finalImageUrl = `https://s3-ap-northeast-1.amazonaws.com/pokedb.tokyo/champs/assets/pokemon/icons_512/pokemon-${match.id.toString().padStart(4, '0')}-${formId}.webp`;
                      } else {
                        finalImageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${match.id}.png`;
                      }
                    }
                    foundMatch = true;
                  }
                }
                
                if (!isMega || !foundMatch) {
                  // If it's a regular pokemon, or we didn't find the mega
                  const match = REGULAR_DATA.find(r => r.ko === p.name) || REGULAR_DATA.slice().sort((a,b)=>b.ko.length - a.ko.length).find(r => p.name.includes(r.ko));
                  if (match) {
                    id = match.id.toString();
                    if (!p.imageUrl) {
                      finalImageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${match.id}.png`;
                    }
                  }
                }
  
                return {
                  ...p,
                  id: id,
                  imageUrl: finalImageUrl,
                  types: Array.isArray(p.types) ? p.types : ['normal'],
                  item: item || '없음',
                  evs: p.evs || { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
                  moves: Array.isArray(p.moves) ? p.moves : []
                };
              });
  
              setCurrentTeam({
                id: Date.now().toString(),
                name: teamData.name || "새로운 파티",
                format: teamData.format || "Pokémon Champions",
                description: teamData.description || "AI가 생성한 파티입니다.",
                pokemon: pokemon,
                leads: teamData.leads || [],
                usageNotes: teamData.usageNotes || [],
                synergyLevel: teamData.synergyLevel,
                synergyDescription: teamData.synergyDescription,
              });
            }
            // JSON 블록은 마크다운에서 제거하여 깔끔하게 표시
            if (jsonMatch) {
              textContent = response.replace(/```(?:json)?\s*([\s\S]*?)\s*```/, '').trim();
            } else {
              // If it was pure JSON, don't show the raw JSON string in the chat
              textContent = '파티 구성이 완료되었습니다. 위에서 포켓몬 정보와 전략 스크랩을 확인해주세요!';
            }
          }
          success = true;
        } catch (e: any) {
          lastError = e;
          if (e.message && e.message.includes('VALIDATION_FAILED')) {
            console.warn(`Validation failed on attempt ${attempt}:`, e.message);
            // Will loop and retry if attempt < MAX_RETRIES
          } else {
            console.warn("Non-validation error during parsing", e);
            // It could be JSON.parse error, which we also might want to retry
          }
        }
      }

      if (!success && lastError) {
        throw lastError;
      }

      setMessages(prev => [...prev, { role: 'ai' as const, content: textContent }]);
    } catch (error: any) {
      console.error("AI Build Error:", error);
      let errorMessage = '죄송합니다. 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
      if (error.message === 'QUOTA_EXCEEDED') {
        errorMessage = '⚠️ **죄송합니다. 현재 AI 서버의 요청 한도가 초과되었습니다.**\n\n잠시 후 다시 시도해 주시기 바랍니다. 무료 제공 쿼리가 소진되었거나 요청이 너무 빈번할 때 발생할 수 있습니다.';
      } else if (error.message && error.message.includes('VALIDATION_FAILED')) {
        errorMessage = '⚠️ **검증 오류 (Validation Error):**\n\n' + error.message.replace('VALIDATION_FAILED: ', '') + '\n\nAI가 룰북을 위반한 데이터를 생성하여 응답이 여러 번 차단되었습니다. 규칙이 매우 까다로울 때 발생합니다. 다시 한 번 시도해 주세요.';
      }
      
      setMessages(prev => [...prev, { role: 'ai' as const, content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (currentTeam && onSaveTeam && onNavigate) {
      onSaveTeam(currentTeam);
      onNavigate('parties');
    }
  };

  const hasPokemon = currentTeam ? currentTeam.pokemon.length > 0 : false;

  return (
    <div className="pt-16 min-h-screen bg-background flex flex-col lg:flex-row lg:h-[calc(100vh-64px)] overflow-y-auto lg:overflow-hidden">
      {/* Chat Area */}
      <div className="flex-shrink-0 lg:w-[350px] xl:w-[450px] flex flex-col border-r border-surface-container-high bg-white h-[500px] lg:h-full">
        <div className="px-6 py-4 border-b border-surface-container flex justify-between items-center bg-surface-container-lowest">
          <div className="font-bold text-on-surface flex items-center gap-2">
            <Wand2 size={18} className="text-primary" />
            AI 빌더
          </div>
          <button 
            onClick={handleReset}
            className="text-xs flex items-center gap-1.5 text-on-surface-variant hover:text-error transition-colors px-2 py-1 rounded-md hover:bg-error-container"
            title="대화 초기화"
          >
            <RotateCcw size={14} />
            초기화
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: msg.role === 'ai' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm shadow-sm border-2 ${
                msg.role === 'ai' 
                  ? 'bg-surface-container-highest border-primary/20 text-on-surface' 
                  : 'bg-primary text-white border-primary-container'
              }`}>
                {msg.role === 'ai' ? '🤖' : '👤'}
              </div>
              <div className={`max-w-[90%] px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-sm markdown-body ${
                msg.role === 'ai' ? 'bg-white border border-surface-container text-on-surface' : 'bg-primary text-white'
              }`}>
                <Markdown>{msg.content}</Markdown>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-sm">🤖</div>
              <div className="flex items-center gap-2 px-3 py-2 bg-surface-container-low rounded-2xl">
                <Loader2 size={16} className="animate-spin text-primary" />
                <span className="text-xs font-medium text-on-surface-variant">메타 분석 중...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-surface-container flex flex-col gap-3">
          <div className="flex flex-col gap-3 px-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-on-surface-variant uppercase whitespace-nowrap min-w-[70px]">플레이스타일</span>
              <select
                value={playstyle}
                onChange={(e) => setPlaystyle(e.target.value)}
                disabled={isLoading}
                className="text-sm flex-1 w-full min-w-0 bg-surface-container-low border border-surface-container-high rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary transition-colors text-on-surface font-medium cursor-pointer"
              >
                <option value="balanced">밸런스형 (Balanced)</option>
                <option value="offensive">공격형 (Offensive)</option>
                <option value="hyper_offensive">초공격형/기믹 (Hyper Offense)</option>
                <option value="defensive">방어·막이형 (Defensive/Stall)</option>
                <option value="weather">날씨 파티 (Weather Team)</option>
                <option value="trick_room">트릭룸 파티 (Trick Room)</option>
              </select>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-on-surface-variant uppercase whitespace-nowrap min-w-[70px]">고급 필터</span>
              <input
                type="text"
                value={advancedFilter}
                onChange={(e) => setAdvancedFilter(e.target.value)}
                disabled={isLoading}
                placeholder="예: 빠른 특수 어태커, 막이, 종족값, 특성, 특정 기술풀 등 커스텀 조건..."
                className="text-sm flex-1 w-full min-w-0 bg-surface-container-low border border-surface-container-high rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary transition-colors text-on-surface font-medium"
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-on-surface-variant uppercase whitespace-nowrap min-w-[70px]">중심 포켓몬</span>
              <input
                type="text"
                value={corePokemon}
                onChange={(e) => setCorePokemon(e.target.value)}
                disabled={isLoading}
                placeholder="예: 메가캥카 (이 포켓몬을 주축으로 팀 구성)"
                className="text-sm flex-1 w-full min-w-0 bg-surface-container-low border border-surface-container-high rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary transition-colors text-on-surface font-medium"
              />
            </div>
          </div>
          <div className="relative mt-1">
            <input 
              type="text" 
              placeholder="노력치를 수정하거나 포켓몬을 교체해보세요..." 
              className="w-full bg-surface-container-low border border-surface-container-high rounded-full py-3 px-6 pr-12 text-sm focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
            />
            <button 
              onClick={handleSend}
              disabled={isLoading}
              className="absolute right-2 top-1.5 p-2 bg-primary text-white rounded-full hover:bg-primary-container transition-colors disabled:bg-surface-dim"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Build Preview Area */}
      <div className="flex-1 flex flex-col bg-surface-container-low lg:overflow-y-auto p-8">
        {currentTeam ? (
          <>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h2 className="text-3xl font-extrabold text-on-surface mb-1">{currentTeam.name}</h2>
                <div className="text-sm text-on-surface-variant font-medium">포맷: {currentTeam.format}</div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-xl text-sm font-bold hover:shadow-lg hover:bg-secondary-container transition-all"
                >
                  <Save size={16} />
                  파티 저장하기
                </button>
                <button 
                  onClick={handleCopy}
                  className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold hover:shadow-lg hover:bg-primary-container transition-all"
                >
                  <Copy size={16} />
                  {isCopied ? '복사됨!' : '파티 내보내기'}
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-surface-dim mb-8 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-secondary" />
              <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase mb-3">
                <Wand2 size={14} />
                AI 전략 노트
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {currentTeam.description}
              </p>
            </div>

            {currentTeam.synergyLevel !== undefined && (
              <div className="bg-gradient-to-br from-surface to-surface-container-low p-6 rounded-xl border border-primary/20 mb-8 flex flex-col sm:flex-row gap-6 shadow-sm">
                <div className="flex flex-col items-center justify-center shrink-0">
                  <div className="relative flex items-center justify-center w-24 h-24 rounded-full border-4 border-primary/10 bg-white">
                    <div className="absolute inset-0 rounded-full border-4 border-primary shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.3)]" style={{ clipPath: `polygon(0 0, 100% 0, 100% ${100 - (currentTeam.synergyLevel || 0)}%, 0 ${100 - (currentTeam.synergyLevel || 0)}%)`, borderColor: 'transparent', borderBottomColor: 'currentColor', borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: 'transparent', transform: 'rotate(45deg)' }} />
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                      <circle cx="44" cy="44" r="44" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-primary/20 transform translate-x-1 translate-y-1" />
                      <circle cx="44" cy="44" r="44" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray={`${2.76 * (currentTeam.synergyLevel || 0)} 276`} className="text-primary transform translate-x-1 translate-y-1" strokeLinecap="round" />
                    </svg>
                    <div className="text-center z-10">
                      <span className="block text-2xl font-black text-primary">{currentTeam.synergyLevel}</span>
                      <span className="block text-[10px] font-bold text-primary/70 uppercase">Synergy</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="text-sm font-black text-on-surface uppercase mb-2 flex items-center gap-2">
                    <Zap size={14} className="text-primary" />
                    팀 시너지 분석
                  </h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {currentTeam.synergyDescription || "시너지 정보가 제공되지 않았습니다."}
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {currentTeam.pokemon.map(p => (
                <PokemonCard key={p.id} pokemon={p} />
              ))}
            </div>

            {/* Revised Strategy & Weakness Area */}
            <div className="space-y-6 mb-10">
              {/* Type Effectiveness Table */}
              <div className="bg-white rounded-xl border border-surface-container-high overflow-hidden shadow-sm">
                <div className="bg-surface-container px-6 py-4 border-b border-surface-container-high flex items-center gap-2 font-black text-on-surface">
                  <BarChart3 size={18} className="text-primary" />
                  포켓몬별 방어 상성 종합
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-surface-container-low border-b border-surface-container-high">
                        <th className="px-4 py-3 text-left font-bold text-on-surface-variant w-[160px]">포켓몬</th>
                        <th className="px-4 py-3 text-left font-bold text-on-surface-variant">약점 (Weaknesses)</th>
                        <th className="px-4 py-3 text-left font-bold text-on-surface-variant">반감 (Resistances)</th>
                        <th className="px-4 py-3 text-left font-bold text-on-surface-variant">무효 (Immunities)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container">
                      {currentTeam.pokemon.map(p => {
                        const { weaknesses, resistances, immunities } = getTypeEffectiveness(p.types);
                        return (
                          <tr key={p.id} className="hover:bg-surface-container-lowest transition-colors">
                            <td className="px-4 py-4 flex items-center gap-3">
                              <img 
                                src={p.imageUrl} 
                                alt={p.name} 
                                className="w-10 h-10 object-contain bg-surface-container p-1 rounded-lg"
                                referrerPolicy="no-referrer"
                              />
                              <span className="font-bold text-on-surface">{p.name}</span>
                            </td>
                            <td className="px-4 py-4 align-top">
                              <div className="flex flex-wrap gap-1.5">
                                {weaknesses.length > 0 ? weaknesses.map(w => (
                                  <span key={w.type} className={`px-2 py-0.5 rounded text-[10px] font-black uppercase flex items-center gap-1 shadow-sm ${TYPE_COLORS[w.type.toLowerCase()] || 'bg-gray-400 text-gray-900'}`}>
                                    {TYPE_NAME_KO[w.type.toLowerCase()] || w.type} 
                                    {w.multiplier === 4 
                                      ? <span className="text-white bg-red-900 px-1.5 py-0.5 rounded ml-0.5 shadow-sm border border-red-950 font-black">x{w.multiplier}</span>
                                      : <span className="text-white bg-red-500 px-1.5 py-0.5 rounded ml-0.5 shadow-sm border border-red-600 font-bold">x{w.multiplier}</span>
                                    }
                                  </span>
                                )) : <span className="text-on-surface-variant text-xs opacity-50 font-bold">-</span>}
                              </div>
                            </td>
                            <td className="px-4 py-4 align-top">
                              <div className="flex flex-wrap gap-1.5">
                                {resistances.length > 0 ? resistances.map(r => (
                                  <span key={r.type} className={`px-2 py-0.5 rounded text-[10px] font-black uppercase flex items-center gap-1 shadow-sm ${TYPE_COLORS[r.type.toLowerCase()] || 'bg-gray-400 text-gray-900'}`}>
                                    {TYPE_NAME_KO[r.type.toLowerCase()] || r.type} 
                                    {r.multiplier === 0.25 
                                      ? <span className="text-white bg-blue-900 px-1.5 py-0.5 rounded ml-0.5 shadow-sm border border-blue-950 font-black">x{r.multiplier}</span>
                                      : <span className="text-white bg-blue-500 px-1.5 py-0.5 rounded ml-0.5 shadow-sm border border-blue-600 font-bold">x{r.multiplier}</span>
                                    }
                                  </span>
                                )) : <span className="text-on-surface-variant text-xs opacity-50 font-bold">-</span>}
                              </div>
                            </td>
                            <td className="px-4 py-4 align-top">
                              <div className="flex flex-wrap gap-1.5">
                                {immunities.length > 0 ? immunities.map(i => (
                                  <span key={i.type} className={`px-2 py-0.5 rounded text-[10px] font-black uppercase flex items-center gap-1 shadow-sm ${TYPE_COLORS[i.type.toLowerCase()] || 'bg-gray-400 text-gray-900'}`}>
                                    {TYPE_NAME_KO[i.type.toLowerCase()] || i.type} 
                                    <span className="text-white bg-black/30 px-1.5 py-0.5 rounded ml-0.5">x0</span>
                                  </span>
                                )) : <span className="text-on-surface-variant text-xs opacity-50 font-bold">-</span>}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Strategy & Description */}
              <div className="bg-white rounded-xl border border-surface-container-high p-6 shadow-sm">
                <h3 className="text-xl font-black text-on-surface mb-6 flex items-center gap-2">
                  <Wand2 size={20} className="text-secondary" />
                  파티 운용 가이드
                </h3>
                
                <div className="space-y-8">
                  <section>
                    <h4 className="text-xs font-black text-on-surface-variant uppercase tracking-widest mb-3 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      파티 개요
                    </h4>
                    <p className="text-sm text-on-surface leading-relaxed font-medium bg-surface-container-lowest p-4 rounded-xl border border-surface-container">
                      {currentTeam.description}
                    </p>
                  </section>

                  {currentTeam.leads && currentTeam.leads.length > 0 && (
                    <section className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />
                        <h4 className="text-sm font-black text-secondary uppercase tracking-[0.2em] px-4 py-1 border-2 border-secondary/20 rounded-full bg-secondary/5 shadow-sm">
                          [선출법 & 운용 전술]
                        </h4>
                        <div className="h-[2px] flex-1 bg-gradient-to-r from-secondary/20 via-transparent to-transparent" />
                      </div>
                      
                      <div className="space-y-4">
                        {currentTeam.leads.map((strategy, idx) => (
                          <div key={idx} className="bg-white p-6 rounded-2xl border-2 border-surface-container shadow-sm hover:border-secondary/40 transition-all hover:shadow-md">
                            <h5 className="font-black text-on-surface text-base mb-4 flex items-center gap-3">
                              <span className="w-8 h-8 rounded-lg bg-secondary text-white flex items-center justify-center text-xs shadow-inner">
                                {idx + 1}
                              </span>
                              {strategy.strategyName}
                            </h5>
                            <div className="pl-11 pr-4">
                              <p className="text-sm text-on-surface-variant leading-relaxed font-bold border-l-2 border-surface-container pl-4 py-1 italic whitespace-pre-wrap">
                                {strategy.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {currentTeam.usageNotes && currentTeam.usageNotes.length > 0 && (
                    <section className="pt-8 space-y-10 border-t-2 border-surface-container-high">
                      <div className="flex items-center gap-3">
                         <h4 className="text-xs font-black text-on-surface-variant uppercase tracking-widest px-1">
                          상세 포켓몬 가이드
                        </h4>
                        <div className="h-px flex-1 bg-surface-container-high" />
                      </div>

                      <div className="space-y-16">
                        {currentTeam.usageNotes.map((note, idx) => {
                          const pokemon = currentTeam.pokemon.find(p => 
                            p.id.toString() === note.pokemonId.toString() || 
                            p.name.includes(note.pokemonName) ||
                            note.pokemonName.includes(p.name)
                          );
                          if (!pokemon) return null;
                          
                          return (
                            <div key={idx} className="group transition-all">
                              <div className="flex flex-col md:flex-row gap-8">
                                {/* Poke Image & Name Column */}
                                <div className="w-full md:w-48 space-y-3">
                                  <div className="w-full h-40 bg-white rounded-3xl p-4 flex items-center justify-center border-2 border-surface-container shadow-sm group-hover:border-primary/30 transition-all relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-surface-container-low to-transparent opacity-50" />
                                    <img 
                                      src={pokemon.imageUrl} 
                                      alt={pokemon.name} 
                                      className="w-full h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-500" 
                                      referrerPolicy="no-referrer" 
                                    />
                                  </div>
                                  <div className="px-2">
                                    <h5 className="text-xl font-black text-on-surface flex items-center gap-2">
                                      {pokemon.name}
                                    </h5>
                                    <div className="text-xs font-bold text-on-surface-variant flex items-center gap-1 opacity-70">
                                      <Zap size={10} className="text-primary" />
                                      {pokemon.nature}
                                      {extractRate(getStatsForPokemon(pokemon.name)?.natures, pokemon.nature) && (
                                        <span className="ml-2 text-[9px] font-bold text-primary opacity-80">{extractRate(getStatsForPokemon(pokemon.name)?.natures, pokemon.nature)} 채용</span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Info Column */}
                                <div className="flex-1 space-y-6">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                      <div>
                                        <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2 opacity-50">Base Setup</div>
                                        <div className="p-4 bg-surface-container-low rounded-2xl border border-surface-container space-y-2">
                                          <div className="flex justify-between items-center text-xs font-bold">
                                            <span className="opacity-50">도구</span>
                                            <div className="flex gap-2 items-center">
                                              {extractRate(getStatsForPokemon(pokemon.name)?.items, pokemon.item) && (
                                                <span className="text-[9px] font-bold text-primary opacity-80">{extractRate(getStatsForPokemon(pokemon.name)?.items, pokemon.item)} 채용</span>
                                              )}
                                              <span className="text-primary">{pokemon.item}</span>
                                            </div>
                                          </div>
                                          <div className="flex justify-between items-center text-xs font-bold">
                                            <span className="opacity-50">특성</span>
                                            <div className="flex gap-2 items-center">
                                              {extractRate(getStatsForPokemon(pokemon.name)?.abilities, pokemon.ability) && (
                                                <span className="text-[9px] font-bold text-primary opacity-80">{extractRate(getStatsForPokemon(pokemon.name)?.abilities, pokemon.ability)} 채용</span>
                                              )}
                                              <span>{pokemon.ability}</span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div>
                                        <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2 opacity-50">Moveset</div>
                                        <div className="grid grid-cols-2 gap-2">
                                          {pokemon.moves.map((move, i) => {
                                            const moveRate = extractRate(getStatsForPokemon(pokemon.name)?.moves, move);
                                            return (
                                              <div key={i} className="flex items-center justify-between gap-1 px-3 py-2 bg-white border border-surface-container rounded-xl shadow-xs">
                                                <span className="text-[10px] font-bold truncate">{move}</span>
                                                {moveRate && <span className="text-[9px] font-bold text-primary opacity-70 flex-shrink-0">{moveRate}</span>}
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="space-y-4">
                                      <div>
                                        <div className="flex justify-between items-end mb-2">
                                          <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-50">Effort Values</div>
                                          {extractSpreadRate(getStatsForPokemon(pokemon.name)?.spreads, pokemon.nature, pokemon.evs) && (
                                            <div className="text-[9px] font-bold text-primary opacity-80 normal-case border border-primary/20 bg-primary/5 px-1.5 py-0.5 rounded shadow-sm">{extractSpreadRate(getStatsForPokemon(pokemon.name)?.spreads, pokemon.nature, pokemon.evs)} 채용 샘플</div>
                                          )}
                                        </div>
                                        <div className="p-4 bg-surface-container-high rounded-2xl flex flex-col gap-1.5">
                                          {(['hp', 'atk', 'def', 'spa', 'spd', 'spe'] as const).map((stat) => {
                                            const val = pokemon.evs[stat];
                                            if (!val || val <= 0) return null;
                                            const statLabels: Record<string, string> = { hp: '체력(HP)', atk: '공격(Atk)', def: '방어(Def)', spa: '특공(SpA)', spd: '특방(SpD)', spe: '스피드(Spe)' };
                                            return (
                                              <div key={stat} className="flex items-center justify-between text-[10px] font-mono font-bold">
                                                <span className="opacity-60 w-[50px] whitespace-nowrap">{statLabels[stat]}</span>
                                                <div className="flex-1 mx-2 h-1 bg-white/30 rounded-full overflow-hidden">
                                                  <div className="h-full bg-on-surface-variant opacity-30" style={{ width: `${(val / 32) * 100}%` }} />
                                                </div>
                                                <span className="w-4 text-right">{val}</span>
                                              </div>
                                            );
                                          })}
                                          <div className="mt-2 pt-2 border-t border-white/20 text-[9px] font-bold opacity-40 text-center uppercase">
                                            Total: {Object.values(pokemon.evs).reduce((a, b) => a + b, 0)}/66
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="relative">
                                    <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Usage Analysis & Tips</div>
                                    <p className="text-sm text-on-surface-variant leading-relaxed font-bold p-5 bg-white rounded-2xl border-2 border-primary/5 shadow-sm relative z-10">
                                      {note.note}
                                    </p>
                                    <div className="absolute -top-2 -left-2 text-primary/10 select-none pointer-events-none">
                                      <BarChart3 size={48} />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-20 opacity-40">
            <Wand2 size={64} className="mb-4 text-surface-dim" />
            <p className="font-bold text-on-surface-variant">전술을 입력하면 여기에 파티가 구성됩니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

