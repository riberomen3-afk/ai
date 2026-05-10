export type PokemonType = 
  | 'fire' | 'water' | 'grass' | 'electric' | 'ice' | 'fighting' 
  | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug' | 'rock' 
  | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy' | 'normal';

export interface Pokemon {
  id: string;
  name: string;
  enName?: string;
  types: PokemonType[];
  item?: string;
  enItem?: string;
  ability?: string;
  enAbility?: string;
  nature?: string;
  enNature?: string;
  teraType?: PokemonType;
  evs: {
    hp: number;
    atk: number;
    def: number;
    spa: number;
    spd: number;
    spe: number;
  };
  moves: string[];
  enMoves?: string[];
  imageUrl: string;
}

export interface TeamCore {
  id: string;
  name: string;
  format: string;
  description: string;
  pokemon: Pokemon[];
  winRate?: number;
  synergyLevel?: number;
  synergyDescription?: string;
  ownerId?: string;
  createdAt?: any;
  updatedAt?: any;
  leads?: {
    strategyName: string;
    description: string;
  }[];
  usageNotes?: { pokemonId: string; pokemonName: string; note: string }[];
}
