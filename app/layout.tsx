import type { Metadata } from "next";
import { Inter } from "next/font/google";
import pokemonFontEmerald from "next/font/local";
import "./globals.css";
import PokemonProvider from "./PokemonContext";
const inter = Inter({ subsets: ["latin"] });

const pokemonEmeraldFont = pokemonFontEmerald({
  src: [
    {
      path: "../public/fonts/pokemon-emerald.ttf",
      weight: "1000",
    },
  ],
  variable: "--font-pokemon-emerald",
});
export const metadata: Metadata = {
  title: "Pokemon Pokedex App",
  description: "POkemon Pokedex App made for browsers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${pokemonEmeraldFont.variable} min-w-[1400px] select-none scrollbar-none`}
    >
      <body className={inter.className}>
        <PokemonProvider>{children}</PokemonProvider>
      </body>
    </html>
  );
}
