import React, { useState, useEffect } from 'react';
import { LayoutGrid, List, Plus, MoreVertical, Copy, Trash2, Edit2, Users, Save, X, ExternalLink, Check, Wand2, Zap, BarChart3 } from 'lucide-react';
import { TeamCore, Pokemon } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { TYPE_NAME_KO, getTypeEffectiveness, TYPE_COLORS } from '../constants';
import { PokemonCard } from '../components/PokemonCard';
import { PokemonEditModal } from '../components/PokemonEditModal';
import { TeamWeaknessAnalysis } from '../components/TeamWeaknessAnalysis';

interface PartiesProps {
  teams: TeamCore[];
  onDelete: (id: string) => void;
  onDuplicate: (team: TeamCore) => void;
  onUpdate?: (team: TeamCore) => void;
  onAddMetaTeams?: () => void;
  onNavigate: (tab: string) => void;
}

export const Parties: React.FC<PartiesProps> = ({ teams, onDelete, onDuplicate, onUpdate, onAddMetaTeams, onNavigate }) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [editingNameValue, setEditingNameValue] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);
  const [exportingTeam, setExportingTeam] = useState<TeamCore | null>(null);
  const [viewingTeam, setViewingTeam] = useState<TeamCore | null>(null);
  const [editingPokemon, setEditingPokemon] = useState<Pokemon | null>(null);
  const [deletingTeamId, setDeletingTeamId] = useState<string | null>(null);

  const formatPokemonToShowdown = (p: Pokemon) => {
    const itemStr = p.enItem || p.item;
    let res = `${p.enName || p.name}`;
    if (itemStr && itemStr !== 'None' && itemStr !== '없음') {
      res += ` @ ${itemStr}`;
    }
    res += '\n';
    if (p.enAbility || p.ability) res += `Ability: ${p.enAbility || p.ability}\n`;
    const stats: (keyof Pokemon['evs'])[] = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
    const labels: Record<keyof Pokemon['evs'], string> = { hp: 'HP', atk: 'Atk', def: 'Def', spa: 'SpA', spd: 'SpD', spe: 'Spe' };
    const evLines = stats
      .filter(stat => p.evs && p.evs[stat] > 0)
      .map(stat => `${p.evs[stat]} ${labels[stat]}`)
      .join(' / ');
    
    if (evLines) res += `EVs: ${evLines}\n`;
    if (p.enNature || p.nature) {
      const cleanNature = (p.enNature || p.nature).split('(')[0].trim();
      res += `${cleanNature} Nature\n`;
    }
    const movesList = p.enMoves && p.enMoves.length > 0 ? p.enMoves : p.moves;
    if (movesList) {
      movesList.forEach(m => {
        if (m && m !== '없음') res += `- ${m}\n`;
      });
    }
    return res;
  };

  const getTeamText = (team: TeamCore) => {
    return team.pokemon.map(formatPokemonToShowdown).join('\n\n');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="pt-24 min-h-screen bg-background p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h2 className="text-4xl font-extrabold text-on-surface mb-1 tracking-tight">나의 파티</h2>
            <p className="text-on-surface-variant font-medium">경쟁전 팀과 전략 코어를 관리하세요.</p>
          </div>
          
          <div className="flex gap-4">
            {onAddMetaTeams && (
              <button 
                onClick={onAddMetaTeams}
                className="flex items-center gap-2 bg-secondary hover:bg-secondary-container text-white px-5 py-3 rounded-lg font-bold transition-all shadow-md"
              >
                <Users size={20} />
                샘플 파티 추가
              </button>
            )}
            <div className="flex border border-surface-container-high rounded-lg overflow-hidden bg-white shadow-sm">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-3 transition-colors ${viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
                title="그리드 뷰"
              >
                <LayoutGrid size={20} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-3 transition-colors ${viewMode === 'list' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
                title="리스트 뷰"
              >
                <List size={20} />
              </button>
            </div>
            <button 
              onClick={() => onNavigate('build')}
              className="flex items-center gap-2 bg-primary hover:bg-primary-container text-white px-5 py-3 rounded-lg font-bold transition-all shadow-md"
            >
              <Plus size={20} />
              새로운 파티
            </button>
          </div>
        </div>

        {teams.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white rounded-3xl border border-surface-container-highest p-16 text-center shadow-sm">
            <div className="w-24 h-24 bg-surface-container-low rounded-full flex items-center justify-center text-on-surface-variant mb-6">
              <Users size={40} />
            </div>
            <h3 className="text-2xl font-black text-on-surface mb-3">생성된 파티가 없습니다</h3>
            <p className="text-on-surface-variant mb-8 max-w-md">
              AI 파티 빌더를 사용하여 나만의 강력한 팀을 구성해 보세요. 메타를 분석하고 시너지를 계산해 드립니다.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => onNavigate('build')}
                className="bg-primary text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 hover:scale-105 transition-transform shadow-lg"
              >
                <Plus size={24} />
                파티 생성하기
              </button>
              {onAddMetaTeams && (
                <button 
                  onClick={onAddMetaTeams}
                  className="bg-surface-container-low text-on-surface px-8 py-4 rounded-xl font-bold flex items-center gap-3 hover:scale-105 transition-transform shadow-sm border border-surface-container-high"
                >
                  <Users size={24} />
                  샘플 파티 불러오기
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
            {teams.map((team, idx) => (
              <motion.div 
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setViewingTeam(team)}
                className="bg-white rounded-2xl border border-surface-container-highest p-6 shadow-sm hover:shadow-md transition-all group relative cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 pr-4">
                    {editingNameId === team.id ? (
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (editingNameValue.trim() && onUpdate) {
                            onUpdate({ ...team, name: editingNameValue.trim() });
                          }
                          setEditingNameId(null);
                        }}
                        className="flex items-center gap-2 mb-2"
                      >
                        <input
                          type="text"
                          value={editingNameValue}
                          onChange={(e) => setEditingNameValue(e.target.value)}
                          className="flex-1 bg-surface-container-low border border-surface-container-high rounded px-2 py-1 text-lg font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                          autoFocus
                          onBlur={() => {
                            if (editingNameValue.trim() && onUpdate) {
                              onUpdate({ ...team, name: editingNameValue.trim() });
                            }
                            setEditingNameId(null);
                          }}
                        />
                      </form>
                    ) : (
                      <h3 className="text-xl font-bold text-on-surface mb-1 flex items-center gap-2 group-hover:text-primary transition-colors cursor-pointer group" onClick={(e) => {
                        e.stopPropagation();
                        setEditingNameValue(team.name);
                        setEditingNameId(team.id);
                      }}>
                        {team.name}
                        <Edit2 size={14} className="opacity-0 group-hover:opacity-100 text-on-surface-variant transition-opacity" />
                      </h3>
                    )}
                    <div className="flex flex-wrap gap-2 text-xs font-semibold mt-2">
                      <span className="text-on-surface-variant bg-surface-container-low px-2 py-1 rounded">{team.format}</span>
                      {team.winRate && (
                        <span className="text-green-700 bg-green-100 px-2 py-1 rounded">
                          승률 {team.winRate}%
                        </span>
                      )}
                      {team.synergyLevel !== undefined && (
                        <span className="text-primary bg-primary/10 px-2 py-1 rounded flex items-center gap-1">
                          <Zap size={10} /> 시너지 {team.synergyLevel}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="relative z-20">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === team.id ? null : team.id);
                      }}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-low text-on-surface-variant transition-colors"
                    >
                      <MoreVertical size={20} />
                    </button>
                    
                    <AnimatePresence>
                      {activeMenuId === team.id && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setActiveMenuId(null); }} />
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95, transformOrigin: 'top right' }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute top-10 right-0 w-48 bg-white border border-surface-container-highest rounded-xl shadow-xl z-50 overflow-hidden"
                          >
                            <button 
                              onClick={(e) => { e.stopPropagation(); setExportingTeam(team); setActiveMenuId(null); }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-on-surface hover:bg-surface-container-low transition-colors text-left"
                            >
                              <ExternalLink size={16} /> 텍스트로 내보내기
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); onDuplicate(team); setActiveMenuId(null); }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-on-surface hover:bg-surface-container-low transition-colors text-left"
                            >
                              <Copy size={16} /> 파티 복제하기
                            </button>
                            <div className="h-px bg-surface-container-high w-full"></div>
                            <button 
                              onClick={(e) => { e.stopPropagation(); setDeletingTeamId(team.id); setActiveMenuId(null); }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-error hover:bg-error/10 transition-colors text-left"
                            >
                              <Trash2 size={16} /> 파티 삭제
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container-high mb-4">
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {team.pokemon.map((p, i) => (
                      <div key={i} className="aspect-square bg-white rounded-lg border border-surface-container-highest shadow-sm p-1 flex items-center justify-center relative overflow-hidden group/poke">
                        <img src={p.imageUrl || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`} alt={p.name} className="w-full h-full object-contain filter group-hover/poke:scale-110 transition-transform" referrerPolicy="no-referrer" />
                        {p.item && (
                          <div className="absolute bottom-1 right-1 w-4 h-4 bg-surface rounded-full border border-surface-container-high flex items-center justify-center shadow-sm">
                            <span className="text-[8px] font-black" title={p.item}>🎁</span>
                          </div>
                        )}
                        {p.teraType && (
                          <div className="absolute top-1 left-1 w-4 h-4 flex items-center justify-center rounded-full bg-white/90 shadow-sm border border-surface-container-highest text-[10px] font-bold" title={`테라스탈: ${TYPE_NAME_KO[p.teraType]?.[0] || '?'}`}>
                            {TYPE_NAME_KO[p.teraType]?.[0] || '?'}
                          </div>
                        )}
                      </div>
                    ))}
                    {Array.from({ length: 6 - team.pokemon.length }).map((_, i) => (
                      <div key={`empty-${i}`} className="aspect-square bg-surface-container-low rounded-lg border border-dashed border-surface-container-highest flex items-center justify-center opacity-50">
                        <span className="text-on-surface-variant/30 font-black text-2xl">?</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-on-surface-variant mt-auto">
                  <span className="flex-1 line-clamp-2">{team.description}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {exportingTeam && (
          <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
            >
              <div className="flex justify-between items-center p-6 border-b border-surface-container-high bg-surface">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <ExternalLink size={20} className="text-primary" />
                  Showdown 텍스트 
                </h3>
                <button 
                  onClick={() => setExportingTeam(null)}
                  className="text-on-surface-variant hover:text-on-surface bg-surface-container-low p-2 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1 bg-surface-container-lowest">
                <pre className="bg-gray-900 border text-gray-100 p-4 rounded-xl text-sm font-mono whitespace-pre-wrap leading-relaxed shadow-inner font-bold">
                  {getTeamText(exportingTeam)}
                </pre>
              </div>
              <div className="p-6 border-t border-surface-container-high bg-surface flex justify-end gap-3">
                <button 
                  onClick={() => setExportingTeam(null)}
                  className="px-6 py-2 rounded-lg font-bold text-on-surface hover:bg-surface-container-low transition-colors"
                >
                  닫기
                </button>
                <button 
                  onClick={() => handleCopy(getTeamText(exportingTeam))}
                  className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary-container text-white rounded-lg font-bold transition-colors shadow-md"
                >
                  {isCopied ? <Check size={18} /> : <Copy size={18} />}
                  {isCopied ? '복사됨!' : '클립보드 복사'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {viewingTeam && (
          <div className="fixed inset-0 bg-black/60 z-[110] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setViewingTeam(null)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface-container-lowest rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="flex justify-between items-start p-6 lg:p-8 border-b border-surface-container-highest bg-white sticky top-0 z-10">
                <div>
                  <h2 className="text-3xl font-extrabold text-on-surface mb-1">{viewingTeam.name}</h2>
                  <div className="text-sm text-on-surface-variant font-medium">포맷: {viewingTeam.format}</div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => { setExportingTeam(viewingTeam); setViewingTeam(null); }}
                    className="flex items-center gap-2 bg-surface-container-low hover:bg-surface-container text-on-surface px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                  >
                    <ExternalLink size={16} />
                    텍스트
                  </button>
                  <button 
                    onClick={() => setViewingTeam(null)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-low hover:bg-error/10 hover:text-error text-on-surface-variant transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              
              <div className="p-6 lg:p-8 overflow-y-auto flex-1">
                {viewingTeam.description && (
                  <div className="bg-white p-6 rounded-xl border border-surface-dim mb-8 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-secondary" />
                    <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase mb-3">
                      <Wand2 size={14} />
                      AI 전략 노트
                    </div>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      {viewingTeam.description}
                    </p>
                  </div>
                )}

                {viewingTeam.synergyLevel !== undefined && (
                  <div className="bg-gradient-to-br from-surface to-surface-container-low p-6 rounded-xl border border-primary/20 mb-8 flex flex-col sm:flex-row gap-6 shadow-sm">
                    <div className="flex flex-col items-center justify-center shrink-0">
                      <div className="relative flex items-center justify-center w-24 h-24 rounded-full border-4 border-primary/10 bg-white">
                        <div className="absolute inset-0 rounded-full border-4 border-primary shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.3)]" style={{ clipPath: `polygon(0 0, 100% 0, 100% ${100 - (viewingTeam.synergyLevel || 0)}%, 0 ${100 - (viewingTeam.synergyLevel || 0)}%)`, borderColor: 'transparent', borderBottomColor: 'currentColor', borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: 'transparent', transform: 'rotate(45deg)' }} />
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                          <circle cx="44" cy="44" r="44" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-primary/20 transform translate-x-1 translate-y-1" />
                          <circle cx="44" cy="44" r="44" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray={`${2.76 * (viewingTeam.synergyLevel || 0)} 276`} className="text-primary transform translate-x-1 translate-y-1" strokeLinecap="round" />
                        </svg>
                        <div className="text-center z-10">
                          <span className="block text-2xl font-black text-primary">{viewingTeam.synergyLevel}</span>
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
                        {viewingTeam.synergyDescription || "시너지 정보가 제공되지 않았습니다."}
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {viewingTeam.pokemon.map(p => (
                    <div key={p.id} className="relative group">
                      <PokemonCard pokemon={p} />
                      <button
                        onClick={() => setEditingPokemon(p)}
                        className="absolute top-2 left-2 z-20 w-8 h-8 rounded-full bg-white shadow-sm border border-surface-container flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-surface-container-low transition-all text-on-surface-variant hover:text-primary"
                        title="포켓몬 수정"
                      >
                        <Edit2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Team Weakness Analysis */}
                <TeamWeaknessAnalysis pokemon={viewingTeam.pokemon} />

                {/* Type Effectiveness Table */}
                <div className="bg-white rounded-xl border border-surface-container-high overflow-hidden shadow-sm mb-8">
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
                        {viewingTeam.pokemon.map(p => {
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

                {viewingTeam.leads && viewingTeam.leads.length > 0 && (
                  <div className="bg-white rounded-xl border border-surface-container-high p-6 shadow-sm mb-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />
                      <h4 className="text-sm font-black text-secondary uppercase tracking-[0.2em] px-4 py-1 border-2 border-secondary/20 rounded-full bg-secondary/5 shadow-sm">
                        [선출법 & 운용 전술]
                      </h4>
                      <div className="h-[2px] flex-1 bg-gradient-to-r from-secondary/20 via-transparent to-transparent" />
                    </div>
                    
                    <div className="space-y-4">
                      {viewingTeam.leads.map((strategy, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl border-2 border-surface-container shadow-sm hover:border-secondary/40 transition-all hover:shadow-md">
                          <h5 className="font-black text-on-surface text-base mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-secondary text-white flex items-center justify-center text-xs shadow-inner">
                              {idx + 1}
                            </span>
                            {strategy.strategyName}
                          </h5>
                          <div className="pl-11 pr-4">
                            <p className="text-sm text-on-surface-variant leading-relaxed font-bold border-l-2 border-surface-container pl-4 py-1 italic">
                              {strategy.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {viewingTeam.usageNotes && viewingTeam.usageNotes.length > 0 && (
                  <div className="bg-white rounded-xl border border-surface-container-high p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                       <h4 className="text-xl font-black text-on-surface mb-1 flex items-center gap-2">
                        <Wand2 size={20} className="text-secondary" />
                        상세 포켓몬 가이드
                      </h4>
                      <div className="h-px flex-1 bg-surface-container-high ml-4" />
                    </div>

                    <div className="space-y-16">
                      {viewingTeam.usageNotes.map((note, idx) => {
                        const pokemon = viewingTeam.pokemon.find(p => 
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
                                        <div className="flex justify-between text-xs font-bold">
                                          <span className="opacity-50">도구</span>
                                          <span className="text-primary">{pokemon.item}</span>
                                        </div>
                                        <div className="flex justify-between text-xs font-bold">
                                          <span className="opacity-50">특성</span>
                                          <span>{pokemon.ability}</span>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2 opacity-50">Moveset</div>
                                      <div className="grid grid-cols-2 gap-2">
                                        {pokemon.moves.map((move, i) => (
                                          <div key={i} className="px-3 py-2 bg-white border border-surface-container rounded-xl text-[10px] font-bold text-center shadow-xs">
                                            {move}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="space-y-4">
                                    <div>
                                      <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2 opacity-50">Effort Values</div>
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
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        <AnimatePresence>
          {editingPokemon && viewingTeam && (
            <PokemonEditModal
              pokemon={editingPokemon}
              onClose={() => setEditingPokemon(null)}
              onSave={(updatedPokemon) => {
                const updatedTeam = {
                  ...viewingTeam,
                  pokemon: viewingTeam.pokemon.map(p => p.id === updatedPokemon.id ? updatedPokemon : p)
                };
                setViewingTeam(updatedTeam);
                if (onUpdate) {
                  onUpdate(updatedTeam);
                }
                setEditingPokemon(null);
              }}
            />
          )}

          {deletingTeamId && (
            <div className="fixed inset-0 bg-black/60 z-[120] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setDeletingTeamId(null)}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col"
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold text-on-surface mb-2">파티 삭제</h3>
                  <p className="text-sm text-on-surface-variant font-medium">
                    정말로 이 파티를 삭제하시겠습니까? 삭제된 파티는 복구할 수 없습니다.
                  </p>
                </div>
                <div className="px-6 pb-6 flex gap-3">
                  <button 
                    onClick={() => setDeletingTeamId(null)}
                    className="flex-1 py-3 text-sm font-bold rounded-xl bg-surface-container-low text-on-surface hover:bg-surface-container transition-colors"
                  >
                    취소
                  </button>
                  <button 
                    onClick={() => {
                      onDelete(deletingTeamId);
                      setDeletingTeamId(null);
                    }}
                    className="flex-1 py-3 text-sm font-bold rounded-xl bg-error text-white hover:bg-error/90 transition-colors"
                  >
                    삭제
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Parties;
