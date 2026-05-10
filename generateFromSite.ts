import fs from 'fs';

async function updatePokemonData() {
  const supabaseText = fs.readFileSync('supabase_response.json', 'utf8');
  const supabaseData = JSON.parse(supabaseText);
  // Create a map of accepted bases and forms
  const acceptedBaseIds = new Set();
  const acceptedForms = new Set(); // store region_form 

  for(const item of supabaseData) {
     if(!item.region_form) {
         acceptedBaseIds.add(item.pokemon_id);
     } else {
         acceptedForms.add(item.region_form);
         // Ogerpon etc might have weird forms, let's just add both
         acceptedForms.add(item.region_form.replace('-breed', ''));
     }
  }

  // Which megas are allowed?
  // Our custom megas are tied to baseId. If base is allowed, mega is allowed.
  // Standard megas from PokeAPI: if base is allowed, mega is allowed.

  console.log("Fetching all data from PokeAPI including forms...");
  
  let query = `
    query {
      v2_species: pokemon_v2_pokemonspecies(order_by: {id: asc}, limit: 1200) {
        id
        en: pokemon_v2_pokemonspeciesnames(where: {language_id: {_eq: 9}}) { name }
        ko: pokemon_v2_pokemonspeciesnames(where: {language_id: {_eq: 3}}) { name }
      }
    }
  `;
  
  let response = await fetch("https://beta.pokeapi.co/graphql/v1beta", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({query})
  });
  
  let data = await response.json();
  const speciesList = data.data.v2_species;

  const formQuery = `
    query {
      v2_forms: pokemon_v2_pokemon(where: {id: {_gt: 10000}}, order_by: {id: asc}) {
        id
        name
        pokemon_species_id
        pokemon_v2_pokemonforms {
          pokemon_v2_pokemonformnames(where: {language_id: {_in: [9, 3]}}) {
            language_id
            name
          }
        }
      }
    }
  `;
  
  let formResponse = await fetch("https://beta.pokeapi.co/graphql/v1beta", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({query: formQuery})
  });
  
  let formData = await formResponse.json();
  const formsList = formData.data.v2_forms;

  const koNames = {};
  const regularData = [];
  const megaData = [];

  for (const s of speciesList) {
    if (!acceptedBaseIds.has(s.id)) continue;

    let koName = s.ko.length > 0 ? s.ko[0].name : null;
    let enName = s.en.length > 0 ? s.en[0].name : null;
    
    if (koName) {
      koNames[s.id] = koName;
    }
    if (enName && koName) {
      regularData.push({
        en: enName.charAt(0).toUpperCase() + enName.slice(1),
        ko: koName,
        id: s.id
      });
    }
  }

  function getPrefixName(enName, baseEn, baseKo) {
    let prefixEn = "";
    let prefixKo = "";
    if (enName.includes("-alola")) { prefixEn = "Alolan"; prefixKo = "알로라"; }
    else if (enName.includes("-galar")) { prefixEn = "Galarian"; prefixKo = "가라르"; }
    else if (enName.includes("-hisui")) { prefixEn = "Hisuian"; prefixKo = "히스이"; }
    else if (enName.includes("-paldea")) { prefixEn = "Paldean"; prefixKo = "팔데아"; }
    
    if (prefixEn && prefixKo) {
        return { en: `${prefixEn} ${baseEn}`, ko: `${prefixKo} ${baseKo}` };
    }
    return null;
  }

  for (const f of formsList) {
    const isMega = f.name.includes("-mega");
    if (!isMega) {
       // Filter forms
       // In Supabase, the region_form maps exactly to PokeAPI name except for tauros which omits -breed in PokeAPI sometimes or adds it.
       // E.g. 'tauros-paldea-combat-breed' in supabase. PokeAPI has 'tauros-paldea-combat-breed'.
       if (!acceptedForms.has(f.name) && !acceptedForms.has(f.name + '-breed')) {
          continue;
       }
    } else {
       // It is a mega. Is its base allowed?
       if (!acceptedBaseIds.has(f.pokemon_species_id)) {
          // If the base isn't in acceptedBaseIds, skip. 
          // Wait, is there any mega whose base is NOT allowed? Probably. Let's just exclude them.
          continue;
       }
    }

    const baseSpecies = speciesList.find(s => s.id === f.pokemon_species_id);
    if (!baseSpecies) continue;
    
    let baseEn = baseSpecies.en.length > 0 ? baseSpecies.en[0].name : "";
    let baseKo = koNames[f.pokemon_species_id] || (baseSpecies.ko.length > 0 ? baseSpecies.ko[0].name : "");
    
    if (!baseEn || !baseKo) continue;
    baseEn = baseEn.charAt(0).toUpperCase() + baseEn.slice(1);
    
    let formKo = "";
    let formEn = "";
    
    if (f.pokemon_v2_pokemonforms.length > 0) {
      const names = f.pokemon_v2_pokemonforms[0].pokemon_v2_pokemonformnames;
      const koObj = names.find(n => n.language_id === 3);
      const enObj = names.find(n => n.language_id === 9);
      if (koObj) formKo = koObj.name;
      if (enObj) formEn = enObj.name;
    }

    let finalKo = "";
    let finalEn = "";
    
    if (formKo && formEn) {
       if (formKo.includes(baseKo) || baseKo.includes(formKo)) {
           finalKo = formKo;
       } else if (f.name.includes("-alola") || f.name.includes("-galar") || f.name.includes("-hisui") || f.name.includes("-paldea")) {
           const mapped = getPrefixName(f.name, baseEn, baseKo);
           if (mapped) {
               finalEn = mapped.en;
               finalKo = mapped.ko;
           }
       } else {
           finalKo = `${baseKo} ${formKo}`;
       }
       
       if (!finalEn) {
         if (formEn.includes(baseEn) || baseEn.includes(formEn)) {
             finalEn = formEn;
         } else {
             finalEn = `${baseEn} ${formEn}`;
         }
       }
    } else {
       const mapped = getPrefixName(f.name, baseEn, baseKo);
       if (mapped) {
           finalEn = mapped.en; finalKo = mapped.ko;
       } else if (f.name.includes("-mega-y")) {
           finalEn = "Mega " + baseEn + " Y"; finalKo = "메가" + baseKo + "Y";
       } else if (f.name.includes("-mega-x")) {
           finalEn = "Mega " + baseEn + " X"; finalKo = "메가" + baseKo + "X";
       } else if (f.name.includes("-mega")) {
           finalEn = "Mega " + baseEn; finalKo = "메가" + baseKo;
       } else {
           continue;
       }
    }
    
    if (finalKo && finalEn) {
       koNames[f.id] = finalKo;
       if (isMega) {
           megaData.push({ en: finalEn, ko: finalKo, id: f.id });
       } else {
           regularData.push({ en: finalEn, ko: finalKo, id: f.id });
       }
    }
  }

  // Custom megas
  const customMegas = [
    { en: "Mega Meganium", ko: "메가메가니움", baseId: 154 },
    { en: "Mega Feraligatr", ko: "메가장크로다일", baseId: 160 },
    { en: "Mega Typhlosion", ko: "메가블레이범", baseId: 157 },
    { en: "Mega Delphox", ko: "메가마폭시", baseId: 655 },
    { en: "Mega Greninja", ko: "메가개굴닌자", baseId: 658 },
    { en: "Mega Chesnaught", ko: "메가브리가론", baseId: 652 },
    { en: "Mega Emboar", ko: "메가염무왕", baseId: 500 },
    { en: "Mega Skarmory", ko: "메가무장조", baseId: 227 },
    { en: "Mega Chimecho", ko: "메가치렁", baseId: 358 },
    { en: "Mega Froslass", ko: "메가눈여아", baseId: 478 },
    { en: "Mega Excadrill", ko: "메가몰드류", baseId: 530 },
    { en: "Mega Chandelure", ko: "메가샹델라", baseId: 609 },
    { en: "Mega Golurk", ko: "메가골루그", baseId: 623 },
    { en: "Mega Eternal Flower Floette", ko: "메가영원의꽃플라엣테", baseId: 670 },
    { en: "Mega Meowstic", ko: "메가냐오닉스", baseId: 678 },
    { en: "Mega Hawlucha", ko: "메가루차불", baseId: 701 },
    { en: "Mega Crabominable", ko: "메가모단단게", baseId: 740 },
    { en: "Mega Drampa", ko: "메가할비롱", baseId: 780 },
    { en: "Mega Scovillain", ko: "메가스코빌런", baseId: 952 },
    { en: "Mega Glimmora", ko: "메가킬라플로르", baseId: 970 },
    { en: "Mega Dragonite", ko: "메가망나뇽", baseId: 149 },
    { en: "Mega Starmie", ko: "메가아쿠스타", baseId: 121 }
  ];

  for(const cm of customMegas) {
      if (acceptedBaseIds.has(cm.baseId)) {
          megaData.push({ en: cm.en, ko: cm.ko, id: cm.baseId });
      }
  }

  // Update src/pokemonNames.ts and src/data/searchData.ts
  const searchDataContent = fs.readFileSync('src/data/searchData.ts', 'utf-8');

  let newSearchDataContent = searchDataContent.replace(
      /export const MEGA_DATA: PokemonData\[\] \= \[[\s\S]*?\];/, 
      "export const MEGA_DATA: PokemonData[] = " + JSON.stringify(megaData, null, 2) + ";"
  );

  newSearchDataContent = newSearchDataContent.replace(
      /export const REGULAR_DATA: PokemonData\[\] \= \[[\s\S]*?\];/, 
      "export const REGULAR_DATA: PokemonData[] = " + JSON.stringify(regularData, null, 2) + ";"
  );

  fs.writeFileSync('src/data/searchData.ts', newSearchDataContent);
  console.log("Updated searchData.ts");

  // Keep only used IDs in pokemonNames.ts
  const allowedIds = new Set();
  for(const p of megaData) allowedIds.add(p.id.toString());
  for(const p of regularData) allowedIds.add(p.id.toString());

  const fileContent = `export const POKEMON_KO_NAMES: Record<number, string> = ${JSON.stringify(koNames, null, 2)};\n`;
  fs.writeFileSync('src/pokemonNames.ts', fileContent);
  console.log("Updated POKEMON_KO_NAMES");
}

updatePokemonData();
