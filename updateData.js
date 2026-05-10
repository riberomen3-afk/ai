const fs = require('fs');

async function updatePokemonData() {
  console.log("Fetching data from PokeAPI...");
  const response = await fetch("https://pokeapi.co/api/v2/pokemon-species?limit=1025");
  const data = await response.json();
  
  const koNames = {};
  
  // To avoid hitting rate limits too hard, we might fetch in batches
  // But wait, pokeapi has graphql endpoint which is much faster.
  const query = `
    query {
      pokemon_v2_pokemonspecies(order_by: {id: asc}, limit: 1025) {
        id
        pokemon_v2_pokemonspeciesnames(where: {language_id: {_eq: 3}}) {
          name
        }
      }
    }
  `;
  
  const gqlResponse = await fetch("https://beta.pokeapi.co/graphql/v1beta", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({query})
  });
  
  const gqlData = await gqlResponse.json();
  
  const speciesList = gqlData.data.pokemon_v2_pokemonspecies;
  for (const species of speciesList) {
    if (species.pokemon_v2_pokemonspeciesnames.length > 0) {
      koNames[species.id] = species.pokemon_v2_pokemonspeciesnames[0].name;
    }
  }
  
  const fileContent = `export const POKEMON_KO_NAMES: Record<number, string> = ${JSON.stringify(koNames, null, 2)};\n`;
  
  fs.writeFileSync('src/pokemonNames.ts', fileContent);
  console.log("Updated POKEMON_KO_NAMES");
}

updatePokemonData();
