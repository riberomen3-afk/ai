import { POKEMON_STATS } from '../data/pokemonStats';

export function getStatsForPokemon(name: string) {
  if (POKEMON_STATS[name]) return POKEMON_STATS[name];
  
  const baseName = name.replace(/^메가/, '').replace(/X$/, '').replace(/Y$/, '');
  if (POKEMON_STATS[baseName]) return POKEMON_STATS[baseName];
  
  const keys = Object.keys(POKEMON_STATS);
  for (const k of keys) {
    if (k.replace(/\s*\(.*\)/g, '') === baseName) return POKEMON_STATS[k];
    if (k.includes("로토무") && name.includes("로토무")) {
      if (name.includes("워시") && k.includes("워시")) return POKEMON_STATS[k];
      if (name.includes("히트") && k.includes("히트")) return POKEMON_STATS[k];
      if (name.includes("커트") && k.includes("커트")) return POKEMON_STATS[k];
      if (name.includes("스핀") && k.includes("스핀")) return POKEMON_STATS[k];
      if (name.includes("프로스트") && k.includes("프로스트")) return POKEMON_STATS[k];
    }
    if (name.includes("알로라") && k.includes("알로라")) {
      if (k.includes(baseName.replace('알로라 ', ''))) return POKEMON_STATS[k];
    }
  }
  return null;
}

export function extractRate(list: string[] | undefined, target: string): string | null {
  if (!list) return null;
  let searchTarget = target.split("(")[0].trim();
  
  for (const item of list) {
    if (item.startsWith(searchTarget + "(")) {
      const match = item.match(/\((.*?)\)/);
      return match ? match[1] : null;
    }
  }
  
  if (target.includes("->")) {
    const parts = target.split("->").map(p => p.trim());
    for (const p of parts) {
      for (const item of list) {
        if (item.startsWith(p + "(")) {
          const match = item.match(/\((.*?)\)/);
          return match ? match[1] : null;
        }
      }
    }
  }

  if (searchTarget.includes("나이트")) {
    for (const item of list) {
      if (item.startsWith(searchTarget + "(")) {
        const match = item.match(/\((.*?)\)/);
        return match ? match[1] : null;
      }
    }
  }
  return null;
}

export function extractSpreadRate(list: string[] | undefined, nature: string, evs: Record<string, number>): string | null {
  if (!list) return null;
  const evString = `HP:${evs.hp || 0}/Atk:${evs.atk || 0}/Def:${evs.def || 0}/SpA:${evs.spa || 0}/SpD:${evs.spd || 0}/Spe:${evs.spe || 0}`;
  const target = `${evString}`;
  
  for (const item of list) {
    if (item.startsWith(target + "(")) {
      const match = item.match(/\((.*?)\)/);
      return match ? match[1] : null;
    }
  }
  return null;
}
