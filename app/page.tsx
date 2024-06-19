"use server";
async function getPokemonUrls() {
  let res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=151&offset=0`);
  return res.json();
}
async function getPokemonList() {
  let data: any = await getPokemonUrls();
  let pokelist = [];
  for (let i = 0; i < data.results.length; i++) {
    pokelist.push(data.results[i].url);
  }
  return pokelist;
}
async function getPokemonData() {
  let lst = await getPokemonList();
  let fetches = lst.map((i) => fetch(i));
  let res = await Promise.all(fetches);
  let promises = res.map((i) => i.json());
  let data = await Promise.all(promises);
  return data;
}
import Pokemon from "@/components/pokemon";
export default async function Home() {
  let data = await getPokemonData();
  let pokeData = [];
  let temp = [];
  for (let i = 0; i < data.length; i++) {
    temp.push(data[i]);
    if ((i + 1) % 36 === 0 || i === data.length - 1) {
      pokeData.push(temp);
      temp = [];
    }
  }
  // console.log(pokeData);
  return (
    <main className="grid grid-cols-2">
      <div>Pokedex</div>
      <Pokemon data={pokeData} />
    </main>
  );
}
