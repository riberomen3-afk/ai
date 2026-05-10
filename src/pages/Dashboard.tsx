import React, { useState, useEffect } from 'react';
import { POKEMON_KO_NAMES } from '../pokemonNames';
import { TrendingUp, RefreshCw } from 'lucide-react';
import { TeamCore } from '../types';

const ChampsUsageRates = () => {
  const [topPokemon, setTopPokemon] = useState<{rank: number, id: number, name: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchUsage = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent('https://champs.pokedb.tokyo/pokemon/list?rule=0'));
      const html = await res.text();
      
      const dateMatch = html.match(/更新日[\s\S]*?<span class="tag is-light">([^<]+)<\/span>/);
      if (dateMatch) {
        setLastUpdated(dateMatch[1]);
      }
      
      const pattern = /<i class="poke-icon-128 dex-([0-9]{4})-([0-9]{2})-128"><\/i>[\s\S]*?<div class="pokemon-name">([^<]+)<\/div>/g;
      const matches = [...html.matchAll(pattern)];
      
      const rankings = matches.slice(0, 50).map((m, idx) => {
        const id = parseInt(m[1], 10);
        const jpName = m[3];
        let koName = POKEMON_KO_NAMES[id] || jpName;
        return { rank: idx + 1, id, name: koName };
      });
      setTopPokemon(rankings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsage();
  }, []);

  return (
    <div className="bg-white rounded-xl border border-surface-container-high p-6 shadow-sm relative overflow-hidden">
      <div className="absolute -top-4 -right-4 text-primary/10">
        <TrendingUp size={64} />
      </div>
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h4 className="text-lg font-black text-on-surface uppercase tracking-widest flex items-center gap-2">
          <TrendingUp size={20} className="text-primary" />
          글로벌 통계 (시즌 M)
        </h4>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs font-bold text-on-surface-variant bg-surface-container-low px-2 py-1 rounded-md">
              업데이트: {lastUpdated}
            </span>
          )}
          <button 
            onClick={fetchUsage} 
            disabled={loading}
            className="p-2 border border-surface-container-highest rounded-lg bg-surface text-on-surface hover:bg-surface-container-low transition-colors disabled:opacity-50"
            title="사용률 갱신"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>
      <div className="relative z-10">
        {loading && topPokemon.length === 0 ? (
          <div className="text-sm text-on-surface-variant font-bold animate-pulse py-8 text-center flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            통계를 불러오는 중...
          </div>
        ) : topPokemon.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-10 gap-3">
            {topPokemon.map((poke) => (
              <div key={poke.rank} className="flex flex-col items-center bg-surface p-4 rounded-2xl border border-surface-container-highest shadow-sm hover:shadow-md hover:border-primary/50 transition-all group">
                <span className="text-xs font-black text-on-surface-variant/70 mb-2 w-full text-left">#{poke.rank}</span>
                <div className="relative w-24 h-24 bg-surface-container-low rounded-full flex items-center justify-center mb-3 overflow-hidden group-hover:bg-primary/5 transition-colors">
                  <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.id}.png`} alt={poke.name} className="w-28 object-contain z-10 scale-125" referrerPolicy="no-referrer"/>
                </div>
                <span className="text-sm font-bold text-on-surface text-center line-clamp-1">{poke.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-on-surface-variant font-medium text-center py-8">사용률 데이터를 가져올 수 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  return (
    <div className="pt-24 min-h-screen bg-background p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="w-full">
          <ChampsUsageRates />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;