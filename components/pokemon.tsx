"use client";
import { useState } from "react";
export default function Pokemon({ data }: any) {
  const [curPage, setCurPage] = useState(0);
  function CreatePages() {
    return (
      <div className="flex gap-4 justify-center">
        {Array.from({ length: data.length }, (_, i) => (
          <button
            key={i}
            className="p-2 border-2 rounded-md"
            onClick={() => setCurPage(i)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    );
  }
  function MapPokemon() {
    return (
      <div className="flex-col min-h-screen border">
        <CreatePages />
        <div className="grid xl:grid-cols-6 md:grid-cols-4 sm:grid-cols-4 p-4">
          {data[curPage].map((pokemon: any, i: number) => (
            <div className="capitalize border" key={i}>
              <div className="flex text-xs justify-around p-1">
                <div>{pokemon.id}</div>
                <div>{pokemon.name}</div>
                <div></div>
              </div>
              <img
                src={pokemon.sprites.front_default}
                className="mx-auto p-2 hover:scale-125"
              ></img>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return <MapPokemon />;
}
