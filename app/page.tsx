"use server";
import PokemonLayout from "@/components/PokemonLayout";
export default async function Home() {
  return (
    <main className="overscroll-contain h-fit w-screen  p-0 font-pokemonEmerald">
      <PokemonLayout />
    </main>
  );
}
