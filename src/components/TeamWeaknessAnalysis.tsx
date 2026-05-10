import React, { useMemo } from 'react';
import { ShieldAlert, AlertTriangle } from 'lucide-react';
import { Pokemon } from '../types';
import { TYPE_NAME_KO, getTypeEffectiveness, TYPE_COLORS } from '../constants';

interface TeamWeaknessAnalysisProps {
  pokemon: Pokemon[];
}

export const TeamWeaknessAnalysis: React.FC<TeamWeaknessAnalysisProps> = ({ pokemon }) => {
  const vulnerabilities = useMemo(() => {
    const ALL_TYPES = Object.keys(TYPE_NAME_KO);
    const vulns: { type: string; level: 'critical' | 'warning'; weakCount: number; resistCount: number; immuneCount: number }[] = [];

    for (const attackingType of ALL_TYPES) {
      let weakCount = 0;
      let resistCount = 0;
      let immuneCount = 0;

      pokemon.forEach(p => {
        const eff = getTypeEffectiveness(p.types);
        const isWeak = eff.weaknesses.some(w => w.type.toLowerCase() === attackingType);
        const isResist = eff.resistances.some(r => r.type.toLowerCase() === attackingType);
        const isImmune = eff.immunities.some(i => i.type.toLowerCase() === attackingType);

        if (isWeak) weakCount++;
        if (isResist) resistCount++;
        if (isImmune) immuneCount++;
      });

      if (weakCount >= 3 && resistCount + immuneCount <= 1) {
        vulns.push({ type: attackingType, level: 'critical', weakCount, resistCount, immuneCount });
      } else if (weakCount >= 2 && resistCount + immuneCount === 0) {
        vulns.push({ type: attackingType, level: 'warning', weakCount, resistCount, immuneCount });
      }
    }

    return vulns.sort((a, b) => {
      if (a.level === 'critical' && b.level !== 'critical') return -1;
      if (a.level !== 'critical' && b.level === 'critical') return 1;
      return b.weakCount - a.weakCount;
    });
  }, [pokemon]);

  if (vulnerabilities.length === 0) {
    return (
      <div className="bg-surface-container-lowest border border-surface-container-high rounded-xl p-6 mb-8 flex items-center gap-4 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
          <ShieldAlert size={24} />
        </div>
        <div>
          <h4 className="font-bold text-on-surface text-lg">치명적인 타입 일관성이 없습니다</h4>
          <p className="text-sm text-on-surface-variant">이 파티는 방어 상성 단점이 잘 보완되어 있습니다. 특정 타입에 의해 쉽게 스윕당할 위험이 적습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 bg-white rounded-xl border border-surface-container-high overflow-hidden shadow-sm">
      <div className="bg-error/10 px-6 py-4 border-b border-error/20 flex items-center gap-2 font-black text-error">
        <AlertTriangle size={18} />
        파티 약점 분석 (일관성 경고)
      </div>
      <div className="p-6">
        <p className="text-sm text-on-surface-variant mb-6">
          파티 전체적으로 약점이 겹치고, 이를 반감으로 받아낼 포켓몬이 부족한 타입입니다. 상대가 이 타입의 공격기를 주력으로 사용하는 스위퍼를 내보낼 경우 파티가 붕괴될 위험이 큽니다.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vulnerabilities.map((v, i) => (
            <div key={i} className={`p-4 rounded-xl border ${v.level === 'critical' ? 'bg-error/5 border-error/30' : 'bg-surface-container-lowest border-surface-container-high'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-lg text-xs font-black uppercase shadow-sm ${TYPE_COLORS[v.type.toLowerCase()] || 'bg-gray-400 text-gray-900'}`}>
                    {TYPE_NAME_KO[v.type.toLowerCase()]}
                  </span>
                  <span className={`text-xs font-bold ${v.level === 'critical' ? 'text-error' : 'text-orange-600'}`}>
                    {v.level === 'critical' ? '치명적 단점' : '주의 요망'}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-4 text-xs">
                <div className="flex-1">
                  <div className="text-on-surface-variant mb-1 font-bold">약점 찔림</div>
                  <div className="font-black text-error text-lg">{v.weakCount}마리</div>
                </div>
                <div className="flex-1">
                  <div className="text-on-surface-variant mb-1 font-bold">크로스 카운터 (반감/무효)</div>
                  <div className={`font-black text-lg ${v.resistCount + v.immuneCount === 0 ? 'text-error' : 'text-green-600'}`}>
                    {v.resistCount + v.immuneCount}마리
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
