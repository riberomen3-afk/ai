import React from 'react';
import { Pokemon } from '../types';
import { Badge } from './Badge';
import { Shield, Zap, Sword, Heart, Activity } from 'lucide-react';
import { TYPE_NAME_KO } from '../constants';

interface PokemonCardProps {
  pokemon: Pokemon;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  return (
    <div className="bg-white rounded-lg border border-surface-container-high shadow-sm overflow-hidden hover:shadow-md transition-shadow relative">
      <div className="absolute top-2 right-2 flex gap-1 z-10">
        {pokemon.types.map(t => {
          const typeKo = TYPE_NAME_KO[t.toLowerCase()] || t;
          return (
            <div key={t} className={`px-2 py-0.5 rounded text-[9px] font-black uppercase text-white shadow-sm pokemon-type-badge pokemon-type-${t.toLowerCase()}`}>
              {typeKo}
            </div>
          );
        })}
      </div>
      
      <div className="p-4 flex gap-4">
        <div className="relative">
          <div className="w-24 h-24 bg-surface-container-low rounded-lg flex items-center justify-center p-2">
            <img 
              src={pokemon.imageUrl} 
              alt={pokemon.name} 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="mb-2">
            <h3 className="text-xl font-black text-on-surface leading-none mb-1">{pokemon.name}</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-1 text-[11px] text-on-surface-variant font-medium">
            <div><span className="font-black opacity-40 uppercase tracking-tighter mr-1 text-[9px]">도구</span> {pokemon.item}</div>
            <div><span className="font-black opacity-40 uppercase tracking-tighter mr-1 text-[9px]">특성</span> {pokemon.ability}</div>
            <div><span className="font-black opacity-40 uppercase tracking-tighter mr-1 text-[9px]">성격</span> {pokemon.nature}</div>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="mb-4">
          <div className="text-[10px] font-bold text-on-surface-variant uppercase mb-2">노력치 분배</div>
          <div className="grid grid-cols-6 gap-1">
            {(['hp', 'atk', 'def', 'spa', 'spd', 'spe'] as const).map((stat) => {
              const val = pokemon.evs[stat] || 0;
              const statLabels: Record<string, string> = { hp: '체력(HP)', atk: '공격(Atk)', def: '방어(Def)', spa: '특공(SpA)', spd: '특방(SpD)', spe: '스피드(Spe)' };
              return (
                <div key={stat} className="bg-surface-container-low p-1 rounded text-center">
                  <div className="text-[7.5px] font-bold opacity-50 whitespace-nowrap">{statLabels[stat]}</div>
                  <div className={`text-[10px] font-bold ${val > 0 ? 'text-primary' : 'text-on-surface'}`}>{val}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div className="text-[10px] font-bold text-on-surface-variant uppercase mb-2">기술 배치</div>
          <div className="grid grid-cols-2 gap-2">
            {pokemon.moves.map(move => (
              <div key={move} className="flex items-center gap-2 bg-surface-container-low rounded px-2 py-1.5 border border-transparent hover:border-surface-dim transition-colors group">
                <div className="w-1.5 h-1.5 rounded-full bg-on-surface-variant group-hover:bg-primary" />
                <span className="text-xs font-semibold">{move}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
