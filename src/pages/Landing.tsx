import React from 'react';
import { Wand2, Zap, BarChart3, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface LandingProps {
  onStart: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="pt-16 min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-inverse-surface">
          <img 
            src="https://images.unsplash.com/photo-1613771404721-1f92d799e49f?q=80&w=2069&auto=format&fit=crop" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-inverse-surface/90" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 h-full flex flex-col items-center justify-center text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-none"
          >
            AI와 함께 <span className="text-primary">메타</span>를 지배하세요
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-surface-dim max-w-2xl mb-12 font-medium"
          >
            즉석에서 완벽하게 시너지가 맞춰진 토너먼트용 팀을 생성하세요. 고도의 알고리즘이 수천 가지 배틀 조합을 분석하여 당신이 승리에만 집중할 수 있도록 돕습니다.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            onClick={onStart}
            className="flex items-center gap-3 bg-primary hover:bg-primary-container text-white px-8 py-4 rounded-full text-lg font-bold transition-all shadow-lg hover:shadow-primary/20"
          >
            <Wand2 size={24} />
            나의 파티 생성하기
          </motion.button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-on-surface mb-4">과학으로 최적화된 설계</h2>
          <p className="text-on-surface-variant max-w-xl mx-auto">우리는 단순한 추측을 하지 않습니다. 타입 상성, 종족값 총합, 기술 견제폭을 정밀하게 계산하여 팀의 약점을 완벽히 보완합니다.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              title: "노력치/개체값 최적화", 
              desc: "특정 메타의 위협에서 살아남거나 주요 상대를 추월할 수 있도록 스탯을 완벽하게 조정합니다.",
              icon: BarChart3,
              color: "text-primary"
            },
            { 
              title: "타입 상성 분석", 
              desc: "경기장에 발을 들이기 전에 치명적인 타입 약점을 파악하고 즉시 대응책을 마련합니다.",
              icon: ShieldCheck,
              color: "text-secondary"
            },
            { 
              title: "기술 시너지", 
              desc: "상호 보완적인 공격과 변화기를 조합하여 필드 장악력을 극대화합니다.",
              icon: Zap,
              color: "text-tertiary"
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-2xl border border-surface-container shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className={`w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${feature.color}`}>
                <feature.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-3">{feature.title}</h3>
              <p className="text-on-surface-variant leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="py-12 border-t border-surface-container bg-surface-container-lowest mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-on-surface-variant font-medium">
          <p className="mb-4">
            본 웹사이트는 비공식 팬 프로젝트이며, 닌텐도, 게임프리크, 크리쳐스 주식회사와 어떠한 연관도 없습니다.<br/>
            Pokémon 및 모든 관련 이름과 이미지는 Nintendo, Game Freak, Creatures Inc.의 상표 및 저작물입니다.
          </p>
          <p className="text-xs opacity-75">
            데이터 및 이미지 출처: <a href="https://pokemonshowdown.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors underline">Pokémon Showdown</a>, <a href="https://champs.pokedb.tokyo/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors underline">champs.pokedb.tokyo</a>
          </p>
        </div>
      </footer>
    </div>
  );
};
