import { useSession } from "next-auth/react";
import Layout from "../components/Layout";
import RecipeCard from "../components/RecipeCard";
import { api } from "../utils/api";

const RecipesList = () => {
  const { data, isLoading } = api.recipes.getPersonal.useQuery();
  if (isLoading) return <Layout isLoading>Loading...</Layout>;
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
    <Layout>
      <h1>Moje recepty</h1>
      <RecipesList />
    </Layout>
  );
};

export default MyRecipes;
