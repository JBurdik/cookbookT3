import Layout from "../components/Layout";
import { api } from "../utils/api";

import RecipeCardVertical from "../components/RecipeCardVertical";

const RandomRecipe = () => {
  const { data, isLoading } = api.recipes.getRandom.useQuery();
  if (isLoading)
    return <Layout isLoading>Načítání receptu právě pro tebe</Layout>;
  if (!data) return <Layout>Recept nenalezen</Layout>;
  return <RecipeCardVertical recipe={data} />;
};

function Home() {
  const { data, isLoading } = api.example.hello.useQuery({ text: "Test" });

  if (isLoading) return <Layout isLoading>Loading...</Layout>;
  return (
    <>
      <Layout>
        <main className="flex min-h-screen w-full max-w-6xl flex-col items-center justify-center">
          {JSON.stringify(data)}
        </main>
      </Layout>
    </>
  );
}

export default Home;
