import { useState, useEffect, useContext } from "react";
import { PokemonContext } from "@/app/PokemonContext";
export default function PokemonChainView({ extraData }: any) {
  const [chainData, setcChainData] = useState<any>([]);
  const [chainToRender, setChainToRender] = useState<any>([]);
  const [click, setClick] = useState(0);
  const PokemonContextData = useContext(PokemonContext);
  const { curGen, setCurGen, curPokemon, setCurPokemon } = PokemonContextData;
  useEffect(() => {
    async function getChain() {
      if (extraData.evolution_chain) {
        let chainRes = await fetch(extraData.evolution_chain.url);
        let chainJson = await chainRes.json();
        setcChainData(chainJson);
      }
    }

    getChain();
  }, [extraData]);

  //probably roughest part of project
  useEffect(() => {
    // console.log("chain", chainData);
    function getChainToRender() {
      let res = [];
      //get base and baby
      if (chainData.chain) {
        if (chainData.chain.is_baby) {
          res.push({
            type: "baby",
            name: chainData.chain.species.name,
            id: chainData.chain.species.url
              .split("pokemon-species/")
              .pop()
              .replace("/", ""),
          });
        } else {
          res.push({
            type: "base",
            name: chainData.chain.species.name,
            id: chainData.chain.species.url
              .split("pokemon-species/")
              .pop()
              .replace("/", ""),
          });
        }
      }
      console.log("initial chain data", chainData);
      //get evolution conditions
      function getTrigger(evolution_details: any[]) {
        let res: any[] = [];
        //get multiple evolution conditions
        let temp: any[] = [];
        evolution_details.forEach((evolution) => {
          temp = [];
          Object.keys(evolution).forEach((key) => {
            if (temp.length < 1) {
              temp.push(evolution["trigger"].name);
            }
            if (
              evolution[key] !== null &&
              evolution[key] !== "" &&
              evolution[key] !== false
            ) {
              if (key != "trigger") {
                if (evolution[key].name) {
                  if (key != "item") {
                    temp.push(key + ": " + evolution[key].name);
                  } else {
                    temp.push(evolution[key].name);
                  }
                } else {
                  temp.push(key + ": " + evolution[key]);
                }
              }
            }
          });
          res.push(temp);
        });
        return res;
      }
      // Recursively get all evolutions
      function getEvolutions(evolvesTo: any[], parentName: any) {
        evolvesTo.forEach((evolution) => {
          // console.log("evolution", evolution.species.name, "from", parentName);
          res.push({
            type: "evolution",
            name: evolution.species.name,
            from: parentName,
            trigger: getTrigger(evolution.evolution_details),
            id: evolution.species.url
              .split("pokemon-species/")
              .pop()
              .replace("/", ""),
          });
          if (evolution.evolves_to.length > 0) {
            getEvolutions(evolution.evolves_to, evolution.species.name);
          }
        });
      }

      if (chainData.chain?.evolves_to?.length > 0) {
        getEvolutions(chainData.chain.evolves_to, chainData.chain.species.name);
      } else {
        console.log("no chain", "base pokemon");
      }
      function arrangeChain(chainToRender: string | any[]) {
        let arr = [];
        let temp = [];
        let prevEvo = "";
        for (let i = 0; i < chainToRender.length; i++) {
          if (i === 0 || chainToRender[i].from === prevEvo) {
            temp.push(chainToRender[i]);
          } else {
            arr.push(temp);
            temp = [chainToRender[i]];
          }
          prevEvo = chainToRender[i].from;
        }

        if (temp.length > 0) {
          arr.push(temp); // Push the last group to arr
        }
        if (arr && arr.length >= 2 && Array.isArray(arr[arr.length - 1])) {
          arr[arr.length - 1].forEach((i: any) => (i.type = "final evolution"));
        }
        return arr;
      }
      setChainToRender(arrangeChain(res));
    }

    getChainToRender();
  }, [chainData]);
  useEffect(() => {
    async function getPokemon(id: number) {
      let res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      let json = await res.json();
      setCurPokemon(json);
    }
    getPokemon(click);
  }, [click]);
  console.log("chain", chainToRender);
  return (
    <div className="flex flex-col items-center justify-center xs:text-xs md:text-md capitalize w-full overflow-hidden divide-y gap-2">
      <div>Evolution Line</div>
      <div className={`grid grid-flow-col gap-4 w-fit h-fit`}>
        {chainToRender.map((i: any, idx: number) => (
          <div
            className="flex flex-col col-span-1 gap-4 w-full overflow-scroll scrollbar-none"
            key={idx}
          >
            {chainToRender[0][0].type === "baby" &&
            i[0].type === "evolution" ? (
              <div className="flex justify-between">
                <div>Base/{i[0].type}</div>
                <div>{"->"}</div>
              </div>
            ) : (
              <>
                {i[0].type !== "final evolution" && chainToRender.length > 1 ? (
                  <div className="flex justify-between">
                    <div>{i[0].type}</div>
                    <div>{"->"}</div>
                  </div>
                ) : (
                  <div>{i[0].type}</div>
                )}
              </>
            )}
            <div className="flex flex-col col-span-1 gap-2 w-full overflow-scroll scrollbar-none ">
              {i.map((pokemon: any) => (
                <button
                  key={pokemon.name}
                  className={`border border-white hover:border-green-400 h-fit `}
                  onClick={() => setClick(pokemon.id)}
                >
                  <div className="grid xs:grid-cols-1 md:grid-cols-2 justify-between p-4 capitalize ">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <div>{pokemon.name}</div>
                        <div>#{pokemon.id}</div>
                      </div>
                      {pokemon.trigger && (
                        <div>
                          {/* <div>
                        {pokemon.from && `evolves from ${pokemon.from}`}
                        </div> */}
                          {pokemon.trigger.map((j: any, idx: number) => (
                            <div
                              key={idx}
                              className="border-b p-1 flex flex-col"
                            >
                              {/* {idx === 0 && "Condition: "} */}
                              {j.map((i: string) => (
                                <div key={i}>{i}</div>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex mx-auto">
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                        className=" w-24"
                      ></img>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
