import { useState, useEffect } from "react";

export default function PokemonChainView({ extraData }: any) {
  const [chainData, setcChainData] = useState<any>([]);
  const [chainToRender, setChainToRender] = useState<any>([]);
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
  console.log(chainToRender);
  return (
    <div className="capitalize h-contain w-contain p-10 overflow-hidden">
      <div className="text-md underline underline-offset-4">Evolution Line</div>
      <div
        className={`grid grid-cols-${chainToRender.length} gap-10 w-full h-full`}
      >
        {chainToRender.map((i: any, idx: number) => (
          <div
            className="flex flex-col col-span-1 gap-4 w-contain overflow-scroll scrollbar-none"
            key={idx}
          >
            <div>{i[0].type}</div>
            <div className="flex flex-col col-span-1 gap-2 w-contain overflow-scroll scrollbar-none">
              {i.map((pokemon: any) => (
                <div
                  key={pokemon.name}
                  className={`border border-yellow-100 p-3 h-fit ${
                    chainToRender.length === 1 ? "w-1/3" : ""
                  }`}
                >
                  <div className="flex justify-between">
                    <div className="grid">
                      <div className="flex items-center gap-1">
                        <div className="">{pokemon.name}</div>
                        <div className="text-xs">#{pokemon.id}</div>
                      </div>
                      {pokemon.trigger && (
                        <div className="text-xs">
                          {/* <div>
                        {pokemon.from && `evolves from ${pokemon.from}`}
                        </div> */}
                          {pokemon.trigger.map((j: any, idx: number) => (
                            <div key={idx} className="border-b p-1">
                              {idx === 0 && "Condition: "}
                              {j.join(" | ")}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                      className="h-14"
                    ></img>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
