import { useState } from "react";

import type { Tags } from "@prisma/client";
import Layout from "../components/Layout";
import { api } from "../utils/api";

import { FaTimesCircle } from "react-icons/fa";
import { FiAlertTriangle } from "react-icons/fi";
import RecipeList from "../components/RecipeList";

function Recepty() {
  const [tag, setTag] = useState<Tags>();
  const { data: recipes, isLoading: recipesLoading } =
    api.recipes.getAll.useQuery(tag ? tag.name : undefined);
  const tagsQuery = api.tags.getAll.useQuery();
  const options = api.options.getAll.useQuery().data;

  if (recipesLoading) return <Layout isLoading>Loading...</Layout>;
  return (
    <>
      <Layout>
        <main className="flex min-h-screen w-full max-w-6xl flex-col items-center justify-center">
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
            {recipes && recipes.length > 0 ? (
              <RecipeList recipes={recipes} />
            ) : (
              <div className="flex flex-col items-center justify-center gap-5">
                <FiAlertTriangle size={100} className="text-yellow-300" />
                <p className="text-xs font-extralight uppercase tracking-widest">
                  Žádné recepty
                </p>
              </div>
            )}
          </div>
        </main>
      </Layout>
    </>
  );
}

export default Recepty;
