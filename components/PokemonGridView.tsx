"use client";
/* eslint-disable @next/next/no-img-element */
import { PokemonContext } from "@/app/PokemonContext";
import { useState, useEffect, useContext } from "react";
export default function PokemonGridView() {
  const [curPage, setCurPage] = useState(0);
  const [pokeData, setPokeData] = useState<any>([]);
  const [pokemonNames, setPokemonNames] = useState<{ [key: string]: string }>(
    {}
  );
  const PokemonContextData = useContext(PokemonContext);
  const { curGen, setCurGen, setCurPokemon, setOnGrid } = PokemonContextData;
  useEffect(() => {
    async function fetchAll() {
      async function getPokemonUrls() {
        let res = await fetch(`https://pokeapi.co/api/v2/generation/${curGen}`);
        return res.json();
      }
      async function getPokemonList() {
        let data: any = await getPokemonUrls();
        let pokelist = [];
        let names: { [key: number]: string } = {};
        for (let i = 0; i < data.pokemon_species.length; i++) {
          let s = data.pokemon_species[i].url.split("pokemon-species/").pop();
          let num = s.replace("/", "");
          pokelist.push(num);
          names[num] = data.pokemon_species[i].name;
        }
        pokelist = pokelist.sort((a, b) => a - b);
        setPokemonNames(names);
        return pokelist;
      }
      async function getPokemonData() {
        let lst = await getPokemonList();
        let res = await Promise.all(
          lst.map((i) => fetch(` https://pokeapi.co/api/v2/pokemon/${i}`))
        );
        let data = await Promise.all(res.map((i) => i.json()));
        return data;
      }
      let data = await getPokemonData();
      let pokeDataTemp = [];
      let temp = [];
      for (let i = 0; i < data.length; i++) {
        temp.push(data[i]);
        if ((i + 1) % 36 === 0 || i === data.length - 1) {
          pokeDataTemp.push(temp);
          temp = [];
        }
      }
      setPokeData(pokeDataTemp);
    }
    fetchAll();
  }, [curGen]);

  function CreatePages() {
    return (
      <div className="flex justify-center pt-8 gap-2 text-xs">
        {Array.from({ length: pokeData.length }, (_, i) => (
          <button
            key={i}
            className={`h-6 w-6 border-2 rounded-md ${
              curPage === i ? "bg-white text-black" : "bg-black text-white"
            }`}
            onClick={() => setCurPage(i)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    );
  }
  function GenSelect() {
    const regions: string[] = [
      "Kanto",
      "Johto",
      "Hoenn",
      "Sinnoh",
      "Unova",
      "Kalos",
      "Alola",
      "Galar",
      "Paldea",
    ];
    const [toggle, setToggle] = useState(false);
    return (
      <div className=" w-20 h-12 absolute right-10 pt-8">
        <div
          className="hover:text-blue-400 text-base text-center border rounded-md p-0 w-full hover:cursor-pointer"
          onClick={() => setToggle(!toggle)}
        >
          <div>{regions[curGen - 1]}</div>
        </div>
        <div
          className={`absolute w-full ${toggle ? "visible" : "hidden"} z-50`}
        >
          {Array.from({ length: 9 }, (_, i) => (
            <div
              key={`gen-${i}`}
              onClick={() => [
                setToggle(!toggle),
                setCurGen(i + 1),
                setCurPage(0),
              ]}
              className="z-50 border border-black  bg-gray-700 text-white hover:bg-gray-400 font-mono text-xs p-1"
            >
              {`${i + 1} - ${regions[i]}`}
            </div>
          ))}
        </div>
      </div>
    );
  }
  function PokemonGrid() {
    return (
      <div className="flex flex-col gap-10 ">
        <GenSelect />
        <CreatePages />
        <div className="grid xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-6 pb-4 xs:px-10 md:px-24">
          {pokeData.length > 0 && Array.isArray(pokeData[curPage]) ? (
            pokeData[curPage].map((pokemon: any, i: number) => (
              <div className="capitalize border w-full  text-xs" key={i}>
                <div className="flex justify-between px-1">
                  <div>#{pokemon.id}</div>
                  <div>{pokemonNames[pokemon.id]}</div>
                </div>
                <div className="flex justify-center px-1 w-full">
                  <img
                    src={
                      pokemon.sprites.other["official-artwork"].front_default
                    }
                    className=" w-28 scale-90 hover:scale-105 hover:animate-pulse "
                    onClick={() => [setCurPokemon(pokemon), setOnGrid(false)]}
                  ></img>
                </div>
              </div>
            ))
          ) : (
            <></>
          )}
        </div>
      </div>
    );
  }

  function MapPokemon() {
    return <PokemonGrid />;
  }
  return <MapPokemon />;
}
