const fs = require('fs');

const supabase = JSON.parse(fs.readFileSync('supabase_response.json', 'utf8'));

// Fetch all from PokeAPI to properly get IDs for all 209 entries.
async function run() {
  const query = `
    query {
      v2_species: pokemon_v2_pokemonspecies(order_by: {id: asc}, limit: 2000) {
        id
        en: pokemon_v2_pokemonspeciesnames(where: {language_id: {_eq: 9}}) { name }
        ko: pokemon_v2_pokemonspeciesnames(where: {language_id: {_eq: 3}}) { name }
      }
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
  
  const response = await fetch("https://beta.pokeapi.co/graphql/v1beta", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({query})
  });
  
  const data = await response.json();
  const speciesList = data.data.v2_species;
  const formsList = data.data.v2_forms;

  // Let's create a map of all allowed bases and forms
  const allowed = [];
  const allowedBaseIds = new Set();
  
  for(const item of supabase) {
     if(!item.region_form) {
         allowedBaseIds.add(item.pokemon_id);
     } else {
         // It's a form. We need to find its id from formsList.
         // region_form usually matches the name in PokeAPI, e.g. "rotom-wash".
         // Let's find it!
         const formObj = formsList.find(f => f.name === item.region_form || f.name === item.region_form.replace('-breed', ''));
         if(formObj) {
            item.api_id = formObj.id;
         } else {
            console.log("NOT FOUND FORM:", item.region_form);
         }
     }
  }

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

  /* We already have a good searchData.ts file, but we should just filter it!
     Wait, it's easier to just read the current searchData.ts, parse REGULAR_DATA and MEGA_DATA,
     and filter them!
  */
}

run();
