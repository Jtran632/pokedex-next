"use client";

import { createContext, useState, Dispatch, SetStateAction } from "react";
interface PokemonDataI {
  curGen: string;
  setCurGen: Dispatch<SetStateAction<string>>;
  curPokemon: any;
  setCurPokemon: Dispatch<SetStateAction<any>>;
}
export const PokemonContext = createContext<any>(undefined);
export default function PokemonProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [curGen, setCurGen] = useState<number>(1);
  const [curPokemon, setCurPokemon] = useState<any>({});
  return (
    <PokemonContext.Provider
      value={{ curGen, setCurGen, curPokemon, setCurPokemon }}
    >
      {children}
    </PokemonContext.Provider>
  );
}
