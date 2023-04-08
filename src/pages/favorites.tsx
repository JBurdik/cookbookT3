import { useSession } from "next-auth/react";
import Head from "next/head";
import { BarLoader } from "react-spinners";
import Layout from "../components/Layout";
import RecipeCard from "../components/RecipeCard";
import { api } from "../utils/api";

const FavoriteRecipesList = () => {
  const { data, isLoading } = api.users.getFavRecipes.useQuery();
  if (isLoading) {
    return (
      <div>
        <BarLoader color="hsla(32, 40%, 65%, 1)" />
        Načítám oblíbené recepty...
      </div>
    );
  }
  return (
    <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data &&
        data.favorites.map(({ recept }) => (
          <RecipeCard key={recept.id} recipe={recept} />
        ))}
    </div>
  );
};

const Favorites = () => {
  const { status } = useSession();
  // const { data, isLoading } = api.users.getFavRecipes.useQuery();
  if (status === "unauthenticated") return <Layout>Not logged in</Layout>;
  if (status === "loading") return <Layout isLoading>Loading </Layout>;
  return (
    <>
      <Head>
        <title>Oblíbené recepty | Naservírováno.cz </title>
      </Head>
      <Layout>
        <h1>Oblíbené recepty</h1>
        <FavoriteRecipesList />
      </Layout>
    </>
  );
};

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   const session = await getServerAuthSession(context);
//   const favRecipes = api.users.getFavRecipes.useQuery();

//   if (!favRecipes.data) return { notFound: true };

//   return {
//     props: {
//       favorites: favRecipes.data.favorites,
//     },
//   };
// }

export default Favorites;
