import { useState } from "react";

import type { Tags } from "@prisma/client";
import { type Recepty } from "@prisma/client";
import Layout from "../components/Layout";
import { api } from "../utils/api";

import { FaTimesCircle } from "react-icons/fa";
import { FiAlertTriangle } from "react-icons/fi";
import { BounceLoader } from "react-spinners";
import RecipeCard from "../components/RecipeCard";

function Home() {
  const [tag, setTag] = useState<Tags>();
  const getRecipes = api.recipes.getAll.useQuery(tag ? tag.name : undefined);
  const tagsQuery = api.tags.getAll.useQuery();
  const options = api.options.getAll.useQuery().data;
  const [recipes, setRecipes] = useState<Recepty[]>();

  // const Dificulty = (dificulty: string) => {
  //   switch (dificulty) {
  //     case "EASY":
  //       return "Snadná";
  //     case "MEDIUM":
  //       return "Střední";
  //     case "HARD":
  //       return "Těžká";
  //     case "EXTRAHARD":
  //       return "Extrémně těžká";
  //   }
  // };

  if (getRecipes.data && !recipes) {
    const recipes = getRecipes.data;
    setRecipes([...recipes]);
  }
  if (options?.underConstruction)
    return (
      <Layout>
        <FiAlertTriangle size={200} className="text-yellow-300" />
        <h1 className="text-4xl">
          Pracuji na vylepšení webu brzy bude znovu k dispozici
        </h1>
      </Layout>
    );
  return (
    <>
      {/* <Head>
        <title>{options?.title}</title>
        <meta name="description" content="Generated by create-t3-app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head> */}
      <Layout>
        <main className="flex min-h-screen flex-col items-center justify-center">
          <div className="container flex flex-col items-center justify-center gap-12 px-6 pt-2 pb-16 ">
            <div className="flex flex-col">
              <h1 className="font-thin tracking-tighter text-primaryL-900 sm:text-6xl">
                {options?.name}
              </h1>
              <p className="relative -top-2 self-end text-primaryL-500/40">
                by Jirka Burdych
              </p>
            </div>
            {/* <h2 className="text-3xl">Recepty: </h2> */}
            <div className="flex flex-col">
              <span className="mb-3 flex flex-row items-center justify-between gap-2">
                <h3>Filtr:</h3>
                {tag && (
                  <div
                    className={`border-secondary/40 flex cursor-pointer items-center gap-2 rounded-xl border p-2 text-xs font-thin text-purple-100/70 transition-all duration-200 ease-in-out`}
                    onClick={() => setTag(undefined)}
                  >
                    Vymazat filtr
                    <FaTimesCircle />
                  </div>
                )}
              </span>
              <div className="flex flex-row flex-wrap gap-2">
                {tagsQuery.data?.map((t) => (
                  <div
                    className={`${
                      tag === t ? "bg-primary-300" : "bg-transparent"
                    } cursor-pointer rounded-full border border-primary-300 px-3 transition-all duration-200 ease-in-out`}
                    onClick={() => setTag(t)}
                    key={t.name}
                  >
                    {t.name}
                  </div>
                ))}
              </div>
            </div>
            {getRecipes.isLoading && (
              <div className="flex flex-col items-center justify-center gap-5">
                <BounceLoader color="#faba8d" />
                <p className="text-xs font-extralight uppercase tracking-widest">
                  Načítám recepty...
                </p>
              </div>
            )}
            <div className="flex h-full w-full max-w-5xl flex-col items-center justify-center gap-4">
              {getRecipes.data ? (
                getRecipes.data.map((recipe) => {
                  return <RecipeCard recipe={recipe} key={recipe.id} />;
                })
              ) : (
                <></>
              )}
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
}

export default Home;
