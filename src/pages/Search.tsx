import React, { useState, useMemo } from 'react';
import { Search as SearchIcon, Package, Sparkles, Sword, Table } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MEGA_DATA, REGULAR_DATA, ITEM_CATEGORIES_DATA, PokemonData, ItemData } from '../data/searchData';
import { TypeChart } from '../components/TypeChart';

export const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'mega' | 'regular' | 'items' | 'type_chart'>('mega');

  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase();
    
    if (activeCategory === 'type_chart') {
      return { type: 'type_chart', list: [] };
    }
    
    if (activeCategory === 'mega') {
      return { 
        type: 'pokemon', 
        list: MEGA_DATA.filter(p => p.ko.includes(query) || p.en.toLowerCase().includes(query)) 
      };
    }
    if (activeCategory === 'regular') {
      return { 
        type: 'pokemon', 
        list: REGULAR_DATA.filter(p => p.ko.includes(query) || p.en.toLowerCase().includes(query)) 
      };
    }
    
    const filteredItems = ITEM_CATEGORIES_DATA.map(cat => ({
      ...cat,
      items: cat.items.filter(i => i.ko.includes(query) || i.en.toLowerCase().includes(query))
    })).filter(cat => cat.items.length > 0);
    
    return { type: 'items', list: filteredItems };
  }, [searchQuery, activeCategory]);

  const getPokemonImage = (id: number) => {
    if (activeCategory === 'mega' && id < 10000) {
      let formId = '01';
      if (id === 658) formId = '02'; // Greninja
      if (id === 670) formId = '06'; // Floette Eternal?
      if (id === 678) formId = '02'; // Meowstic F?
      return `https://s3-ap-northeast-1.amazonaws.com/pokedb.tokyo/champs/assets/pokemon/icons_512/pokemon-${id.toString().padStart(4, '0')}-${formId}.webp`;
    }
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  };
  const getItemImage = (slug: string) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${slug}.png`;

  return (
    <div className="pt-24 min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto text-on-surface">
        <div className="mb-10">
          <h2 className="text-4xl font-extrabold mb-2 tracking-tight">규정 탐색기</h2>
          <p className="text-on-surface-variant font-medium text-lg">2026 Pokémon Champions 공식 허용 로스터</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-8 items-center justify-between">
          <div className="relative w-full max-w-md">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-50" size={18} />
            <input 
              type="text" 
              placeholder="포켓몬 또는 도구 검색..." 
              className="w-full bg-white border border-surface-container-high rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary shadow-sm transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex bg-white p-1 rounded-xl border border-surface-container-high shadow-sm overflow-x-auto hide-scrollbar">
            {[
              { id: 'mega', label: '메가진화', icon: Sparkles },
              { id: 'regular', label: '일반 포켓몬', icon: Sword },
              { id: 'items', label: '도구', icon: Package },
              { id: 'type_chart', label: '상성표', icon: Table }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`flex shrink-0 items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeCategory === tab.id 
                    ? 'bg-primary text-white shadow-md' 
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-surface-container-high p-8 shadow-sm min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory + searchQuery}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeCategory === 'type_chart' ? (
                <TypeChart />
              ) : filteredData.type === 'pokemon' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                   {(filteredData.list as PokemonData[]).map((p) => (
                     <div key={p.id} className="flex flex-col items-center p-4 bg-white rounded-2xl border border-surface-container hover:border-primary/40 hover:shadow-lg transition-all group cursor-pointer shadow-sm overflow-hidden relative">
                        <div className="w-full aspect-square relative mb-3 group-hover:scale-110 transition-transform duration-300">
                          <img 
                            src={getPokemonImage(p.id)} 
                            alt={p.ko} 
                            loading="lazy"
                            className="w-full h-full object-contain"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-extrabold text-on-surface line-clamp-1">{p.ko}</div>
                          <div className="text-[10px] text-on-surface-variant font-bold mt-1 opacity-60 uppercase">
                             {p.en}
                          </div>
                        </div>
                        {activeCategory === 'mega' && (
                          <div className="absolute top-2 right-2 text-yellow-500">
                            <Sparkles size={12} fill="currentColor" />
                          </div>
                        )}
                     </div>
                   ))}
                   {(filteredData.list as PokemonData[]).length === 0 && (
                     <div className="col-span-full py-20 text-center text-surface-dim">
                        <SearchIcon size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="font-bold">검색 결과가 없습니다.</p>
                     </div>
                   )}
                </div>
              ) : (
                <div className="space-y-12">
                  {(filteredData.list as any[]).map((category) => (
                    <div key={category.name}>
                      <div className="flex items-center gap-2 mb-6 border-b border-surface-container pb-2">
                        <Package size={18} className="text-secondary" />
                        <h3 className="text-xl font-extrabold text-on-surface">{category.name}</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {category.items.map((item: ItemData) => (
                          <div key={item.en} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-surface-container hover:border-secondary transition-all shadow-sm group">
                            <div className="w-12 h-12 rounded-lg bg-surface-container-low flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
                              <img 
                                src={getItemImage(item.slug)} 
                                alt={item.ko} 
                                className="w-full h-full object-contain"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
                                }}
                              />
                            </div>
                            <div>
                              <div className="text-sm font-extrabold text-on-surface">{item.ko}</div>
                              <div className="text-[10px] text-on-surface-variant font-medium">{item.en}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
