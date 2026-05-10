import React from 'react';
import { TYPE_NAME_KO, DEFENDING_TYPE_CHART, TYPE_COLORS } from '../constants';

export const TypeChart: React.FC = () => {
  const ALL_TYPES = Object.keys(TYPE_NAME_KO);

  const getEffectiveness = (defender: string, attacker: string) => {
    if (DEFENDING_TYPE_CHART[defender] && DEFENDING_TYPE_CHART[defender][attacker] !== undefined) {
      return DEFENDING_TYPE_CHART[defender][attacker];
    }
    return 1;
  };

  const getMultiplierStyle = (multiplier: number) => {
    switch (multiplier) {
      case 0: return 'bg-zinc-800 text-white font-bold text-xs ring-inset ring-1 ring-white/20 shadow-sm';
      case 0.5: return 'bg-red-100 text-red-700 font-bold text-xs shadow-sm';
      case 2: return 'bg-green-100 text-green-700 font-bold text-xs shadow-sm';
      default: return 'text-surface-dim opacity-10 font-bold';
    }
  };

  const getMultiplierText = (multiplier: number) => {
    switch (multiplier) {
      case 0: return '0×';
      case 0.5: return '½×';
      case 2: return '2×';
      default: return ''; // '1×'
    }
  };

  return (
    <div className="w-full overflow-x-auto rounded-3xl border border-surface-container bg-white shadow-sm p-2 sm:p-6">
      <div className="min-w-max">
        <div className="mb-6 flex flex-wrap items-center gap-6 text-sm px-4">
          <div className="flex items-center gap-2"><span className="w-8 h-8 rounded-lg shrink-0 bg-green-100 text-green-700 font-bold text-xs flex items-center justify-center shadow-sm">2×</span> <span className="font-medium text-on-surface">효과가 굉장했다 (Weakness)</span></div>
          <div className="flex items-center gap-2"><span className="w-8 h-8 rounded-lg shrink-0 bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center shadow-sm">½×</span> <span className="font-medium text-on-surface">효과가 별로인듯하다 (Resistance)</span></div>
          <div className="flex items-center gap-2"><span className="w-8 h-8 rounded-lg shrink-0 bg-zinc-800 text-white font-bold text-xs flex items-center justify-center shadow-sm">0×</span> <span className="font-medium text-on-surface">효과가 없다 (Immunity)</span></div>
        </div>
        
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 border-b border-r border-surface-container bg-surface-container-low text-[10px] whitespace-nowrap sticky left-0 z-20 font-black text-on-surface-variant flex items-center justify-center min-w-[80px] h-[58px] uppercase tracking-widest shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                <div className="flex flex-col items-center">
                  <span>방어 ↘</span>
                  <span>공격 ↗</span>
                </div>
              </th>
              {ALL_TYPES.map(type => (
                <th key={`head-${type}`} className="p-2 border-b border-surface-container bg-white text-center min-w-[44px] z-10 sticky top-0">
                  <div className={`px-1 py-2 rounded-lg text-[11px] font-black mx-auto w-10 flex text-center justify-center flex-col items-center shadow-sm ${TYPE_COLORS[type]}`}>
                    {TYPE_NAME_KO[type].split('').map((char, i) => <span key={i}>{char}</span>)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ALL_TYPES.map(attacker => (
              <tr key={`row-${attacker}`} className="hover:bg-surface-container-lowest transition-colors group">
                <th className="p-2 border-b border-r border-surface-container bg-white sticky left-0 z-10 text-center shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] group-hover:bg-surface-container-lowest transition-colors">
                  <div className={`px-2 py-1.5 rounded-lg text-[11px] font-black whitespace-nowrap mx-auto w-full max-w-[64px] shadow-sm ${TYPE_COLORS[attacker]}`}>
                    {TYPE_NAME_KO[attacker]}
                  </div>
                </th>
                {ALL_TYPES.map(defender => {
                  const multiplier = getEffectiveness(defender, attacker);
                  return (
                    <td key={`cell-${attacker}-${defender}`} className="p-1 border-b border-surface-container text-center align-middle relative group/cell">
                      <div className="absolute inset-0 bg-surface-container opacity-0 group-hover/cell:opacity-10 transition-opacity rounded-xl z-0" />
                      <div className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center transition-all duration-300 relative z-10 
                        ${multiplier !== 1 ? 'group-hover/cell:scale-110 shadow-[0_2px_10px_rgba(0,0,0,0.05)]' : ''} 
                        ${getMultiplierStyle(multiplier)}`}
                      >
                        {getMultiplierText(multiplier)}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-8 px-4 text-xs font-medium text-on-surface-variant flex items-start gap-2 bg-surface-container-lowest p-4 rounded-2xl border border-surface-container">
          <span className="text-secondary font-black">💡 TIP</span>
          <div>표의 <strong>행(가로줄)</strong>은 <strong>공격하는 타입</strong>, <strong>열(세로줄)</strong>은 <strong>방어하는 타입</strong>을 나타냅니다. 예를 들어 물 타입 공격으로 불꽃 타입을 때리면 2배(2×) 데미지가 들어갑니다.</div>
        </div>
      </div>
    </div>
  );
};
