import React from 'react';
import { PokemonType } from '../types';

interface BadgeProps {
  type?: PokemonType;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ type, children, className = '' }) => {
  const typeClass = type ? `pokemon-type-${type}` : 'bg-surface-container-highest text-on-surface';
  
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${typeClass} ${className}`}>
      {children}
    </span>
  );
};
