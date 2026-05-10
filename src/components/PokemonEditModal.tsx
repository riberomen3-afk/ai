import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Save, AlertCircle } from 'lucide-react';
import { Pokemon } from '../types';

interface PokemonEditModalProps {
  pokemon: Pokemon;
  onSave: (updatedPokemon: Pokemon) => void;
  onClose: () => void;
}

export const PokemonEditModal: React.FC<PokemonEditModalProps> = ({ pokemon, onSave, onClose }) => {
  const [edited, setEdited] = useState<Pokemon>(JSON.parse(JSON.stringify(pokemon)));
  const [error, setError] = useState<string | null>(null);

  const evTotal = Object.values(edited.evs).reduce((sum, val) => sum + (val || 0), 0);

  const handleEvChange = (stat: keyof Pokemon['evs'], value: string) => {
    let num = parseInt(value) || 0;
    if (num < 0) num = 0;
    if (num > 32) num = 32;

    const newEvs = { ...edited.evs, [stat]: num };
    const newTotal = Object.values(newEvs).reduce((sum, val) => sum + val, 0);

    if (newTotal > 66) {
      setError('노력치 총합은 66을 초과할 수 없습니다.');
    } else {
      setError(null);
    }

    setEdited((prev) => ({ ...prev, evs: newEvs }));
  };

  const handleMoveChange = (index: number, value: string) => {
    const newMoves = [...edited.moves];
    newMoves[index] = value;
    setEdited((prev) => ({ ...prev, moves: newMoves }));
  };

  const handleSave = () => {
    if (evTotal > 66) {
      setError('노력치 총합은 66을 초과할 수 없습니다.');
      return;
    }
    
    const finalEdited = {
      ...edited,
      moves: edited.moves.filter(m => m.trim().length > 0)
    };

    onSave(finalEdited);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[120] flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="flex justify-between items-center p-6 border-b border-surface-container-highest bg-surface sticky top-0 z-10">
          <h3 className="text-xl font-bold flex items-center gap-2">
            {pokemon.name} 수정
          </h3>
          <button onClick={onClose} className="p-2 bg-surface-container-low hover:bg-surface-container rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {error && (
            <div className="p-3 bg-error/10 text-error rounded-xl font-bold text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* EVs */}
          <div>
            <div className="flex justify-between items-end mb-3">
              <h4 className="font-bold text-on-surface">노력치 (EVs)</h4>
              <span className={`text-xs font-black px-2 py-1 rounded ${evTotal > 66 ? 'bg-error text-white' : 'bg-surface-container text-on-surface-variant'}`}>
                {evTotal} / 66
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(['hp', 'atk', 'def', 'spa', 'spd', 'spe'] as const).map((stat) => {
                const labels: Record<string, string> = { hp: 'HP', atk: '공격', def: '방어', spa: '특공', spd: '특방', spe: '스피드' };
                return (
                  <div key={stat} className="flex items-center gap-2 bg-surface-container-lowest p-2 border border-surface-container rounded-xl">
                    <span className="text-xs font-bold w-12 text-on-surface-variant">{labels[stat]}</span>
                    <input
                      type="number"
                      min="0"
                      max="32"
                      step="2"
                      value={edited.evs[stat] || 0}
                      onChange={(e) => handleEvChange(stat, e.target.value)}
                      className="w-full bg-surface-container-low px-2 py-1 rounded border border-transparent focus:border-primary focus:outline-none text-sm font-bold text-center"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stats Info (Nature, Item, Ability) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1">성격 (Nature)</label>
                <input
                  type="text"
                  value={edited.nature}
                  onChange={(e) => setEdited({ ...edited, nature: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-surface-container px-3 py-2 rounded-xl text-sm focus:border-primary focus:outline-none"
                />
            </div>
            <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1">도구 (Item)</label>
                <input
                  type="text"
                  value={edited.item}
                  onChange={(e) => setEdited({ ...edited, item: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-surface-container px-3 py-2 rounded-xl text-sm focus:border-primary focus:outline-none"
                />
            </div>
            <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-on-surface-variant mb-1">특성 (Ability)</label>
                <input
                  type="text"
                  value={edited.ability}
                  onChange={(e) => setEdited({ ...edited, ability: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-surface-container px-3 py-2 rounded-xl text-sm focus:border-primary focus:outline-none"
                />
            </div>
          </div>

          {/* Moves */}
          <div>
            <h4 className="font-bold text-on-surface mb-3">기술 배치 (Moves)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[0, 1, 2, 3].map((idx) => (
                <div key={idx}>
                  <input
                    type="text"
                    value={edited.moves[idx] || ''}
                    onChange={(e) => handleMoveChange(idx, e.target.value)}
                    placeholder={`기술 ${idx + 1}`}
                    className="w-full bg-surface-container-lowest border border-surface-container px-3 py-2 rounded-xl text-sm focus:border-primary focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="p-6 border-t border-surface-container-high bg-surface flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl font-bold text-on-surface hover:bg-surface-container-low transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={evTotal > 66}
            className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-colors shadow-md"
          >
            <Save size={18} />
            저장
          </button>
        </div>
      </motion.div>
    </div>
  );
};
