const fetchLinks = async () => {
  const res = await fetch('https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent('https://champs.pokedb.tokyo/pokemon/list?rule=0'));
  const html = await res.text();
  const names = [...html.matchAll(/<div class="pokemon-name">([^<]+)<\/div>/g)].map(m => m[1]);
  console.log(names.slice(0, 30));
}
fetchLinks();
