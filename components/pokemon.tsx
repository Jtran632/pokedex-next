"use client";
import { PokemonContext } from "@/app/PokemonContext";
import { Radar } from "react-chartjs-2";
import { RadarChart } from "./pokemonRadar";
import { useState, useEffect, useContext } from "react";
export default function Pokemon() {
  const [curPage, setCurPage] = useState(0);
  const [pokeData, setPokeData] = useState<any>([]);
  const [pokemonNames, setPokemonNames] = useState<{ [key: string]: string }>(
    {}
  );
  const [extraData, setExtraData] = useState<any>({});
  const PokemonContextData = useContext(PokemonContext);
  const { curGen, setCurGen, curPokemon, setCurPokemon } = PokemonContextData;
  useEffect(() => {
    async function fetchSpecies() {
      let res = await fetch(curPokemon.species.url);
      return res.json();
    }
    async function doStuff() {
      let res = await fetchSpecies();
      return res;
    }
    if (Object.keys(curPokemon).length > 0) {
      setExtraData(doStuff());
    }
  }, [curPokemon]);

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
      <div className="flex justify-center pt-0 gap-4">
        {Array.from({ length: pokeData.length }, (_, i) => (
          <button
            key={i}
            className={`h-8 w-8 border-2 rounded-md ${
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
      <div className=" w-40 h-12 absolute right-10">
        <div
          className="hover:text-blue-400 text-base text-center border rounded-md p-2 w-full hover:cursor-pointer"
          onClick={() => setToggle(!toggle)}
        >
          <div>{regions[curGen - 1]}</div>
        </div>
        <div className={`absolute w-full ${toggle ? "visible" : "hidden"}`}>
          {Array.from({ length: 9 }, (_, i) => (
            <div
              key={`gen-${i}`}
              onClick={() => [
                setToggle(!toggle),
                setCurGen(i + 1),
                setCurPage(0),
              ]}
              className="z-50 border border-black  bg-gray-700 text-white hover:bg-gray-400 font-mono p-1"
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
      <div className="h-full">
        <div className="h-screen p-4">
          <GenSelect />
          <CreatePages />
          <div className="grid xl:grid-cols-6 md:grid-cols-4 sm:grid-cols-4 pt-6">
            {pokeData.length > 0 && Array.isArray(pokeData[curPage]) ? (
              pokeData[curPage].map((pokemon: any, i: number) => (
                <div className="capitalize border" key={i}>
                  <div className="flex text-xs justify-around p-1">
                    <div>{pokemon.id}</div>
                    <div>{pokemonNames[pokemon.id]}</div>
                    <div></div>
                  </div>
                  <img
                    src={pokemon.sprites.front_default}
                    className="mx-auto p-2 hover:scale-125 hover:animate-pulse"
                    onClick={() => setCurPokemon(pokemon)}
                  ></img>
                </div>
              ))
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    );
  }
  function Pokedex() {
    return (
      <div>
        {Object.keys(curPokemon).length > 0 ? (
          <>
            <div className="bg-white text-black h-96 w-96">
              <RadarChart data={curPokemon.stats} />
            </div>

            <div className=" p-4 border 2 flex justify-center h-full bg-red-700 text-black">
              <div className="">{curPokemon.name}</div>
              <img
                src={curPokemon?.sprites?.other?.showdown?.front_default}
                className="h-24 mx-auto"
              ></img>
              <div></div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    );
  }
  function MapPokemon() {
    return (
      <div className="grid grid-cols-2 divide-x">
        <div>
          <Pokedex />
        </div>
        <PokemonGrid />
      </div>
    );
  }
  return <MapPokemon />;
}
