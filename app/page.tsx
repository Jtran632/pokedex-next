"use server";
import PokemonLayout from "@/components/PokemonLayout";
export default async function Home() {
  return (
    <main className="h-fit p-0 font-pokemonEmerald">
      <PokemonLayout />
    </main>
  );
}
