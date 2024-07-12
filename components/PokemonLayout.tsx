"use client";
import PokemonGridView from "./PokemonGridView";
import PokemonInfoView from "./PokemonInfoView";
import { useState, useEffect, useContext } from "react";
import { PokemonContext } from "@/app/PokemonContext";
export default function PokemonLayout() {
  const PokemonContextData = useContext(PokemonContext);
  const { curPokemon, onGrid, setOnGrid } = PokemonContextData;
  console.log("cur pokemon", curPokemon);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [onGrid]);
  function CurrentView() {
    return onGrid ? <PokemonGridView /> : <PokemonInfoView />;
  }
  return (
    <div className="flex flex-col h-screen divide-y-2 w-screen">
      {Object.keys(curPokemon).length > 0 && (
        <div className="flex justify-end gap-2 text-xs px-4 py-1">
          <button className="border p-1" onClick={() => setOnGrid(true)}>
            Pokemon Selection
          </button>
          <button className="border p-1" onClick={() => setOnGrid(false)}>
            Pokemon Info
          </button>
        </div>
      )}
      <CurrentView />
    </div>
  );
}
