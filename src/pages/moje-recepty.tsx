import { useSession } from "next-auth/react";
import Head from "next/head";
import Layout from "../components/Layout";
import RecipeCard from "../components/RecipeCard";
import { api } from "../utils/api";

const RecipesList = () => {
  const { data, isLoading } = api.recipes.getPersonal.useQuery();
  if (isLoading) return <Layout isLoading>Loading My Recipes...</Layout>;
  return (
    <>
      {data &&
        data.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}
    </>
  );
};

const MyRecipes = () => {
  const { status } = useSession();
  if (status === "unauthenticated") return <Layout>Not logged in</Layout>;
  if (status === "loading") return <Layout isLoading>Loading..</Layout>;
  return (
    <>
      <Head>
        <title>Moje recepty | Naservírováno.cz </title>
      </Head>
      <Layout>
        <h1>Moje recepty</h1>
        <RecipesList />
      </Layout>
    </>
  );
};

export default MyRecipes;
