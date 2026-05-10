const checkImage = async (url: string) => {
  const res = await fetch(url);
  console.log(url, res.status);
}
checkImage('https://s3-ap-northeast-1.amazonaws.com/pokedb.tokyo/champs/assets/pokemon/icons_512/pokemon-0154-01.webp');
checkImage('https://s3-ap-northeast-1.amazonaws.com/pokedb.tokyo/champs/assets/pokemon/icons_512/pokemon-0160-01.webp');
checkImage('https://s3-ap-northeast-1.amazonaws.com/pokedb.tokyo/champs/assets/pokemon/icons_512/pokemon-0655-01.webp');
