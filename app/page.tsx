"use server";
import Pokemon from "@/components/pokemon";
export default async function Home() {
  return (
    <main className=" h-screen p-0 font-mono">
      <Pokemon />
    </main>
  );
}
