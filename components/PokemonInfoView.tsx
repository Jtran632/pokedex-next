"use client";
/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useContext } from "react";
import ReactAudioPlayer from "react-audio-player";
import { RadarChart } from "./pokemonRadar";
import { PokemonContext } from "@/app/PokemonContext";
import { IoFemale, IoMale, IoPlay } from "react-icons/io5";
import { HiMiniSparkles } from "react-icons/hi2";
import { BiRightArrow, BiLeftArrow } from "react-icons/bi";
import { GiSpeaker } from "react-icons/gi";
import PokemonChainView from "./PokemonChainView";
export default function PokemonInfoView() {
  const PokemonContextData = useContext(PokemonContext);
  const { curGen, setCurGen, curPokemon, setCurPokemon } = PokemonContextData;
  const [extraData, setExtraData] = useState<any>({});
  const [shiny, setShiny] = useState(false);
  const [flipPokemon, setFlipPokemon] = useState(false);
  const [isFemale, setIsFemale] = useState(false);
  const [playCry, setPlayCry] = useState(false);
  const [abilityDesc, setAbilityDesc] = useState<any>({});
  const [altForms, setAltForms] = useState<any[][]>([]);
  const [altUrl, setAltUrl] = useState("");
  const [expData, setExpData] = useState<any>({});
  const [view, setView] = useState<number>(1);
  useEffect(() => {
    async function fetchSpeciesUrl() {
      let res = await fetch(curPokemon.species.url);
      return res.json();
    }
    async function fetchSpeciesInfo() {
      let res = await fetchSpeciesUrl();
      return res;
    }
    function getAbilityUrls() {
      let urls: string[] = [];
      Array.from({ length: curPokemon.abilities.length }, (_, i) =>
        urls.push(curPokemon.abilities[i].ability.url)
      );
      return urls;
    }
    async function getAbilityDesc() {
      let lst = getAbilityUrls();
      let res = await Promise.all(lst.map((i) => fetch(i)));
      let data = await Promise.all(res.map((i) => i.json()));
      return data;
    }
    if (Object.keys(curPokemon).length > 0) {
      fetchSpeciesInfo().then((res) => {
        setExtraData(res);
        setShiny(false);
        setFlipPokemon(false);
        setIsFemale(false);
        setPlayCry(false);
      });
      getAbilityDesc().then((res) => {
        setAbilityDesc(res);
      });
    }
    console.log("current pokemon", curPokemon);
  }, [curPokemon]);

  useEffect(() => {
    console.log("species data", extraData);
    let res: any[] = [];
    async function getExp() {
      let expRes = await fetch(extraData.growth_rate.url);
      let expJson = await expRes.json();
      setExpData(expJson);
    }
    if (Object.keys(extraData).length > 0) {
      Array.from({ length: extraData.varieties.length }, (_, i) => {
        if (extraData.varieties[i].pokemon.name != curPokemon.name) {
          res.push([
            extraData.varieties[i].pokemon.name,
            extraData.varieties[i].pokemon.url,
          ]);
        }
        setAltForms(res);
      });
      getExp();
    }
  }, [extraData]);

  useEffect(() => {
    async function GetAltForm() {
      let res = await fetch(altUrl);
      return res.json();
    }
    if (altUrl.length > 0) {
      GetAltForm().then((res) => {
        setCurPokemon(res);
      });
    }
  }, [altUrl]);

  function PokemonGrowth() {
    return (
      <div className="flex gap-2">
        <div className="capitalize">
          Growth Rate: {extraData?.growth_rate?.name}
        </div>
        {expData.levels && expData.levels[99] && (
          <div className="flex gap-1">
            <div>
              {"("}
              {expData.levels[99].experience}
            </div>
            <div>{"exp)"}</div>
          </div>
        )}
      </div>
    );
  }
  function PokemonAbilities() {
    let enDesc: string[] = [];
    function getEnglishDesc() {
      Array.from({ length: abilityDesc.length }, (_, i) => {
        if (Object.keys(abilityDesc[i].effect_entries).length > 0) {
          Object.keys(abilityDesc[i].effect_entries).forEach((key) => {
            if (abilityDesc[i].effect_entries[key].language.name === "en") {
              enDesc.push(abilityDesc[i].effect_entries[key].short_effect);
            }
          });
        } else {
          enDesc.push("No info in pokeapi database");
        }
      });
    }
    getEnglishDesc();
    return (
      <div className="w-full h-full p-2">
        <div className="text-md underline underline-offset-4">Abilities</div>
        {Array.from({ length: curPokemon.abilities.length }, (_, i) => (
          <div key={`ability-${i}`} className="text-xs">
            <div className="capitalize underline">
              {curPokemon.abilities[i].ability.name.replace("-", " ")}{" "}
              {curPokemon.abilities[i].is_hidden ? `[Hidden]` : ""}
            </div>
            <div>
              {"> "}
              {enDesc[i]}
            </div>
          </div>
        ))}{" "}
      </div>
    );
  }

  function PokemonVarieties() {
    return (
      <div className="grid capitalize text-white">
        <div className="text-md">Alternate Forms</div>
        {altForms.length > 0 ? (
          <div className="overflow-y-auto scrollbar-thin scrollbar-track-sky-300 max-h-[17rem] p-1">
            {altForms.map((i) => (
              <div
                key={i[0]}
                className="text-md"
                onClick={() => setAltUrl(i[1])}
              >
                {"> "}
                {i[0]}
              </div>
            ))}
          </div>
        ) : (
          <div>No alternate form</div>
        )}
      </div>
    );
  }
  function PokemonItems() {
    return (
      <div className="grid w-full h-full p-2">
        {curPokemon.held_items.length > 0 ? (
          <>
            <div>
              <div className="text-md underline underline-offset-4">
                Possible Held Items
              </div>
              {Array.from({ length: curPokemon.held_items.length }, (_, i) => (
                <div className="flex text-xs items-center capitalize" key={i}>
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${curPokemon.held_items[i].item.name}.png`}
                    className="h-4"
                  ></img>
                  <div className="flex items-center gap-1 ">
                    <div>
                      {curPokemon.held_items[i].item.name.replace("-", " ")}
                    </div>
                    <div>
                      {
                        curPokemon.held_items[i].version_details[
                          curPokemon.held_items[i].version_details.length - 1
                        ].rarity
                      }
                      %
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="underline underline-offset-4">No held items</div>
        )}
      </div>
    );
  }
  function PokemonButtons() {
    let s = `p-1 border-2 border-black rounded-md bg-white`;
    return (
      <div className="flex flex-col text-xs gap-1 justify-end h-full pb-2">
        <button className={s} onClick={() => setPlayCry(true)}>
          <ReactAudioPlayer
            src={curPokemon.cries.latest}
            autoPlay={playCry}
            onEnded={() => setPlayCry(false)}
            volume={0.1}
          />
          <GiSpeaker
            className={`w-fit fill-black ${playCry ? "fill-blue-600" : ""}`}
          />
        </button>

        {curPokemon.sprites.front_shiny && (
          <button
            onClick={() => [setShiny(!shiny), setPlayCry(false)]}
            className={s}
          >
            <HiMiniSparkles
              className={`w-fit ${!shiny ? " fill-black" : "fill-yellow-500"}`}
            />
          </button>
        )}
        {curPokemon.sprites.back_default && (
          <button
            onClick={() => [setFlipPokemon(!flipPokemon), setPlayCry(false)]}
            className={s}
          >
            {!flipPokemon ? (
              <BiRightArrow className="w-fit fill-black" />
            ) : (
              <BiLeftArrow className="w-fit fill-black" />
            )}
          </button>
        )}
        {curPokemon.sprites.front_female && (
          <button
            onClick={() => [setIsFemale(!isFemale), setPlayCry(false)]}
            className={s}
          >
            {!isFemale ? (
              <IoMale className={" w-fit fill-sky-600"} />
            ) : (
              <IoFemale className={"w-fit  fill-red-500"} />
            )}
          </button>
        )}
      </div>
    );
  }
  function PokemonView() {
    return (
      <div className="grid capitalize">
        <div className="grid grid-cols-12 bg_pokemon border-b-4 p-12">
          <div className=" col-start-2 col-end-12">
            <div className="flex justify-center items-center text-black h-full">
              <div className="flex flex-col justify-center items-center">
                <div className="text-xl">{curPokemon.name}</div>
                <div className="flex gap-1">
                  {Array.from({ length: curPokemon.types.length }, (_, i) => (
                    <img
                      key={i}
                      src={`https://veekun.com/dex/media/types/en/${curPokemon.types[i].type.name}.png`}
                      className=""
                    />
                  ))}
                </div>
                <img
                  src={
                    !shiny
                      ? !isFemale
                        ? !flipPokemon
                          ? curPokemon?.sprites?.front_default != null
                            ? curPokemon?.sprites?.front_default
                            : curPokemon?.sprites?.other["official-artwork"]
                                ?.front_default
                          : curPokemon?.sprites?.back_default
                        : !flipPokemon
                        ? curPokemon?.sprites?.front_female
                        : curPokemon?.sprites?.back_female
                      : !isFemale
                      ? !flipPokemon
                        ? curPokemon?.sprites?.front_shiny
                        : curPokemon?.sprites?.back_shiny
                      : !flipPokemon
                      ? curPokemon?.sprites?.front_shiny_female
                      : curPokemon?.sprites?.back_shiny_female
                  }
                  className="h-32"
                ></img>
              </div>
            </div>
          </div>
          <div className="col-start-12 flex items-center">
            <PokemonButtons />
          </div>
        </div>
      </div>
    );
  }
  function PokemonGeneralInfo() {
    let enGenus = [];
    if (extraData && extraData.genera && extraData.genera.length > 0) {
      enGenus = extraData.genera
        .filter((i: { language: { name: string } }) => i.language.name === "en")
        .map((i: { genus: string }) => i.genus);
    }
    return (
      <div className="capitalize">
        <div className="p-2 text-xs">
          <div>
            {curPokemon.name} - {enGenus}
          </div>
          <div>National Dex: #{extraData.id} </div>
          <div>
            Height: {curPokemon.height / 10}M (
            {((curPokemon.height / 10) * 3.28084).toFixed(2)}FT)
          </div>
          <div>
            Weight: {curPokemon.weight / 10}kg (
            {((curPokemon.weight / 10) * 2.20462).toFixed(2)}lbs)
          </div>
          <div>
            <PokemonGrowth />
          </div>
        </div>
        <PokemonAbilities />
        <PokemonItems />
      </div>
    );
  }
  function PokemonFlavorText() {
    const [curEntry, setCurEntry] = useState(0);
    let entries: any = {};
    let k: string[] = [];
    if (extraData && extraData.flavor_text_entries) {
      extraData.flavor_text_entries
        .filter((i: { language: { name: string } }) => i.language.name === "en")
        .map(
          (i: { version: { name: string }; flavor_text: string }) =>
            (entries[i.version.name] = i.flavor_text.replace("\f", " "))
        );
      k = Object.keys(entries);
    }
    return (
      <div>
        <div className="text-md underline underline-offset-4">Game</div>
        <div className="grid grid-cols-4 overflow-y-auto h-24 text-xs scrollbar-thin">
          {k.map((i) => (
            <button
              key={i}
              onClick={() => setCurEntry(k.indexOf(i))}
              className={`hover:underline underline-offset-4 capitalize p-4 ${
                curEntry === k.indexOf(i) ? "text-blue-400" : ""
              }`}
            >
              {i}
            </button>
          ))}
        </div>
        <div className="gap- flex flex-col">
          <div className="flex gap-2 text-md capitalize">
            <div className="underline underline-offset-4">Flavor Text</div>
            {" - "}
            <div>
              {"Pokemon "}
              {k[curEntry]}
            </div>
          </div>
          <div className="p-4 border-2 h-44">{entries[k[curEntry]]}</div>
        </div>
      </div>
    );
  }
  function PokemonInfo() {
    return (
      <div className="grid grid-cols-2 grid-rows-2 h-fit">
        <div className="border-2 p-2 w-full h-full">
          <PokemonGeneralInfo />
        </div>
        <div className="flex flex-col w-full p-2">
          <PokemonFlavorText />
        </div>
        <div className="border-2 p-2 w-full h-full">
          <PokemonVarieties />
        </div>
        <div className=" p-2 mx-auto w-full flex justify-center bg-white">
          {/* add a toggle and a bar representation */}
          <RadarChart data={curPokemon.stats} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col resize-none">
      <div className="grid grid-cols-12">
        {Object.keys(curPokemon).length > 0 && (
          <div className="col-span-11">
            <div className="flex flex-col h-screen p-1">
              <PokemonView />
              {view === 1 && <PokemonInfo />}
              {view === 2 && <PokemonChainView extraData={extraData} />}
            </div>
          </div>
        )}
        {Object.keys(curPokemon).length > 0 && (
          <div className="flex flex-col col-span-1 border-l border-r h-full pt-20 gap-4">
            <button
              value={1}
              className="border-2 p-2 mx-2"
              onClick={(e) => {
                setView(Number(e.currentTarget.value));
              }}
            >
              Info
            </button>
            <button
              value={2}
              className="border-2 p-2 mx-2"
              onClick={(e) => {
                setView(Number(e.currentTarget.value));
              }}
            >
              Evo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
