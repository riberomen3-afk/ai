import fs from 'fs';

const megasDataStr = fs.readFileSync('src/data/searchData.ts', 'utf8').match(/export const MEGA_DATA: PokemonData\[\] \= (\[[\s\S]*?\]);/)[1];
const regularsDataStr = fs.readFileSync('src/data/searchData.ts', 'utf8').match(/export const REGULAR_DATA: PokemonData\[\] \= (\[[\s\S]*?\]);/)[1];

const megas = eval(megasDataStr);
const regulars = eval(regularsDataStr);

const megaKorNames = megas.map(m => m.ko).join(', ');
const regularKorNames = regulars.map(r => r.ko).join(', ');

let geminiService = fs.readFileSync('src/services/geminiService.ts', 'utf8');

geminiService = geminiService.replace(
   /1\. 메가진화 \(정확히 2마리 포함\)\:.*?\./,
   "1. 메가진화 (정확히 2마리 포함): " + megaKorNames + "."
);

geminiService = geminiService.replace(
   /2\. 일반 포켓몬 \(정확히 4마리 포함\)\:.*?\./,
   "2. 일반 포켓몬 (정확히 4마리 포함): " + regularKorNames + "."
);

fs.writeFileSync('src/services/geminiService.ts', geminiService);
console.log("Updated geminiService.ts");
