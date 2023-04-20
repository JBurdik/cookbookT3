import Layout from "../components/Layout";
import { api } from "../utils/api";

import Link from "next/link";
import { FiAlertTriangle } from "react-icons/fi";
import RecipeCardVertical from "../components/RecipeCardVertical";
import RecipeList from "../components/RecipeList";

const RandomRecipe = () => {
  const { data, isLoading } = api.recipes.getRandom.useQuery();
  if (isLoading)
    return <Layout isLoading>Načítání receptu právě pro tebe</Layout>;
  if (!data) return <Layout>Recept nenalezen</Layout>;
  return <RecipeCardVertical recipe={data} />;
};

function Home() {
  const { data: recipes, isLoading: recipesLoading } =
    api.recipes.get3Newest.useQuery();

  if (recipesLoading) return <Layout isLoading>Loading...</Layout>;
  return (
    <>
      <Layout>
        <main className="flex min-h-screen w-full max-w-6xl flex-col items-center justify-center">
          <div className="container flex flex-col items-center justify-center gap-12 px-6 pt-2 pb-16 ">
            <div className="flex flex-col">
              <h1 className="font-thin tracking-tighter text-primaryL-900 sm:text-6xl">
                Naservírováno
              </h1>
              <p className="relative -top-2 self-end text-primaryL-500/40">
                by Jirka Burdych
              </p>
            </div>
            <section className="w-full">
              <h2 className="mb-3 w-fit border-b border-b-primaryS-600 pr-4 pb-2">
                Recept pro tebe:
              </h2>
              <RandomRecipe />
            </section>
            <section className="flex w-full flex-col gap-3">
              <h2 className="mb-3 w-fit border-b border-b-primaryS-600 pr-4 pb-2">
                Nejnovější recepty:
              </h2>
              {recipes && recipes.length > 0 ? (
                <>
                  <RecipeList recipes={recipes} />
                  <Link
                    className="text-center text-primaryS-500 transition-colors hover:text-primary-100"
                    href="/recepty"
                  >
                    Více receptů
                  </Link>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center gap-5">
                  <FiAlertTriangle size={100} className="text-yellow-300" />
                  <p className="text-xs font-extralight uppercase tracking-widest">
                    Žádné recepty
                  </p>
                </div>
              )}
            </section>
          </div>
        </main>
      </Layout>
    </>
  );
}

export default Home;
