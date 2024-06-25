"use server";
import PokemonGridView from "@/components/PokemonGridView";
import PokemonInfoView from "@/components/PokemonInfoView";
export default async function Home() {
  return (
    <main className="min-h-screen p-0 font-pokemonEmerald">
      <div className="grid grid-cols-2 h-full">
        <PokemonInfoView />
        <PokemonGridView />
      </div>
    </main>
  );
}
